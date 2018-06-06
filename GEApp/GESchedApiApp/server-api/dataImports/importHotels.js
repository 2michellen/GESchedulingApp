'use strict';

// Import hotels to the database.

const fs = require('fs'); // File system.
const appRoot = require('app-root-path'); 
const mongoose = require('mongoose'); // Helper libray for MongoDB. http://mongoosejs.com/ 
const appConfig = require(`${appRoot}/server.config`); // Load app configuration settings server.config.js
const logger = require(`${appRoot}/server-api/logger`); // Create logging helper
const getHotelType = require(`${appRoot}/server-api/models/hotelModel`);

mongoose.Promise = global.Promise;

const args = process.argv; 
var siteCode = appConfig.defaultSite; // The current default in HLS-MA in server.config.js

// if a site code is passed in on the command-line then use it. For example:
// node ./server-api/dataImports/importHotels.js HLS-MA
// Note: currently in VS Code debug mode you have to rely on using the appConfig.defaultSite setting.
if (args.length == 3 && args[2] != null) { siteCode = args[2]; }

const fileName = `hotels-${siteCode}.txt`;

let Hotel = getHotelType(siteCode);

var totalNumOfHotels = 0;
var totalNumOfHotelsCreated = 0;

const delyInSecs = 3;
const timer = setInterval(() => doSheetImport(), delyInSecs * 1000); // Ensures db connection is established in getHotelType since it's an async operation.



function doSheetImport() {

    try {
        clearInterval(timer);

        var fileData = fs.readFileSync(`./server-api/dataImports/dataFiles/${fileName}`).toString()
        
        var result = extractHotelItems(fileData);
        if (result.success) {
            console.log(`Total number of hotels parsed: ${result.hotels.length}`);
            console.log(result.hotels);
            result.hotels.forEach((hotel) => createHotel(hotel));
        } else {
            process.exit();
        }

    } catch (err) {
        logger.error(`ADMIN: Error importing the Hotel collection into the database! Error: ${err}`);
        mongoose.disconnect();
        process.exit();
    }
}


function extractHotelItems(fileData) {
    var result = null;
    var hotelItems = [];
    var newHotel = null;
    var errorEncountered = false;
    var currentItemSeq = 0;

    fileData.split(/\r?\n/).every((line) => {

        var directive = null;
        var lineProcessed = false;

        logger.info(`Processing line: ${line}`);

        directive = "--hotel.Name:";
        if (line.search(directive) > -1) {            
            // Complete and store the previous pending hotel object if exist.
            if (newHotel != null) {
                var success = ValidateAndCollectHotel(newHotel, hotelItems);
                if (!success) {
                    errorEncountered = true;
                    return false; // Return false to stop additional line processing.
                }
            }

            var hotelName = line.replace(directive, "").trim();
            // Start a new hotel instance to gather its properties.
            if (hotelName != "") {

                currentItemSeq += 1;

                newHotel = { 
                    seqNum: currentItemSeq,
                    name: hotelName 
                }
            } else {
                logger.error("ERROR: The hotel name is required!");
                errorEncountered = true;
                return false; // Return false to stop additional line processing.
            }

            lineProcessed = true;
        }

        directive = "--hotel.Address:"; // Note, there can be multiple address lines.
        if (!lineProcessed && line.search(directive) > -1) {
            var hotelAddressLine = line.replace(directive, "").trim();
            if (hotelAddressLine != "") {
                if (!newHotel.hasOwnProperty("address")) {
                    newHotel.address = []; // Create the address line array.               
                }
                newHotel.address.push(hotelAddressLine);
            }
        }

        directive = "--hotel.Phone:";
        if (!lineProcessed && line.search(directive) > -1) {
            var hotelPhone = line.replace(directive, "").trim();
            if (hotelPhone != "") {
                newHotel.phone = hotelPhone;
            }
        }

        directive = "--hotel.Fax:";
        if (!lineProcessed && line.search(directive) > -1) {
            var hotelFax = line.replace(directive, "").trim();
            if (hotelFax != "") {
                newHotel.fax = hotelFax;
            }
        }

        directive = "--hotel.CorpRates:";
        if (!lineProcessed && line.search(directive) > -1) {
            var hotelCorpRates = line.replace(directive, "").trim();
            if (hotelCorpRates != "") {
                newHotel.corpRates = hotelCorpRates;
            }
        }

        return true; // Return true to continue processing for the next line item.
    })

    // Check to see if there's one last pending new one to be collected.
    if (errorEncountered == false && newHotel != null) {
        var success = ValidateAndCollectHotel(newHotel, hotelItems);
        if (!success) {
            errorEncountered = true;
        }
    }

    result = {
        success: true,
        hotels: hotelItems
    }

    if (errorEncountered == true) {
        result.success = false;
    } 

    return result;
}


function ValidateAndCollectHotel(newHotel, hotelItems) {
    var valid = ValidateHotel(newHotel);
    if (valid) {
        hotelItems.push(newHotel);
        totalNumOfHotels += 1;
        return true;
    } else {
        return false;
    }
}


function ValidateHotel(newHotel) {
    if (!newHotel.hasOwnProperty("name") || newHotel.name == "") {
        logger.error("ERROR: The hotel name is required!");
        return false;
    }
    if (!newHotel.hasOwnProperty("address") || newHotel.address.length == 0) {
        logger.error("ERROR: The hotel address is required!");
        return false;
    }
    return true;
}


function createHotel(hotel) {

    try {
        logger.info(`ADMIN: Adding hotel (${hotel.name}) to the database.`);

        var newHotel = new Hotel(hotel);

        var validationErr = newHotel.validateSync();
        if (validationErr != null) {
            for (var prop in validationErr.errors) {
                logger.error(`ADMIN: createHotel - create new Hotel validation error: ${validationErr.errors[prop]}`);
            }
            var errMsg = `ADMIN: createHotel - create new Hotel failed validation. ${validationErr}`;
            logger.error(errMsg);
            mongoose.disconnect();
            return;
        }

    } catch (err) {
        var errMsg = `ADMIN: createHotel - problem with creating a new Hotel. Error: ${err}`;
        logger.error(errMsg);
        mongoose.disconnect();
        return;
    }

    newHotel.save()
        .then((hotel) => {
            logger.info(`ADMIN: createHotel - Hotel.save success:\n${hotel}`);
            totalNumOfHotelsCreated += 1;

            if (totalNumOfHotelsCreated == totalNumOfHotels) {
                // All accounted for therefore it can disconnect from the database.
                logger.info(`ADMIN: All ${totalNumOfHotelsCreated} hotels are created for site: ${siteCode}.`);

                mongoose.disconnect((err) => {
                    if (err) {
                        logger.error(`ADMIN: Hotel.deleteMany failed for site: ${siteCode}! Error: ${err}`);
                    } else {
                        logger.info(`ADMIN: Disconnected from database for site: ${siteCode}.`);
                    }
                    process.exit();
                });  
            }
        })
        .catch((err) => {
            var errMsg = `ADMIN: createHotel - Hotel.save failed. Error: ${err}`
            logger.error(errMsg);
            mongoose.disconnect();
            return;
        });

};