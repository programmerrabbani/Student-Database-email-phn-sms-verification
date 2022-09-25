const path = require('path');
const { readFileSync, writeFileSync, unlinkSync } = require('fs');
const { verifyAccountMail } = require('../utility/sendMail');
const sendSms = require('../utility/sendSms');
const getOTP = require('../utility/getOTP');



// make control

// all student data

const getAllStudent = (req, res) => {

    // student data

    const students = JSON.parse(readFileSync(path.join(__dirname, '../db/student.json')));

    const verifyed = students.filter(data => data.isVerifyed == true);

    res.status(200).render('student/index', {

        students: verifyed

    });

}

// getAll Unverifyed Student

const getAllUnverifyedStudent = (req, res) => {

    // student data

    const students = JSON.parse(readFileSync(path.join(__dirname, '../db/student.json')));

    const unVerifyed = students.filter(data => data.isVerifyed == false);

    res.status(200).render('student/unVerifyed', {

        students: unVerifyed

    });

}

// create students

const createStudent = (req, res) => {

    // student data

    const students = JSON.parse(readFileSync(path.join(__dirname, '../db/student.json')));

    res.status(200).render('student/create')

}

// view student

const getSingleStudent = (req, res) => {

    // student data

    const students = JSON.parse(readFileSync(path.join(__dirname, '../db/student.json')));

    const { id } = req.params;

    const student = students.find(data => data.id == id)

    res.status(200).render('student/show', {

        student: student

    })

}

// edit student

const editStudent = (req, res) => {

    // student data

    const students = JSON.parse(readFileSync(path.join(__dirname, '../db/student.json')));

    const { id } = req.params;

    const edit_data = students.find(data => data.id == id)

    res.status(200).render('student/edit', {

        student: edit_data

    })

}

// student data store

const studentDataStore = async(req, res) => {

    // student data

    const students = JSON.parse(readFileSync(path.join(__dirname, '../db/student.json')));

    // get all data

    const { name, email, cell, location } = req.body;

    // token

    const token = Date.now() + '_' + Math.floor(Math.random() * 10000000);

    // OTP

    const OTP = getOTP();

    // get last id

    let userId = Date.now() + '_' + Math.floor(Math.random() * 1000000);

    // add new students

    students.push({
        id: userId,
        name: name,
        email: email,
        cell: cell,
        location: location,
        photo: req.file ? req.file.filename : "avater.png",
        isVerifyed: false,
        token: token,
        OTP: OTP

    });

    // email send

    await verifyAccountMail(email, 'Verify Account', {

        name,
        email,
        token,
        cell

    });



    // now write data to json db

    writeFileSync(path.join(__dirname, '../db/student.json'), JSON.stringify(students));

    // redirect

    res.render('student/userVerifyed', {
        name,
        userId
    });

}


// delete Student

const deleteStudent = (req, res) => {

    // student data

    const students = JSON.parse(readFileSync(path.join(__dirname, '../db/student.json')));

    const { id } = req.params;

    const newStudents = students.filter(data => data.id != id);

    // now write data to json db

    writeFileSync(path.join(__dirname, '../db/student.json'), JSON.stringify(newStudents));

    // redirect

    res.redirect('/student');

}


// update Student

const updateStudent = (req, res) => {

    // student data

    const students = JSON.parse(readFileSync(path.join(__dirname, '../db/student.json')));



    const { id } = req.params;

    const ExistingPhoto = students.find(data => data.id == req.params.id).photo

    if (req.file) {
        if (req.file != 'avatar.png') {
            unlinkSync(path.join(__dirname, `../public/img/students/` + `${ExistingPhoto}`));
        }
    }

    students[students.findIndex(data => data.id == id)] = {

        ...students[students.findIndex(data => data.id == id)],

        name: req.body.name,
        email: req.body.email,
        cell: req.body.cell,
        location: req.body.location,
        photo: req.file ? req.file.filename : ExistingPhoto

    }

    // now write data to json db

    writeFileSync(path.join(__dirname, '../db/student.json'), JSON.stringify(students));

    // redirect

    res.redirect('/student');


}


// verifyAccount

const verifyAccount = (req, res) => {

    const students = JSON.parse(readFileSync(path.join(__dirname, '../db/student.json')));

    // get token

    const token = req.params.token;

    students[students.findIndex(data => data.token == token)] = {

        ...students[students.findIndex(data => data.token == token)],

        isVerifyed: true,

    }

    // now write data to json db

    writeFileSync(path.join(__dirname, '../db/student.json'), JSON.stringify(students));

    //  redirect

    res.render('student/isVerify', {

        isVerifyed: students[students.findIndex(data => data.token == token)].isVerifyed
    });



}



// get sms verification panel

const smsVerification = async(req, res) => {

    const students = JSON.parse(readFileSync(path.join(__dirname, '../db/student.json')));

    const data = students.find(data => data.id == req.params.id)


    // sms send

    await sendSms(data.cell, ` Hi ${ data.name } , You Are Welcome To SoroBindu , Your Code is ${ data.OTP }`);

    res.render('student/smsVerify', {
        name: data.name,
        id: data.id
    });

}



// sms Verification Check

const smsVerificationCheck = (req, res) => {

    const students = JSON.parse(readFileSync(path.join(__dirname, '../db/student.json')));



    let index = students.findIndex(data => data.OTP == req.body.OTP);

    students[index] = {

        ...students[index],

        isVerifyed: true,
        OTP: ""

    }

    // now write data to json db

    writeFileSync(path.join(__dirname, '../db/student.json'), JSON.stringify(students));

    //  redirect

    res.render('student/isVerify', {

        isVerifyed: students[index].isVerifyed
    });

}


// export control

module.exports = {
    getAllStudent,
    getAllUnverifyedStudent,
    createStudent,
    getSingleStudent,
    editStudent,
    studentDataStore,
    deleteStudent,
    updateStudent,
    verifyAccount,
    smsVerification,
    smsVerificationCheck
};