// routes/rateRoutes.js

import express from 'express';
import { getallRateItem, addRateItem, updateRateItem, deleteRateItem } from '../controllers/ratecontroller';

const rateroute = express.Router();

rateroute.get('/getallrates', getallRateItem);
// Route for adding a new rate
rateroute.post('/addrates', addRateItem);

// Route for updating an existing rate
rateroute.put('/updaterates/:rate_id', updateRateItem);

// Route for deleting a rate
rateroute.delete('/deleterates/:rate_id', deleteRateItem);

export default rateroute;
