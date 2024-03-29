import express from 'express';
import { getManager, addmanager, updateManager } from '../controllers/managercontroller';
import imageupload from '../controllers/multiconfig';

const managerRouter = express.Router();

managerRouter.get('/manager', getManager);

managerRouter.post('/addmanager', imageupload.fields([
    { name: 'profile_image', maxCount: 1 }
]), addmanager);

managerRouter.put('/updatemanager', updateManager);
export default managerRouter;
