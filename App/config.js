const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const path = require('path');
const Sequelize = require('sequelize');
const joi = require('joi');
const randtoken = require('rand-token') 

// Joi v17+ ya no expone `joi.validate(value, schema)`.
// Este wrapper mantiene compatibilidad con el código existente del proyecto.
if (typeof joi.validate !== 'function') {
    joi.validate = (value, schema) => joi.object(schema).validate(value);
}

const nombreBaseDeDatos = process.env.DATABASE_NAME || 'tucarrera';
const usrBaseDeDatos = process.env.DATABASE_USER || 'user2026';
const pswBaseDeDatos = process.env.DATABASE_PASSWORD || '123456';
const secreto = "Krr3r4.0K@-3duKz10N=?";
const refreshTokens = {};

const domain = 'https://tucarrera.co/#/';
const baseURL = 'https://tucarrera.co/#/';
const serverURL = 'https:/api.tucarrera.co/uploads/';
//const baseURL = 'http://31.220.60.37/#/';
//const serverURL = 'http://31.220.60.37/uploads/';
//const baseURL = 'http://localhost:4200/#/';
//const serverURL = 'http://localhost:49153/';
//const serverURL = 'http://localhost:5000/';

const emailContacto = 'ingenieria.tucarrera.co@gmail.com'; 




const sequelize = new Sequelize(nombreBaseDeDatos, usrBaseDeDatos, pswBaseDeDatos, {
    host: process.env.DATABASE_HOST || 'localhost',
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    port: process.env.DATABASE_PORT || 3306
});


module.exports = {
    //Librerías
    bcrypt,
    express,
    joi,
    jwt,
    path,
    randtoken, 
    refreshTokens, 
    sequelize,
    Sequelize,

    //Valores
    secreto,
    baseURL,
    serverURL, 
    emailContacto, 
    domain,
}
