import jwt from 'jsonwebtoken';
import _ from 'lodash';
import mongoose from 'mongoose';  
import UserTypes from '../modules/user/model';
const User = UserTypes.Guest;
require('dotenv').config();
const secret = process.env.JWT_SECRET;

function sign(payload, secret){

    const jwtToken = jwt.sign(payload, secret, {noTimestamp: true});
    return jwtToken;
}

function verify(token){  
    try{
        return jwt.verify(token, secret);
    } catch(err){
        return null;
    }
}

function protect(req, res, next) {
    if(req) {          
        if(!req.headers.authorization) {
            res.status(401);
            return res.json({error: 'Missing authorization header'});
        } else if(req.headers.authorization) {
            const user = verify(req.headers.authorization.split(' ')[1]);
            if(!user) {
                res.status(401);
                return res.json({error: 'Invalid authorization header'});
            }
            User.findOne({_id: user._id})
            .select('-password -__v')
            .exec()
            .then(user => {
                req.current_user = user;
                next();
            })
            .catch(err => {
                console.log(err, 'error');
            });
        }
    }
};

function isAdmin(req, res, next) {
    if(req.current_user) {
        if(req.current_user.role === 'admin' || req.current_user.role === 'superadmin') {
            next();
        } else {
            res.status(401);
            return res.json({error: 'You are not authorized to access this route'});
        }
    } else {
        res.status(401);
        return res.json({error: 'You are not authorized to access this route'});
    }
};

function stripRole(req, res, next) {
    if(req.body) {
        if(req.body.hasOwnProperty('role')) {
            if(req.current_user !== 'superadmin') {
                delete req.body.role;
                next();
            } else {
                next();
            }
        }
    }
};

module.exports = {
    sign: sign,
    verify: verify,
    protect: protect,
    isAdmin: isAdmin,
    stripRole: stripRole
};