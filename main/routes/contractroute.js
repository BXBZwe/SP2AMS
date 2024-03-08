import express from 'express';
import { getTemplateFilePath, fetchTenantData, fillDocxTemplate, fetchContractDetail, updatePeriodOfStay,fetchSpecificContractDetail } from '../controllers/contractcontroller';

const contractroute = express.Router();

// contractroute.get('/createfilledcontract/:tenantId/:language', async (req, res) => {
//     const { tenantId, language } = req.params;

//     try {
//         const templateFilePath = getTemplateFilePath(language);

//         const tenantData = await fetchTenantData(parseInt(tenantId));

//         const filledContractPath = await fillDocxTemplate(templateFilePath, tenantData, language);

//         res.sendFile(filledContractPath);
//     } catch (error) {
//         res.status(500).send({ error: error.message });
//     }
// });


contractroute.get('/createfilledcontract/:tenantId/:language', async (req, res) => {
    const { tenantId, language } = req.params;

    try {
        const templateFilePath = getTemplateFilePath(language);

        const tenantData = await fetchTenantData(parseInt(tenantId));

        const filledContractPath = await fillDocxTemplate(templateFilePath, tenantData, language);

        // Log the message just before sending the file
        console.log("Document Created");

        res.sendFile(filledContractPath, (err) => {
            if (err) {
                // In case there's an error sending the file, log it
                console.error('Error sending the filled contract file:', err);
            } else {
                // Optionally, log that the file was successfully sent
                console.log('Filled contract file sent successfully.');
            }
        });
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