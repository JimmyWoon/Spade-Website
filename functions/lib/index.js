"use strict";
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailer = void 0;
// import * as cors from 'cors';
const https_1 = require("firebase-functions/v2/https");
const nodemailer = require("nodemailer");
// import * as logger from "firebase-functions/logger";
// const corsHandler = cors({ origin: true });
const email = {
    MAIL_MAILER: "smtp",
    MAIL_HOST: "smtp.gmail.com",
    MAIL_PORT: 587,
    MAIL_USERNAME: "admin@cloudbasha.com",
    MAIL_PASSWORD: "Toddlytic12##",
    MAIL_ENCRYPTION: "tls",
    MAIL_NO_REPLY_ALIAS: "no_reply@cloudbasha.com",
};
// Start writing functions
// https://firebase.google.com/docs/functions/typescript
exports.mailer = (0, https_1.onRequest)((request, response) => {
    // const nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
        host: email.MAIL_HOST,
        service: "gmail",
        port: email.MAIL_PORT,
        auth: {
            user: "admin@cloudbasha.com",
            pass: "Toddlytic12##",
        },
    });
    // Define the email options
    const mailOptions = {
        from: email.MAIL_USERNAME,
        to: request.body.to,
        subject: request.body.subject,
        text: request.body.message,
    };
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
        }
        else {
            console.log("Email sent:", info.response);
        }
    });
    response.send("Hello from Firebase!");
});
//# sourceMappingURL=index.js.map