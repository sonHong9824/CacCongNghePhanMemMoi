require("dotenv").config();
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const white_list = ["/", "/login", "/register"];
    if(white_list.find(item => '/v1/api' + item === req.originalUrl)){
        next();
    } else {
        if(req?.headers?.authorization?.split(' ')?.[1]) {
            const token = req.headers.authorization.split(" ")[1];

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user= {
                    email: decoded.email,
                    name: decoded.name,

                }
                console.log("Decoded:", decoded);
                next();
            } catch (error) {
                return res.status(401).json({
                    EC: 1,
                    EM: "Invalid token",
                });
            }
        } else {
            return res.status(401).json({
                EC: 1,
                EM: "No token provided",
            });
        }
    }
}
module.exports = auth;