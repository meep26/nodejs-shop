const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendgridTransport({
   auth: {
      api_key: process.env.MAIL_API_KEY
   }
}));

const send_mail = (to, from, subject, html) => {
   return transporter.sendMail({
      to: to,
      from: from,
      subject: subject,
      html: html
   });
}

exports.send_mail = send_mail;