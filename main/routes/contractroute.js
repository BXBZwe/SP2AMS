import express from 'express';
import { getTemplateFilePath, fetchTenantData, fillDocxTemplate, fetchContractDetail, updatePeriodOfStay, fetchSpecificContractDetail } from '../controllers/contractcontroller';
import libre from 'libreoffice-convert';
import fs from 'fs';


const contractroute = express.Router();

contractroute.get('/createfilledcontract/:tenantId/:language', async (req, res) => {
    const { tenantId, language } = req.params;

    try {
        const templateFilePath = getTemplateFilePath(language);

        const tenantData = await fetchTenantData(parseInt(tenantId));

        const pdfBuffer = await fillDocxTemplate(templateFilePath, tenantData, language);

        res.setHeader('Content-Type', 'application/pdf');
        //inline for previewing it & attachment for auto saving it
        res.setHeader('Content-Disposition', `inline; filename=contract_${tenantId}_${language}.pdf`);
        res.send(pdfBuffer);

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


contractroute.get('/getcontractdetails', fetchContractDetail);
contractroute.get('/getspecificcontractdetails/:contractId', fetchSpecificContractDetail); 


contractroute.put('/updatePeriodOfStay/:tenantId', async (req, res) => {
    const { tenantId } = req.params;
    const { newPeriod } = req.body;
    try {
        await updatePeriodOfStay(tenantId, newPeriod);
        res.json({ message: 'Period of stay updated successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error updating period of stay', error: error.message });
    }
});




export default contractroute;