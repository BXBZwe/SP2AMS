import express from 'express';
import {
    getGeneratedBillRecords,
    getGeneratedBillRecordById,
    createGeneratedBillRecord,
    updateGeneratedBillRecord,
    deleteGeneratedBillRecord
} from '../controllers/generatebillcontroller';

const generatebillroute = express.Router();

// Get All Generated 
generatebillroute.get('/generatebill', getGeneratedBillRecords);
// Get Each
generatebillroute.get('/geteachrate/:bill_record_id', getGeneratedBillRecordById);
// Post Bill
generatebillroute.post('/creategeneratebill', createGeneratedBillRecord);
// Update Bill
generatebillroute.put('/updategeneratebill/:bill_record_id', updateGeneratedBillRecord);
// Delete Bill
generatebillroute.delete('/deletegeneratebill/:bill_record_id', deleteGeneratedBillRecord);


export default generatebillroute;
