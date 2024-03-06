const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const connection = require('../lib/db');

const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log('authenticated');
        return next();
    } else {
        console.log('Unauthorized');
        return res.status(401).json({ data: 'Unauthorized' });
    }
};

// const authenticated = (req, res, next) => {
//     if (req.headers.token) {
//         const token = req.headers.token;
//         const decodedToken = jwt.decode(token.replace("Bearer ", ""));
//         console.log(decodedToken);
        
//         connection.query('SELECT * FROM Users WHERE email = ?', decodedToken.email, function (err, user, fields) {
//             if (err) return res.status(401).json({ data: "err" });
//             if (!user) return res.status(401).json({ data: 'Wrong JWT Token' });
//             if (decodedToken.name !== user[0].name) return res.status(401).json({ data: 'Wrong JWT Token' });
    
//             const exp = decodedToken.exp
//             const iat = decodedToken.iat
//             const curr = Math.floor(Date.now()/1000);
//             console.log(curr);
//             if (curr > exp || curr < iat) {
//                 console.log('Token Expired');
//                 return res.status(401).json({ data: 'Token Expired' });
//             }
//             console.log('Authorized');
//             return res.status(200).json({ data: 'Authorized' });
//         })

//     } else {
//         console.log('Unauthorized');
//         return res.status(401).json({ data: 'Unauthorized' });
//     }

// }

module.exports = authenticated;