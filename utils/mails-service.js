import nodemailer from 'nodemailer';
import Transport from "nodemailer-brevo-transport";

 export const sendTestMail = async () => {
    const transporter = nodemailer.createTransport(new Transport({
        apiKey: process.env.MAIL_API_KEY
    }))
    const test = await transporter.sendMail({
        to: 'johndoe@gmail.com',
        from: 'fitexpress@gmail.com',
        subject: 'Dziękujemy za zakupy',
        html: '<h1>Oto twoja fakturka</h1> '
    });
    console.log("Recieved ", test)
}
export const sendRequestPasswordMail = async (email,token) => {
    const transporter = nodemailer.createTransport(new Transport({
        apiKey: process.env.MAIL_API_KEY
    }))
    const mail = await transporter.sendMail({
        to: email,
        from: 'fitexpress@sendinblue.com',
        subject: 'Test zmiana hasła',
        html:
            `
            <h1>Zmiana hasła</h1>
            <p>Zauważyliśmy, że chcesz zmienić hasło do swojego konta FitExpress</p>
            <h3>Użyj linku poniżej, by zresetować swoje hasło</h3>
            <a href="http://localhost:5173/resetPassword?token=${token}">Zmień hasło</a>
            <p>Jeśli to nie ty, zignoruj tę wiadomość i powiadom nas o problemie</p>
            `
    })
    console.log('Recieved', mail)
}