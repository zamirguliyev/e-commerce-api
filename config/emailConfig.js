const nodemailer = require('nodemailer');

// Test account yaratmaq
const createTestAccount = async () => {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });
};

let transporter = null;

const sendWelcomeEmail = async (email, name) => {
    try {
        if (!transporter) {
            transporter = await createTestAccount();
        }

        const message = {
            from: '"E-commerce Platform" <test@example.com>',
            to: email,
            subject: 'Xoş gəldiniz!',
            text: `Salam ${name}! E-commerce platformamıza xoş gəldiniz! Hesabınız uğurla yaradıldı.`,
            html: `
                <h1>Salam ${name}!</h1>
                <p>E-commerce platformamıza xoş gəldiniz!</p>
                <p>Hesabınız uğurla yaradıldı.</p>
                <p>Təşəkkür edirik ki, bizi seçdiniz!</p>
            `
        };

        const info = await transporter.sendMail(message);
        console.log('Test URL:', nodemailer.getTestMessageUrl(info));
        return info;
    } catch (error) {
        console.error('Welcome email error:', error);
        throw error;
    }
};

const sendPasswordResetEmail = async (email, resetCode) => {
    try {
        if (!transporter) {
            transporter = await createTestAccount();
        }

        const message = {
            from: '"E-commerce Platform" <test@example.com>',
            to: email,
            subject: 'Şifrə Yeniləmə Kodu',
            text: `Şifrə yeniləmə kodunuz: ${resetCode}. Bu kod 10 dəqiqə ərzində etibarlıdır.`,
            html: `
                <h1>Şifrə Yeniləmə Tələbi</h1>
                <p>Şifrənizi yeniləmək üçün aşağıdakı kodu istifadə edin:</p>
                <h2 style="color: #4CAF50;">${resetCode}</h2>
                <p>Bu kod 10 dəqiqə ərzində etibarlıdır.</p>
                <p>Əgər siz şifrə yeniləmə tələbi göndərməmisinizsə, bu emaili nəzərə almayın.</p>
            `
        };

        const info = await transporter.sendMail(message);
        console.log('Test URL:', nodemailer.getTestMessageUrl(info));
        return info;
    } catch (error) {
        console.error('Password reset email error:', error);
        throw error;
    }
};

module.exports = {
    sendWelcomeEmail,
    sendPasswordResetEmail
};
