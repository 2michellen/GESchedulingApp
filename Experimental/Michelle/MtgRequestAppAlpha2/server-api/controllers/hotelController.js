'use strict';

const appRoot = require('app-root-path');
const appConfig = require(`${appRoot}/server.config`); // Load app configuration settings.

const requestHelper = require(`${appRoot}/server-api/requestHelper`);
const logger = require(`${appRoot}/server-api/logger`);
const getHotelType = require(`${appRoot}/server-api/models/hotelModel`);



exports.getHotels = function (req, res) {
    logger.verbose('hotelController.getHotels begin');

    let siteCode = requestHelper.getSite(req);
    let Hotel = getHotelType(siteCode);

    var sortDirective = { "name": 1}; //default, order by name, ascending
    if (req.query.orderby != null) {
        if (req.query.orderby.toLowerCase() == 'seqnum:1') {
            sortDirective = { "seqNum": 1};  //ascending order
        } else if (req.query.orderby.toLowerCase() == 'seqnum:-1') {
            sortDirective = { "seqNum": -1}; //descending order
        }
    }

    var filterDirective = {}; //default, no filering
    if (req.query.namecontains != null) {    
        const regExpression = new RegExp(`(${req.query.namecontains})`);
        filterDirective = { "name": regExpression};        
    }

    Hotel.find(filterDirective).sort(sortDirective)
        .then((hotels) => {
            logger.info(`hotelController.getHotels - Hotel.find success. About to send back http response with ${hotels.length} hotels`);
            res.status(200).json(hotels);  // 200 - OK
        })
        .catch((err) => {
            var errMsg = `hotelController.getHotels - Hotel.find failed. Error: ${err}`;
            logger.error(errMsg);
            res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        });
};



exports.createHotel = function (req, res) {
    logger.verbose('hotelController.createHotel begin');

    try {
        let siteCode = requestHelper.getSite(req); 
        let Hotel = getHotelType(siteCode);
        var newHotel = new Hotel(req.body);

        var validationErr = newHotel.validateSync();
        if (validationErr != null) {
            for (var prop in validationErr.errors) {
                logger.error(`hotelController.createHotel - create new Hotel validation error: ${validationErr.errors[prop]}`);
            }
            var errMsg = `hotelController.createHotel - create new Hotel failed validation. ${validationErr}`;
            logger.error(errMsg);
            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST
            return;
        }

    } catch (err) {
        var errMsg = `hotelController.createHotel - problem with creating a new Hotel. Error: ${err}`;
        logger.error(errMsg);
        res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        return;
    }

    newHotel.save()
    .then((hotel) => {
        logger.info(`hotelController.createHotel - Hotel.save success. About to send back http response with hotel called ${hotel}`);
        res.status(201).json(hotel); // 201 - CREATED
    })
    .catch((err) => {
        var errMsg = `hotelController.createHotel - Hotel.save failed. Error: ${err}`
        logger.error(errMsg);
        res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
    });

};



exports.updateHotel = function (req, res) {
    logger.verbose('hotelController.updateHotel begin');

    try {

        let siteCode = requestHelper.getSite(req);
        var Hotel = getHotelType(siteCode);

        var toUpdateHotel = new Hotel(req.body);

        var validationErr = toUpdateHotel.validateSync();
        if (validationErr != null) {
            for (var prop in validationErr.errors) {
                logger.error(`hotelController.updateHotel - the updated Hotel validation error: ${validationErr.errors[prop]}`);
            }
            var errMsg = `hotelController.updateHotel - the updated Hotel failed validation. ${validationErr}`;
            logger.error(errMsg);
            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST
            return;
        }

    } catch (err) {
        var errMsg = `hotelController.updateHotel - problem with updating Hotel. Error: ${err}`;
        logger.error(errMsg);
        res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        return;
    };

    // Create a set of object properties to be updated and excluding the special ones such as timestamps and version managed internally by MongoDB.
    var updateWith = {
        name: toUpdateHotel.name, 
        address: toUpdateHotel.address 
    };
    if (toUpdateHotel.phone != null) { updateWith.phone = toUpdateHotel.phone; }
    if (toUpdateHotel.corporateRates != null) { updateWith.corporateRates = toUpdateHotel.corporateRates; }
    if (toUpdateHotel.seqNum != null) { updateWith.seqNum = toUpdateHotel.seqNum; }


    Hotel.update({"_id": toUpdateHotel._id }, { $set: updateWith }, function (err) {
        if (err) {
            var errMsg = `hotelController.updateHotel - Hotel.find failed. Error: ${err}`
            logger.error(errMsg);
            res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        } else {

            Hotel.findById(toUpdateHotel._id)
            .then((hotel) => {
                if (hotel == null) {
                    var errMsg = `hotelController.updateHotel - unable to find the updated Hotel by id ${toUpdateHotel._id}. Error: ${err}`;
                    logger.error(errMsg);
                    res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR 
                } else {
                    logger.info(`hotelController.updateHotel - found updated hotel by id ${toUpdateHotel._id}. About to send back http response with hotel:\n ${hotel}`);
                    res.status(200).json(hotel);  // 200 - OK
                }
            })
            .catch((err) => {
                var errMsg = `hotelController.updateHotel - error finding the updated Hotel by id ${toUpdateHotel._id}. Error: ${err}`;
                logger.error(errMsg);
                res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR 
            });

        }
    });

};



exports.getHotel = function (req, res) {
    logger.verbose('hotelController.getHotel begin');

    let siteCode = requestHelper.getSite(req);
    let Hotel = getHotelType(siteCode);

    Hotel.findById(req.params.id)
        .then((hotel) => {
            if (hotel == null) {
                var errMsg = `hotelController.getHotel - Hotel.findById did not find a hotel with id ${req.params.id}.`;
                logger.error(errMsg);
                res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
            } else {
                logger.info(`hotelController.getHotel - Hotel.findById success. About to to send back http response with hotel:\n ${hotel}`);
                res.status(200).json(hotel);  // 200 - OK
            }
        })
        .catch((err) => {
            var errMsg = `hotelController.getHotel - Hotel.findById failed. Error: ${err}`;
            logger.error(errMsg);
            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
        });

};



exports.deleteHotel = function (req, res) {
    logger.verbose('hotelController.deleteHotel begin');

    let siteCode = requestHelper.getSite(req);
    let Hotel = getHotelType(siteCode);

    Hotel.findByIdAndRemove(req.params.id)
    .then((hotel) => {
        if (hotel == null) {
            var errMsg = `hotelController.deleteHotel - Did not find the hotel to be deleted by id ${req.params.id}.`;
            logger.error(errMsg);
            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
        } else {
            logger.info(`hotelController.deleteHotel - Hotel.findByIdAndRemove ${req.params.id} success. Deleted hotel called ${hotel.name}`);
            res.status(204).send();  // 204 - NO CONTENT 
        }
    })
    .catch((err) => {
        var errMsg = `hotelController.deleteHotel - Hotel.findByIdAndRemove ${req.params.id} failed. Error: ${err}`;
        logger.error(errMsg);
        res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
    });
};