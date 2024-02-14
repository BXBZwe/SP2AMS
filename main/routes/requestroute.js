import express from 'express';
const requestroute = express.Router();
import {getRequests,getEachRequest,createRequest,deleteRequest,updateRequest} from '../controllers/requestcontroller';

requestroute.get('/getallrequests', getRequests);
// each rate
requestroute.get('/geteachrequest/:request_id', getEachRequest);

// Route for adding a new rate
requestroute.post('/addrequest', createRequest);

// Route for updating an existing rate
requestroute.put('/updaterequest/:request_id', updateRequest);

// Route for deleting a rate
requestroute.delete('/deleterequest/:request_id', deleteRequest);

export default requestroute;
