import express from "express";
import { getUtilityTrends, calculateFinancialSummary, getFinancialTrends } from "../controllers/utilitycontroller";

const utilityroute = express.Router();

utilityroute.get('/get_utitliy_trends/:utilityType/:granularity', getUtilityTrends);

utilityroute.get('/getprofitandrevenue', calculateFinancialSummary);

utilityroute.get('/getfinancialsummaryperiod', getFinancialTrends);

export default utilityroute;