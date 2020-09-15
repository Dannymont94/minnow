const express = require('express');
const aws = require('aws-sdk');
const bodyParser = require('body-parser');
const multer = require('multer');
const multerS3 = require('multer-s3');
const config = require('../config');



aws.config.update(config.awsConfig)

var app = express(),
    s3 = new aws.S3();

app.use(bodyParser.json());

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'app.bucket.test',
        key: function (req, file, cb) {
            console.log(file);
            cb(null, Date.now().toString() + '.jpg'); 
        }
    })
});





// const fs = require('fs');
// const AWS = require('aws-sdk');
// const takeScreenshot = require('./screenshot');
// // AWS S3 info
// const { BUCKET_NAME, AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } = process.env;


// const ID = process.env.AWS_ACCESS_KEY;
// const SECRET = process.env.AWS_SECRET_ACCESS_KEY;

// const s3 = new AWS.S3({
//     accessKeyId: ID,
//     secretAccessKey: SECRET
// });

// const uploadFile = (fileName) => {
    
//     const fileContent = fs.readFileSync(fileName);
//     const imageName = takeScreenshot.fileName;

//     // S3 upload parameters
//     const params = {
//         Bucket: BUCKET_NAME,
//         Key: 'test.jpg', // test image file
//         Body: fileContent
//     };

//     // Uploading files to S3
//     s3.upload(params, function(err, data) {
//         if (err) {
//             throw err;
//         }
//         console.log(`File uploaded successfully. ${data.Location}`);
//     });
// };

// module.exports = uploadFile;