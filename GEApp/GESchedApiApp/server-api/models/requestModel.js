'use strict';

const appRoot = require('app-root-path');
const getDbConnection = require(`${appRoot}/server-api/databaseManager`);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// The schema definition for a request entity

const RequestSchema = new Schema({

    title: {
        type: String,
        required: [true, 'Title is required!']
    },

    requestEmail: {
        type: String,
        required: [true, 'Request email is required!']
    },

    requesterName: {
        type: String,
        required: [true, 'Requester name is required!']
    },

    numOfGeEmpAttending: {
        type: Number,
        required: [true, 'Number of GE Employees attending is required!']
    },

    numOfNonGeAttending: {
        type: Number
    }
}, 
{
    timestamps: true // auto-add createdAt and updatedAt
});


// Object to hold a request model per site.
var requestModelBySite = {};


// Return a request model using the corresponding site database connection.
module.exports = function (siteCode) {   

    let siteCodeUpper = siteCode.toUpperCase();
    if (requestModelBySite[siteCodeUpper] == null) {
        let dbConnection = getDbConnection(siteCodeUpper);       
        // Mongoose automatically creates a hotel collection if one does not exist.
        requestModelBySite[siteCodeUpper] = dbConnection.model(`request`, RequestSchema);
    }
    return requestModelBySite[siteCodeUpper];

}