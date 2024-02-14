import express from 'express';
import { getTemplateFilePath, fetchTenantData, fillDocxTemplate, fetchContractDetail } from '../controllers/contractcontroller';

const contractroute = express.Router();

contractroute.get('/createfilledcontract/:tenantId/:language', async (req, res) => {
    const { tenantId, language } = req.params;

    try {
        const templateFilePath = getTemplateFilePath(language);

        const tenantData = await fetchTenantData(parseInt(tenantId));

        const filledContractPath = await fillDocxTemplate(templateFilePath, tenantData, language);

        res.sendFile(filledContractPath);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

contractroute.get('/getcontractdetails', fetchContractDetail);

export default contractroute;