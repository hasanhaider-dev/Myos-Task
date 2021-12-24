// ************* AUDIT LOG *************
// Author            : Hasan Haider
// Version           : 1.0
// Created At        : 30 Jun 2020
// Description       : This file helps to validate data of the incoming requests.

"use strict";
const Joi = require("celebrate").Joi;
const validationmodel = {
    body: {
        productTitle: Joi.string(),
        productDescription: Joi.string(),
    },
};
export default validationmodel;
