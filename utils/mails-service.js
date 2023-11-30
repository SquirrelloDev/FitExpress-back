import nodemailer from 'nodemailer';
import Transport from "nodemailer-brevo-transport";

const sendTestMail = async () => {
    const transporter = nodemailer.createTransport(new Transport({
        apiKey: "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"
    }))
    const test = await transporter.sendMail({
        to: 'olejnike2000@gmail.com',
        from: 'support@fitexperss.com',
        subject: 'Zmiana',
        html: '<h1>lorem ipsum dolor sit amet</h1> '
    });
    console.log("Recieved ", test)
}
export default sendTestMail;