const getOTP = () => {
    const pin = Math.ceil(Math.random() * 1000000);
    let stringPin = pin + "";
    let OTO = "";

    if (stringPin.length > 4) {
        OTP = stringPin.slice(0, 4);
    }

    return OTP;
}

// exports

module.exports = getOTP;