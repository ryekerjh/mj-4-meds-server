import express from 'express';
// import jwt from '../../helpers/jwt';
import bcrypt from 'bcrypt-nodejs';
import * as helpers from '../../helpers/helper.functions';
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const ObjectId = require('mongoose').Types.ObjectId;
const UserTypes = require('./model');
const User = UserTypes.Guest;
const Member = UserTypes.Member;
require('dotenv').config();

export class UserModule {
    
    constructor() {
        this.model = User;
        this.router = express.Router();
        //User routes 
        this.router.route('/')
            .get(this.getAll)
            .post(this.createUser)  
        this.router.route(':id')
            .get(this.getUser)
            .put(this.updateUser)       
  }

    getAll(req, res) {
        return User
        .find()
        .populate('cart favorites orders')
        .then(users =>{
            res.json(users);
        })
        .catch(e => {
            res.json(e);
        });
    }

    createUser(req, res) {
        // TODO: add check for if its a guest being created. If so, 
        // just make a very summary user.
        let newUser = req.body.user;
        return User.findOne({email: newUser.email})
        .then(user => {
            if(user) {res.send({message: "You already have an account!"})}
            else {
                let userToSave = new User({
                    email: newUser.email,
                    role: newUser.role
                });
                return userToSave.save()
                .then((savedUser) => {
                    helpers.setPassword(savedUser.email);
                })
                .then(() => {
                    res.send({
                        message: `Please check your email at ${user.email} to verify your account.`
                    });
                })
                .catch((err) => {
                    helpers.handleErr(err);
                });
            }
        })
        .catch(err => {
            helpers.handleErr(err);
        });
    };

    // verifyUser(req, res) {
    //     let newUser = req.body.user;
    //     Password.findOne({_id: newUser.token}, (err, token) => {
    //         let userId = token.user;
    //         bcrypt.hash(newUser.password, null, null, function(err, hash) {
    //         if (err) {
    //             res.json({error: err})
    //         } else {
    //             newUser.password = hash;
    //             User.findOne({_id: userId})
    //             .select('+password')
    //             .exec((err, userToUpdate) => {
    //                 if(err) {
    //                     res.send({
    //                         error: err,
    //                         message: `Server responded with ${err}.`
    //                     })
    //                 } else if(userToUpdate) {
    //                     User.update({_id: userToUpdate._id}, newUser, {new:true}, (err, result) => {
    //                         if(err) {
    //                             res.send({
    //                                 error: err,
    //                                 message: `Server responded with ${err}.`
    //                             })
    //                         } else {
    //                             var token = jwt.sign({
    //                                 email: userToUpdate.email, 
    //                                 _id: userToUpdate._id, 
    //                                 role: userToUpdate.role},
    //                                 process.env.JWT_SECRET);
                
    //                             res.send({
    //                                 user: userToUpdate,
    //                                 code: 200,
    //                                 token: token,
    //                                 message: `Your user was created successfully. You will be redirected to the property management portal shortly.`
    //                             })
    //                         }
    //                     })
    //                 } else {
    //                     //TODO: This happens when the user no longer exists in DB
                        
    //                     console.log('something went wrong');
    //                 }
    //             })
    //         }
    //         })
    //     })
    // };

    // authenticate(req, res) {
    //     console.log('should not be attached to no auth');        
    //     User.findOne({email: req.body.email})
    //         .select('+password')
    //         .exec((err, user) => {
    //         if (user) {
    //         bcrypt.compare(req.body.password, user.password, (err, response) => {
    //             if (response) {
    //             var token = jwt.sign({
    //                 email: user.email, 
    //                 _id: user._id, 
    //                 firstName: user.firstName,
    //                 person:user.people[0],
    //                 lastName: user.lastName,
    //                 role: user.role},
    //                 process.env.JWT_SECRET);

    //                 res.json({
    //                     token: token,
    //                 });

    //             } else {
    //                 res.json({
    //                     message: 'Incorrect password. Please try again.',
    //                     errors: err
    //                 })
    //             }
    //         })
    //         } else {
    //             res.json({
    //                 message: 'This email is not registered in our system.'
    //             })
    //         }
    //     })
    // }

    updateUser(req, res) {
        let thisUser = req.body;
        return User.findOneAndUpdate({ _id: thisUser._id}, thisUser)
        .then(updatedUser => {
            res.send(updatedUser);
        })
        .catch(err => {
           res.send({message: `The server responded with error: ${err}`})                
        });
    };

    // searchUsers(req, res){
    //     const skip = parseInt((req.body.page) - 1) * 50 ;        
    //     const searchBy = req.body.searchBy;
    //     let searchTerm  = req.body.searchTerm;
    //     let sortBy = req.body.sortBy || 'createdAt';     
    //     let regex = new RegExp(searchTerm, "i");
    //     let query = {};
    //     if(searchTerm.trim().length > 0){
    //         query[searchBy] = regex;
    //     }
    //     if(searchBy === 'createdAt') {
    //         searchTerm = new Date(searchTerm);
    //         query[searchBy] = { $gte: searchTerm };
    //     }   
    //     console.log(query, '<<<query');
    //     return User.find(query).count() 
    //     .then(count => {
    //         return User.find(query)
    //         .populate('people')
    //         .skip( skip )
    //         .limit(25)
    //         .sort(sortBy)          
    //         .exec()
    //         .then((users)=>{
    //             var returnObj = {users: users, count: count}
    //                 res.json(returnObj);
    //             }, (err)=>{
    //                 res.json(err);
    //             })
    //     }, (err) => {
    //         helpers.handleErr(err);
    //     })
    // }

    // removePerson(req, res){
    //     let personId = req.body.personId;
    //     let userId = req.body._id;
    //     return User.findOne({_id:userId})
    //         .exec()
    //         .then((user)=>{
    //           return user.update({$pull: { people: { $in: [personId]} }})
    //               .then((updated)=>{
    //                 res.json({message: `Property Owner was removed from your account.`})
    //               }, (err)=>{
    //                 res.json({error: true, message:"There was an error", details: err})
    //               })
    
    //         }, (err)=>{
    //           res.json({error: true, message:"There was an error", details: err});
    //         })
    //   };

    getUser(req, res) {
        let userId = req.params.id;
        return User.findOne({_id: userId})
        .populate('cart')
        .populate('favorites')
        .then(user => {
            res.send(user)
        })
        .catch(err => {
            console.log(err);
            res.send({message: `The server responded with error: ${err}`})
        })
    }

    // deleteUser(req, res) {
    //     let userId = req.params.id;
    //     return User.remove({_id: userId})
    //     .exec()
    //     .then(data => {
    //         res.send(200)
    //     })
    // }

}