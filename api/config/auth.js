require('dotenv').config();

export default {
    secret: process.env.SYS_SECRET,
    expiresIn: "2d"
}