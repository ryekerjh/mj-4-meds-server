import express from 'express';
// import jwt from '../../helpers/jwt';
const mongoose = require('mongoose');
mongoose.promise = Promise;
const ObjectId = require('mongoose').Types.ObjectId;
const Product = require('./model');
require('dotenv').config();

export class ProductModule {
    
    constructor() {
        this.model = Product;
        this.router = express.Router();
        //Product routes 
        this.router.route('/') 
            .get(this.getAllProducts);
  };

  getAllProducts(req, res) {
    Product.find({})
    .then(products => {
        res.send(products);
    }, (e) => {
        console.log('error', e);
    });
  };
};