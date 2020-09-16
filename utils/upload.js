const AWS = require('aws-sdk');
const { uuid } = require('uuidv4');

const FILE_PERMISSION = 'public-read';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const uploadFile = async (data) => {
  // S3 upload parameters
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${uuid()}.jpg`, 
    Body: data,
    ACL: FILE_PERMISSION
  };
    
  // Uploading files to S3
  const upload = s3.upload(params, function(err, data) {
    console.log(`sync: ${data}`);
  });

  const promise = upload.promise();

  return promise.then(data => {
    // return image url after upload is completed
    return data.Location;
  });
};

module.exports = uploadFile;