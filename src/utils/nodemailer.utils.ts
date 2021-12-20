
import nodemailer from 'nodemailer';
import config from 'config';

const options = config.get( 'nodemailerOptions' ) as Object;
const adminMail = config.get( 'adminMail' ) as string;


// mail sender
export const sendMail = async (
    to: string,
    subject: string,
    template: string ) => {

    // transport
    const transport = nodemailer.createTransport( options );

    // send mail 
    transport.sendMail( {
        from: adminMail,
        to: to,
        subject: subject,
        html: template
    } );

};
