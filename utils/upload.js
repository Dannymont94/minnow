const fs = require('fs');
const AWS = require('aws-sdk');
const takeScreenshot = require('./screenshot');
// AWS S3 info
// const { BUCKET_NAME, AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } = process.env;

// const s3 = new AWS.S3({
//     accessKeyId: AWS_ACCESS_KEY,
//     secretAccessKey: AWS_SECRET_ACCESS_KEY
// });
const ID = 'AKIAJJ2SL4L33TR4CHPA';
const SECRET = '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';

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

const uploadFile = (fileName) => {
    
    const fileContent = fs.readFileSync(fileName);
    const imageName = takeScreenshot.fileName;

    // S3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: 'test.jpg', // test image file
        Body: fileContent
    };

    // Uploading files to S3
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};

module.exports = uploadFile;