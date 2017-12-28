import express from 'express';
// import jwt from '../../helpers/jwt';
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const Order = require('./model');
require('dotenv').config();

export class OrderModule {
    
    constructor() {
        this.model = Order;
        this.router = express.Router();
        //Order routes 
        this.router.route('/')   
  };
};