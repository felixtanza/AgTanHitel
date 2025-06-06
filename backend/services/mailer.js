// backend/services/mailer.js
const nodemailer = require('nodemailer');

const sendOrderEmail = async (name, phone, orderSummary) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: process.env.RECEIVER_EMAIL,
    subject: 'New Order from AgTan Hotel',
    text: `Name: ${name}\nPhone: ${phone}\n\nOrder:\n${orderSummary}`
  });
};

module.exports = sendOrderEmail;
