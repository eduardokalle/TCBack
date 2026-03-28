const nodemailer = require('nodemailer');

const send = async (to, subject, text, html) => {
	

	nodemailer.createTestAccount((err, account) => {
	    let transporter = nodemailer.createTransport({
	        host: 'smtp.googlemail.com', // Gmail Host
	        port: 465, // Port
	        secure: true, // this is true as port is 465
	        auth: {
	            user: 'devtucarrera@gmail.com', //Gmail username
	            pass: 'tucarrera.coLNM' // Gmail password
	        },
		    tls: {
		        rejectUnauthorized: false
		    }
	    });
	 
	    let mailOptions = {
	        from: '"Tucarrera.co" <tucarrera.co@gmail.com>',
	        to: to, // Recepient email address. Multiple emails can send separated by commas
	        subject: subject,
	        text: text,
	        html: html
	    };

	    transporter.sendMail(mailOptions, (error, info) => {
	        if (error) {
	            return console.log(error);
	        }
	        console.log('Message sent: %s', info.messageId);
	    });
	});


}


module.exports = {
	send: send
}