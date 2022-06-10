var nodemailer = require('nodemailer');
const email = process.env.HOST_EMAIL

/* This is a function that sends an email to a target email address. */
exports.sendMail = async (target, subject, text, html) => {

    return new Promise((resolve, reject) => {

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: email,
              pass: process.env.EMAIL_PW
            }
        });
          
        var mailOptions = {
            from: email,
            to: target,
            subject: subject,
            text: text,
            html: html
        };
        
        transporter.sendMail(mailOptions, function(error, info){
            if(!error){
                resolve(true)
            } else {
                resolve(false)
            }
        })
    })
}