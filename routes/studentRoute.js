const express = require('express');
const { getAllStudent, createStudent, getSingleStudent, editStudent, studentDataStore, deleteStudent, updateStudent, getAllUnverifyedStudent, verifyAccount, smsVerification, smsVerificationCheck } = require('../controller/studentController');
const multer = require('multer');
const path = require('path');



// init router

const router = express.Router();

// multer config

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/img/students'))
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname)
    }

});


const studentPhotoMulter = multer({
    storage: storage
}).single('student-photo');

// make route

router.get('/', getAllStudent)
router.get('/unvarifyed', getAllUnverifyedStudent)

router.get('/create', createStudent)
router.post('/create/user_verified', studentPhotoMulter, studentDataStore)

router.get('/verify/:token', verifyAccount)

router.get('/edit/:id', editStudent)
router.post('/update/:id', studentPhotoMulter, updateStudent)

router.get('/delete/:id', deleteStudent)

router.get('/:id', getSingleStudent)

// sms verification

router.get('/student_verify/:id', smsVerification)
router.post('/student_verify/:id', smsVerificationCheck)

// export router

module.exports = router;