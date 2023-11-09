/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as cors from 'cors';
import {onRequest} from "firebase-functions/v2/https";
// import * as nodemailer from "nodemailer";
// import * as logger from "firebase-functions/logger";
// const corsHandler = cors({ origin: true });
const nodemailer = require('nodemailer');
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

// const nodemailer = require('nodemailer');

export const mailer = onRequest(async (request, response) => {
  // const nodemailer = require("nodemailer");

  cors({ origin: true })(request, response, async () => {
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
  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });

  response.send("Hello from Firebase!");
});

});

