import nodemailer from 'nodemailer';
import mailConfig from '../config/mail.js';

async function createNewUser(to) {
  try {
    const config = await mailConfig();

    const transporter = nodemailer.createTransport(config);

    const info = await transporter.sendMail({
      from: 'noreplay@email.com',
      to,
      subject: 'Conta criada no Quiz App',
      text: `Conta criada com sucesso.\n\nAcesse o aplicativo para responder as questões agora mesmo!`,
      html: `<h1>Conta criada com sucesso.</h1><p>Acesse o aplicativo para responder as questões agora mesmo!</p>`,
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(`Send email: ${nodemailer.getTestMessageUrl(info)}`);
    }
  } catch (err) {
    throw new Error(err);
  }
}

async function createNewCorrect(to, answers) {
  try {
    const config = await mailConfig();

    const transporter = nodemailer.createTransport(config);

    const email = {
      from: 'noreplay@email.com',
      to,
      subject: 'Quantidade de acertos e erros',
      text: `Aqui está quantas questões você acertou e quantas errou.\n\nVerifique seu desempenho agora mesmo!`,
      html: `<h1>Acertos: ${answers?.acertos || 0} \n\n Erros: ${answers?.erros || 0}</h1>`,
    };

    const info = await transporter.sendMail(email);

    if (process.env.NODE_ENV === 'development') {
      console.log(`Send email: ${nodemailer.getTestMessageUrl(info)}`);
    }
  } catch (err) {
    throw new Error(err);
  }
}




export default { createNewUser, createNewCorrect };