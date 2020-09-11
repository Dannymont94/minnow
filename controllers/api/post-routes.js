const router = require('express').Router();
const { User, Post, Favorite } = require('../../models');
const takeScreenshot = require('../../utils/screenshot');

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

// create new post
router.post('/url', async (req, res) => {
  try {
    const { url, caption, palette } = req.body;
    const { user_id } = req.session;
    if (!url || !Array.isArray(palette) || palette.length === 0 || !user_id) {
      res.status(400).json({ message: `Needs values for url, palette, and user_id. Value for caption can be null.` });
      return;
    }

    // const screenshot is binary string of image returned by puppeteer
    // takeScreenshot currently saves an image to the public folder every time the function is called. We can remove this part of the code once we have the S3 bucket route working.
    const { screenshot , fileName } = await takeScreenshot(url);
    
    // code to save image to S3 bucket can either go here or in the takeScreenshot function

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

// favorite a post
router.put('/favorite', async (req, res) => {
  try {
    if (!req.body.post_id) {
      res.status(400).json({ message: `Needs value for post_id` });
      return;
    }

    const updatedFavoriteData = await Post.favorite(req.session.user_id, req.body.post_id, Favorite, Post);

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