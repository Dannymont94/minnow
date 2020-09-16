const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const fs = require('fs');
const { uuid } = require('uuidv4');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const BUCKET_NAME = 'app.bucket.images';
const uploadFile = async (data) => {
    // const fileContent = fs.readFileSync(fileName);
    // S3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: `${uuid()}.jpg`, 
        Body: data
    };
    // Uploading files to S3
    const upload = s3.upload(params, function(err, data) {
        console.log(`sync: ${data}`);
    });

    const promise = upload.promise();

    return promise.then(data => {
        return data.Location;
    });
};

module.exports = { uploadFile };