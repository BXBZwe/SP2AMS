// app/server.js
import express from 'express';
import cors from 'cors';
//import nodemailer from 'nodemailer';
// import billroute from './routes/billroute';
// import meterreadingroute from './routes/meterreadingroute';
import roomroutes from './routes/roomroutes';
import emailroute from './routes/emailroute';
import rateroutes from './routes/rateroutes';
import tenantroutes from './routes/tenantroutes';
import managerroute from './routes/managerroute';
import tenancyrecordsroute from './routes/tenancyrecordroute';
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
// app.use(billroute);
// app.use(meterreadingroute);
 app.use(roomroutes);
 app.use(emailroute);
 app.use(rateroutes);
 app.use(tenantroutes);
 app.use(managerroute);
 app.use(tenancyrecordsroute);


export default function startServer() {
    const port = 3000; 
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  };

