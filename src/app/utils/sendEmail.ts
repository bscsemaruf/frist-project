import nodemailer from 'nodemailer';
import config from '../config';
export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      user: 'marufhosenbscse@gmail.com',
      pass: 'elxx esfa ieof szkn',
    },
  });

  await transporter.sendMail({
    from: 'marufhosenbscse@gmail.com', // sender address
    to, // list of receivers
    subject: 'Reset your password within 10 minutes!', // Subject line
    text: 'Hello world?', // plain text body
    html, // html body
  });
};
