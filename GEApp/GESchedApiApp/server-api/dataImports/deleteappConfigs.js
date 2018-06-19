'use strict';

// Delete all appconfigss for a site.

const fs = require('fs'); // File system.
const appRoot = require('app-root-path'); 
const mongoose = require('mongoose'); // Helper libray for MongoDB. http://mongoosejs.com/ 
const appConfig = require(`${appRoot}/server.config`); // Load app configuration settings server.config.js
const logger = require(`${appRoot}/server-api/logger`); // Create logging helper
const getAppconfigType = require(`${appRoot}/server-api/models/appconfigsModel`);

mongoose.Promise = global.Promise;

const args = process.argv; 
var siteCode = appConfig.defaultSite; // The current default in HLS-MA in server.config.js

// if a site code is passed in on the command-line then use it. For example:
// node ./server-api/dataImports/deleteAppconfigs.js HLS-MA
// Appconfig: currently in VS Code debug mode you have to rely on using the appConfig.defaultSite setting.
if (args.length == 3 && args[2] != null) { siteCode = args[2]; }


let Appconfig = getAppconfigType(siteCode);

const delyInSecs = 3;
const timer = setInterval(() => deleteAppconfigs(), delyInSecs * 1000); // Ensures db connection is established in getAppconfigType since it's an async operation.



function deleteAppconfigs() {

    clearInterval(timer);
    
    // Match any name therefore, deleting all.
    Appconfig.deleteMany({ type: /(.*?)/ }) 
        .then(function () {
            logger.info(`ADMIN: All Appconfigs deleted for site: ${siteCode}`);

            mongoose.disconnect((err) => {
                if (err) {
                    logger.error(`ADMIN: Appconfig.deleteMany failed for site: ${siteCode}! Error: ${err}`);
                } else {
                    logger.info(`ADMIN: Disconnected from database for site: ${siteCode}.`);
                }
                process.exit();
            });            
           
        })
        .catch (function (err) { 
            logger.error(`ADMIN: Appconfig.deleteMany failed for site: ${siteCode}! Error: ${err}`);
            
            mongoose.disconnect();
            logger.info(`ADMIN: Disconnect from database for site: ${siteCode}`);
        });
}

