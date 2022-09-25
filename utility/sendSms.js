const dotenv = require('dotenv');
const twilio = require('twilio')(process.env.SID, process.env.AUTH_TOKEN);

const cell = process.env.TWILIO_CELL
    // create sms

const sendSms = async(to, sms) => {


    await twilio.messages.create({
            from: cell,
            to: to,
            body: sms
        })
        .then(res => {
            console.log('sms send successful')
        })
        .catch(error => {
            console.log('error.message');
        });

}




// export

module.exports = sendSms;