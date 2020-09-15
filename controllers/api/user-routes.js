const router = require('express').Router();
const { User, Post, Favorite } = require('../../models');

// get all users
router.get('/', async (req, res) => {
  try {
    const dbUserData = await User.findAll({
      attributes: {
        exclude: ['password']
      }
    });

    res.status(200).json(dbUserData);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get one user by id
router.get('/:id', async (req, res) => {
  try {
    const dbUserData = await User.findOne({
      attributes: {
        exclude: ['password']
      },
      where: {
        id: req.params.id
      }, 
      include: [
        {
          model: Post,
          attributes: ['id', 'path', 'caption', 'created_at']
        },
        {
          model: Favorite,
          attributes: ['post_id'],
          include: {
            model: Post,
            attributes: ['id', 'path', 'caption', 'created_at']
          }
        }
      ]
    });

    if (!dbUserData) {
      res.status(404).json({ message: `No user found with that id` });
      return;
    }

    res.status(200).json(dbUserData);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// create new user
router.post('/', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({ message: `Needs values for username, email, and password` });
      return;
    }

    const dbUserData = await User.create({
      username,
      email,
      password
    });

    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;

      res.status(200).json(dbUserData);
    });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// login and create session
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: `Needs values for email and password` });
      return;
    }

    const dbUserData = await User.findOne({
      where: {
        email
      }
    });

    if (!dbUserData) {
      res.status(404).json({ message: `No user with that email address` });
      return;
    }

    const validPassword = dbUserData.checkPassword(password);

    if (!validPassword) {
      res.status(404).json({ message: `Incorrect password` });
      return;
    }
      
    req.session.save(() => {
      req.session.user_id = dbUserData.id,
      req.session.username = dbUserData.username,
      req.session.loggedIn = true
      
      res.status(200).json({
        user: dbUserData,
        message: `You are now logged in`
      });
    });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// logout and destroy session
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(400).end();
  }
});

// delete a user by id
router.delete('/:id', async (req, res) => {
  try {
    const dbUserData = await User.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!dbUserData) {
      res.status(404).json({ message: 'No user found with this id' });
      return;
    }

    res.status(200).json(dbUserData);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;