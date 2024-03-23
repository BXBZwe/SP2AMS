import express from "express";
import { getUtilityTrends, calculateFinancialSummary } from "../controllers/utilitycontroller";

const utilityroute = express.Router();

utilityroute.get('/get_utitliy_trends/:utilityType/:granularity', getUtilityTrends);

utilityroute.get('/getprofitandrevenue', calculateFinancialSummary);

export default utilityroute;