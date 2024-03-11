// routes/rateRoutes.js

import express from 'express';
import { getallRateItem, addRateItem, updateRateItem, deleteRateItem, getRateItemById, getLatestVATPercentage } from '../controllers/ratecontroller';

const rateroute = express.Router();

rateroute.get('/getallrates', getallRateItem);
// each rate
rateroute.get('/geteachrate/:rate_id', getRateItemById);

// Route for adding a new rate
rateroute.post('/addrates', addRateItem);


// Route for updating an existing rate
rateroute.put('/updaterates/:rate_id', updateRateItem);

// Route for deleting a rate
rateroute.delete('/deleterates/:rate_id', deleteRateItem);

rateroute.get('/getLatestVATPercentage', getLatestVATPercentage);

export default rateroute;
