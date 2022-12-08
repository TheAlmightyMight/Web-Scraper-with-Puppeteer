import * as dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

export const sendMail = (html) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.mail.ru",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SENDER,
      pass: process.env.PASS,
    },
  });

  transporter.sendMail(
    {
      from: "almightymailer@mail.ru",
      to: "klimentykk@gmail.com",
      subject: "Report from a web parser",
      html: html,
    },
    (error, info) => {
      if (error) {
        console.error(error, "Failed to send message");
      } else {
        console.log(info);
      }
    }
  );
};
