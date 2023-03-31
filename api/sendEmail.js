require('dotenv').config();
const nodemailer = require("nodemailer");

export default async function sendEmail(email, link, tipo) {
    let subjectEmail = '';
    let htmlEmail = '';

    const recuperacaoSub = "Recuperação de Senha";
    const recuperacaoHtml = '<p>Olá,</p><p>Você solicitou a recuperação de senha, por gentileza, acesse o link a baixo para realizar a troca de sua senha.<br></p><p>' + 
                            '<u>' + link + '</u></p>Caso você não tenha feito essa solicitação, sugerimos que verifique suas informações de segurança o quanto antes.</p>';
    
    switch (tipo) {
        case 'RECUPERACAO':
            subjectEmail = recuperacaoSub;
            htmlEmail = recuperacaoHtml;
            break;
    }

    const send = async() => {
        let transporter = nodemailer.createTransport({
            host: process.env.SMTP,
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL, 
                pass: process.env.EMAILPASS
            },
        });
      
        try {
            await transporter.sendMail({
                from: "Suporte Barbeiro App",
                to: email,
                subject: subjectEmail,
                html: htmlEmail
            });   
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    return await send();
}