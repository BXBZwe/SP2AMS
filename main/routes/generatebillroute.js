import express from 'express';
import {
    getGeneratedBillRecords,
    getGeneratedBillRecordById,
    createGeneratedBillRecord,
    updateGeneratedBillRecord,
    deleteGeneratedBillRecord
} from '../controllers/generatebillcontroller';

const generatebillroute = express.Router();

generatebillroute.get('/generatebill', getGeneratedBillRecords);

generatebillroute.get('/geteachrate/:bill_record_id', getGeneratedBillRecordById);

generatebillroute.post('/creategeneratebill', createGeneratedBillRecord);

generatebillroute.put('/updategeneratebill/:bill_record_id', updateGeneratedBillRecord);

generatebillroute.delete('/deletegeneratebill/:bill_record_id', deleteGeneratedBillRecord);


export default generatebillroute;
