import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import Password from './model';
import UserTypes from '../users/model';
const User = UserTypes.User;
import * as helpers from '../../helpers/helper.functions';
// import jwt from '../../helpers/jwt';
require('dotenv').config();

export class PasswordModule {
  constructor() {
    this.model = Password;
    this.router = express.Router();
    //Password Routes
    this.router.route('/send-reset-email')
      .post(this.sendResetEmail)
    this.router.route('/reset-password/no-auth')
      .post(this.resetPasswordNoAuth)
    this.router.route(jwt.protect, '/reset-password/:id')
      .put(this.resetPassword)
  };

  /**
   * 
   * 
   * @param {any} req 
   * @param {any} res 
   * @memberof PasswordModule
   * Resets password when the user resubmits their new password 
   * protected so that only the user can reset their own password
   */
  resetPassword(req, res) {
    if(req.current_user._id == req.params.id) {
      var userId = req.params.id;
      var passToHash = req.body.password;
      bcrypt.hash(passToHash, null, null, function (err, hash) {
        if (err) {
          helpers.handleErr(err);
          res.send({
            message: "Password reset failed. Please try again."
          });
        }
        User.findOneAndUpdate({
          _id: userId
        }, {
          $set: {
            password: hash
          }
        }, {
          new: true
        }, (err, savedPass) => {
          if (err) {
            helpers.handleErr(err);
            res.send({
              message: `Error ${err} occurred on the server.`
            })
          } else {
            res.send({
              message: `${savedPass.email}'s password was updated`
            });
          }
        });
      });
    } else {
      res.status(401);
      res.send({message: 'You are not authorized to reset this user\'s password.'});
    }
  };

  /**
   * 
   * 
   * @param {any} req 
   * @param {any} res 
   * @memberof PasswordModule
   * When user asks to reset password from within the app, send their registered email 
   * address an email to reset.
   */
  sendResetEmail(req, res) {
    User.findOne({
      email: req.body.email
    }, (err, user) => {
      if (err) {
        helpers.handleErr(err);
        res.send({
          message: `Server responded with error code ${err}`
        });
      } else if (user == null) {
        res.send({
          message: `${req.body.email} is not currently registered. Please register to begin the process.`
        });
      } else {
        helpers.resetPassword(user.email);
        res.send({
          message: `A reset email was successfully sent to ${user.email}`
        });
      }
    });
  };

  /**
   * 
   * 
   * @param {any} req 
   * @param {any} res 
   * @memberof PasswordModule
   * After user click on token to reset their password from forgetting it, search in our 
   * passwords collection for the token that matches, then find the user tied to that token,
   * and reset the password.
   */
  resetPasswordNoAuth(req, res) {
    var pwdToken = req.body.token;
    var newPwd = req.body.password;
    Password.findOne({
      _id: pwdToken
    }).populate('user').exec((err, password) => {
      bcrypt.hash(newPwd, null, null, function (err, hash) {
        if(err) {helpers.handleErr(err);}
        User.findOneAndUpdate({
          _id: password.user._id
        }, {
          $set: {
            password: hash
          }
        }, {
          new: true
        }, (err, savedPass) => {
          if (err) {
            helpers.handleErr(err);
            res.send({
              message: `Server responded with error code ${err}`
            });
          } else {
            res.send({
              message: `Password reset successfully. You will be redirected to the login page.`
            });
          }
        });
      });
    });
  };
};