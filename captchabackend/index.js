import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import { generateManualCaptcha, verifyManualCaptcha } from "./manualCaptch.js";
import { generateSvgCaptcha, verifySvgCaptcha } from "./svgCaptcha.js";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'a_super_secure_random_secret_key',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);

app.route("/svg-captcha")
    .get(generateSvgCaptcha)
    .post(verifySvgCaptcha);

app.route("/manual-captcha")
    .get(generateManualCaptcha)
    .post(verifyManualCaptcha);



    
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
