// app/server.js
import express from 'express';
import cors from 'cors';
//import nodemailer from 'nodemailer';
import billroute from './routes/billroute';
import meterreadingroute from './routes/meterreadingroute';
import roomroutes from './routes/roomroutes';
import emailroute from './routes/emailroute';
import rateroutes from './routes/rateroutes';
import tenantroutes from './routes/tenantroutes';
import managerroute from './routes/managerroute';
import tenancyrecordsroute from './routes/tenancyrecordroute';
import contractroute from './routes/contractroute';
import requestroute from './routes/requestroute';
import generatebillroute from './routes/generatebillroute';
import paymentroute from './routes/paymentroute';
import utilityroute from './routes/utilityroute';
import authrouter from './routes/authroute';

const app = express();
app.use(express.json());


var whitelist = ['http://localhost:8888', 'app://.'];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(billroute);
app.use(meterreadingroute);
app.use(roomroutes);
app.use(emailroute);
app.use(rateroutes);
app.use(tenantroutes);
app.use(managerroute);
app.use(tenancyrecordsroute);
app.use(authrouter);
app.use(contractroute);
app.use(requestroute);
app.use(generatebillroute);
app.use(paymentroute);
app.use('/images', express.static('C:\\\\Senior_Project2\\\\PSPark_Images'));
app.use(utilityroute);



// app.use(authroute);

export default function startServer() {
  const port = 3000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};


