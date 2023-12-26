// routes/rateRoutes.js

import express from 'express';
import { getallRateItem, addRateItem, updateRateItem, deleteRateItem } from '../controllers/ratecontroller';

const rateroute = express.Router();

rateroute.get('/rates', getallRateItem);
// Route for adding a new rate
rateroute.post('/rates', addRateItem);

// Route for updating an existing rate
rateroute.put('/rates/:rate_id', updateRateItem);

// Route for deleting a rate
rateroute.delete('/rates/:rate_id', deleteRateItem);

export default rateroute;
