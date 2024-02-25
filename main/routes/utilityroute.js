import express from "express";
import { getUtilityTrends } from "../controllers/utilitycontroller";

const utilityroute = express.Router();

utilityroute.get('/get_utitliy_trends/:utilityType/:granularity', getUtilityTrends);

export default utilityroute;