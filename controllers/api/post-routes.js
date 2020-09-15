const router = require('express').Router();
const multer = require('multer');
const upload = multer();
const { User, Post, Favorite } = require('../../models');
const takeScreenshot = require('../../utils/screenshot');
const withAuth = require('../../utils/auth');
// const uploadFile = require('../../utils/upload');
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
router.post('/url', withAuth, async (req, res) => {
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

    // save image in S3 bucket with fileName as the file name

    const dbPostData = await Post.create({
      source: url,
      path: fileName,
      caption,
      user_id
    });

    res.status(200).json(dbPostData);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// create new post from uploaded local file
router.post('/file', withAuth, upload.single('file'), async (req, res) => {
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
    // function added to the router.post declaration "upload.array('upl',1)" this will run the function from upload.js

    const dbPostData = await Post.create({
      source: 'Local file uploaded',
      path: fileName,
      caption,
      user_id
    });

    res.status(200).json(dbPostData);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// favorite a post
router.put('/favorite', withAuth, async (req, res) => {
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
router.put('/:id', withAuth, async (req, res) => {
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
      user_id: dbPostData.user_id
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
router.delete('/:id', withAuth, async (req, res) => {
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