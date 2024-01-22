import express from 'express';
import { addnewtenant, deletetenant, getAlltenants, updatetenant, geteachtenant } from "../controllers/tenantcontroller";


const tenantroute = express.Router();

tenantroute.get('/getalltenants', getAlltenants);

tenantroute.get('/getatenant/:tenant_id', geteachtenant);

tenantroute.post('/addtenants', addnewtenant);

tenantroute.put('/updatetenants/:tenant_id', updatetenant);

tenantroute.delete('/deletetenants/:tenant_id', deletetenant);

export default tenantroute;