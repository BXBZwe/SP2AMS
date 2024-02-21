import express from 'express';
import { addnewtenant, deletetenant, getAlltenants, updatetenant, geteachtenant } from "../controllers/tenantcontroller";
import imageupload from '../controllers/multiconfig';


const tenantroute = express.Router();

tenantroute.get('/getalltenants', getAlltenants);

tenantroute.get('/getatenant/:tenant_id', geteachtenant);

tenantroute.post('/addtenants', imageupload.fields([
    { name: 'tenant_image', maxCount: 1 },
    { name: 'nationalcard_image', maxCount: 1 }
]), addnewtenant);

tenantroute.put('/updatetenants/:tenant_id', imageupload.fields([
    { name: 'tenant_image', maxCount: 1 },
    { name: 'nationalcard_image', maxCount: 1 }
]), updatetenant);

tenantroute.delete('/deletetenants/:tenant_id', deletetenant);

export default tenantroute;