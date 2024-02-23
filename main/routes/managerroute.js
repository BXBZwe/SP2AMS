// managerRoute.js
import express from 'express';
import { getManager, addmanager } from '../controllers/managercontroller';
import imageupload from '../controllers/multiconfig';

const managerRouter = express.Router();

// Route to fetch manager details
managerRouter.get('/manager', getManager);
managerRouter.post('/addmanager', imageupload.fields([
    { name: 'profile_image', maxCount: 1 }
]), addmanager);


export default managerRouter;
