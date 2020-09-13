const router = require('express').Router();
const multer = require('multer');
const upload = multer();
const { User, Post, Favorite } = require('../../models');
const takeScreenshot = require('../../utils/screenshot');
const uploadFile = require('../../utils/upload');
const aws = require('aws-sdk');

// get all posts
router.get('/', async (req, res) => {
  try {
    const dbPostData = await Post.findAll();
    res.status(200).json(dbPostData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get one post by id
router.get('/:id', async (req, res) => {
  try {
    const dbPostData = await Post.findOne({
      where: {
        id: req.params.id
      }
    });

    if (!dbPostData) {
      res.status(404).json({ message: 'No post found with that id' });
      return;
    }

    res.status(200).json(dbPostData);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// create new post from url screenshot
router.post('/url', async (req, res) => {
  try {
    const { url, caption } = req.body;
    const { user_id } = req.session;
    if (!url) {
      res.status(400).json({ message: `Needs value for url. Value for caption can be null.` });
      return;
    }

    if (!user_id) {
      res.status(400).json({ message: `Missing user_id.` });
      return;
    }

    // takeScreenshot currently saves an image to the public folder every time the function is called. We can remove this part of the code once we have the S3 bucket route working.
    const { screenshot: imageBin , fileName } = await takeScreenshot(url);
    
    // const imageBin is binary string of image returned by puppeteer
    // code to save image to S3 bucket should be imported from the utils folder and go here
    uploadFile;
    console.log(data);

    // uploadFile(req, res, (err) => {
    //   // console.log( 'requestOkokok', req.file );
    //   // console.log( 'error', error );
    //   if( err ){
    //     console.log(err);
    //   } else {
    //     // If File not found
    //     if( req.file === undefined ){
    //       console.log( 'Error: No File Selected!' );
    //       res.json( 'Error: No File Selected' );
    //     } else {
    //     // If Success
    //     const imageName = req.file.key;
    //     const imageLocation = req.file.location;

    //     res.json( {
    //       image: imageName,
    //       location: imageLocation
    //     })
    //   }
    // }
    //   //  });
  //    uploadFile = (fileName) => {
    
  //     const fileContent = fs.readFileSync(fileName);
  //     const imageName = takeScreenshot.fileName;
  
  //     // S3 upload parameters
  //     const params = {
  //         Bucket: BUCKET_NAME,
  //         Key: 'test.jpg', 
  //         Body: fileContent
  //     };
  
  //     // Uploading files to S3
  //     s3.upload(params, function(err, data) {
  //         if (err) {
  //             throw err;
  //         }
  //         console.log(`File uploaded successfully. ${data.Location}`);
  //     });
  //     uploadFile();
  // };

    // save image in S3 bucket with fileName as the file name


    // code to parse color palette will go here. Hard-coding palette for now.
    const palette = ["#aa72a6", "#5876d3", "#04d010", "#2d499e", "#ff8161"];

    const dbPostData = await Post.create({
      source: url,
      path: fileName,
      caption,
      palette,
      user_id
    });

    res.status(200).json(dbPostData);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// create new post from uploaded local file
router.post('/file', upload.single('file'), async (req, res) => {
  try {
    const { buffer: imageBin } = req.file;
    const { caption } = req.body;
    const { user_id } = req.session;

    if (!imageBin) {
      res.status(400).json({ message: `Missing value for file. Caption value can be null` });
      return;
    }

    if (!user_id) {
      res.status(400).json({ message: `Missing user_id.` });
      return;
    }

    const fileName = Date.now();

    // const imageBin is binary string of uploaded image
    // code to save image to S3 bucket should be imported from the utils folder and go here
    
    // save image in S3 bucket with const fileName as the file name

    // code to parse color palette will go here. Hard-coding palette for now.
    const palette = ["#aa72a6", "#5876d3", "#04d010", "#2d499e", "#ff8161"];

    const dbPostData = await Post.create({
      source: 'Local file uploaded',
      path: fileName,
      caption,
      palette,
      user_id
    });

    res.status(200).json(dbPostData);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// favorite a post
router.put('/favorite', async (req, res) => {
  try {
    if (!req.body.post_id) {
      res.status(400).json({ message: `Needs value for post_id` });
      return;
    }

    const favoriteData = await Post.findFavorite(req.session.user_id, req.body.post_id, Favorite);

    let updatedFavoriteData;
    
    if (favoriteData) {
      // if combination of user_id and post_id already exists in favorite table
      updatedFavoriteData = await Post.unfavorite(req.session.user_id, req.body.post_id, Favorite);
    } else {
      // if that combination does not exist in favorite table
      updatedFavoriteData = await Post.favorite(req.session.user_id, req.body.post_id, Favorite, Post);
    }

    res.status(200).json(updatedFavoriteData);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
  
});

// edit post by id
router.put('/:id', async (req, res) => {
  try {
    const { caption } = req.body;
    if (!caption) {
      res.status(400).json({ message: `Needs a caption value` });
      return;
    }

    const dbPostData = await Post.findOne({
      where: {
        id: req.params.id
      }
    });

    if (!dbPostData) {
      res.status(404).json({ message: `No post found with that id` });
      return;
    }

    const updateBody = {
      caption,
      path: dbPostData.path,
      user_id: dbPostData.user_id,
      palette: dbPostData.palette
    };

    const updatedPostData = await Post.update(updateBody, {
      where: {
        id: req.params.id
      }
    });

    res.status(200).json(updatedPostData);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// delete a post by id
router.delete('/:id', async (req, res) => {
  try {
    const dbPostData = await Post.destroy({
      where: {
        id: req.params.id
      }
    });

    res.status(200).json(dbPostData);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;