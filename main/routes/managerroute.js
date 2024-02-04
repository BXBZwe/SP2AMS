// managerRoute.js
import express from 'express';
import { getManager } from '../controllers/managerController'; // Adjust the path as necessary

const managerRouter = express.Router();

// Route to fetch manager details
managerRouter.get('/manager', getManager);



export default managerRouter;
