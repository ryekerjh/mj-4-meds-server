import * as helpers from './helper.functions';    

/**
 * 
 * 
 * @param {any} email 
 * @returns 
 * Beginning of send email for new user creation:
 *  1. Get the user and related info by email address passed back
 *      during sign up.
 */
function getNewUserByEmail(email) {
    const UserTypes = require('../modules/user/model');
    const User = UserTypes.Guest;
    const mongoose = require('mongoose');
    mongoose.Promise = Promise;
        return User.findOne({email: email})
        .then(user => {
            return user;
        })
        .catch(e => {
            return { message: err + 'error was thrown'}
            throw { status: 404, message: 'User does not exist.'};
        })
    };

    /**
     * 
     * 
     * @param {any} user 
     * @returns 
     * 2. Create a token to be attached in the email to the 
     * new user. Once the token is clicked, it will help validate the user.
     */
    function createNewPasswordToken(user) {
        const UserTypes = require('../modules/user/model');
        const User = UserTypes.Guest;
        const mongoose = require('mongoose');
        mongoose.Promise = Promise;
        return generateRandomToken()
        .then(result => {
            return User.findByIdAndUpdate(user._id, {tempToken: result}, {new:true})
            .then(returnedUser => {
                return {email: user.email, token: result};
            })
            .catch(e => {
                helpers.handleErr(e);
            })
        }) 
        .catch(e => {
            helpers.handleErr(e);
        });
    };

    /**
     * 
     * 
     * @param {any} token 
     * @returns 
     * 3. Comple the email using ejs and promisify to be sent to the user.
     */
    function compileNewPasswordEmail(token) {
        require('dotenv').config();
        const fs = require("fs");
        const promisify = require("es6-promisify");
        const readFile = promisify(require("fs").readFile);
        const ejs = require('ejs');
        //Read in the file contents to be mailed to the user.
        return readFile(__dirname + '/set_password.ejs', 'utf8')
        .then((result) => {
            if(result){
                //create the token and return the email, token, and the template.
                var token_url = `${process.env.APP_BASE_URL}/#/token-login/${token.token}`;
                return {
                    email: token.email,
                    token: token.token,
                    template: ejs.render(result, {token_url: token_url})
                };
            } else  {
                helpers.handleErr('fs.readFile failed when the new user email function read in the set_password.ejs file. Refer to compileNewPasswordEmail() in helper.functions.js.');
            }
        })
        .catch((err) => {
            helpers.handleErr(err);
        });
    };
/**
 * 
 * 
 * @param {any} email 
 * 4. Send the new user activation/set password email to the user. Uses
 * nodemailer and the city's mail server.
 */
function sendNewPasswordEmail(email) {
    const rp = require('request-promise-native');
    require('dotenv').config();
    return rp({
        method: 'post',
        url: process.env.MAILGUN_URL + '/messages',
        auth: {
        user: 'api',
        pass: process.env.MAILGUN_API_KEY
        },
        form: {
        from: 'MJ4Meds Account Confirmation <' + process.env.EMAIL + '>',
        subject: 'Confirm Your Account',
        to: email.email,
        html: email.template
        }
    })
        .catch(function(err) {
            console.log(err);
        });
};

function generateRandomToken() {
    return new Promise((resolve, reject) => {
    // set the length of the string
    var stringLength = 30;

    // list containing characters for the random string
    var stringArray = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','!','?'];
        var rndString = "";
        // build a string with random characters
        for (var i = 1; i < stringLength; i++) { 
            var rndNum = Math.ceil(Math.random() * stringArray.length) - 1;
            rndString = rndString + stringArray[rndNum];
        };
        resolve(rndString);
        });
	};

/**
 * 
 * 
 * @export
 * @param {any} email 
 * Function that ties the new user email functions together
 */
export function setPassword(email) {
    getNewUserByEmail(email)
    .then(createNewPasswordToken)
    .then(compileNewPasswordEmail)
    .then(sendNewPasswordEmail)
    .catch(function (err) {
        helpers.handleErr(err);
        return err.status || 500, err
    });
};

export function handleErr(err) {
    console.log(err);
};