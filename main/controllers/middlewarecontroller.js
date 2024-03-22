// JUST IN CASE IF AJARNS ASK US ABOUT THE SECURITY, WE CAN ADD THE MIDDLEWARE TO PREOTECT THE ENDPOINTS WITH THE ACCESSIBLE JWT TOKEN.

// require('dotenv').config();

// const jwt = require('jsonwebtoken');

// const authenticateJWT = (req, res, next) => {
//     const authHeader = req.headers.authorization;

//     if (authHeader) {
//         const token = authHeader.split(' ')[1];

//         jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
//             if (err) {
//                 return res.sendStatus(403);
//             }

//             req.user = user;
//             next();
//         });
//     } else {
//         res.sendStatus(401);
//     }
// };

// export { authenticateJWT };

// how? easy, we just put this authenticateJWT in the route, for example,
// emailroute.post('/sendemail', authenticateJWT, Emailsender);
// and then in the renderer, when we call this endpoint, we add the JWT TOKEN from localstorage
// const authToken = localStorage.getItem('authToken');
// const response = await axios.get("http://localhost:3000/sendemail", {
//     headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${authToken}`,
//     }
// });
