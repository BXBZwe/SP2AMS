
import { Router } from 'express';
import { login } from '../controllers/authcontroller';

const authroute = Router();

authroute.post('/login', login);

export default authroute;
