const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Order = require('../models/order');
const config = require('../config');
const checkJWT = require('../middlewares/check-jwt');
const generateJWTToken = require('../services/signToken');
const bcrypt = require('bcrypt-nodejs');


router.post('/signup', (req, res, next) => {
  let user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  user.picture = user.gravatar();
  user.isSeller = req.body.isSeller;

  User.findOne({email: req.body.email}, (err, existingUser) => {
    if (existingUser) {
      res.json({
        success: false,
        message: 'Account with that email is already exist'
      });

    } else {
      user.save();

      var token = jwt.sign({user: user}, config.secret, {expiresIn: '7d'});

      res.json({
        success: true,
        message: 'Enjoy your token',
        token: token,
        statusCode: 200,
      });
    }

  });
});


router.post('/login', async (req, res) => {
  const {email,password} = req.body;
  if (!email || !password) {
    res.status(200).json({
      msg: 'All fields is required',
      statusCode: 201
    })
    return
  }

  const data = await User.findOne({email});
  if (!data) {
    res.json({
      success: false,
      statusCode: 201,
      message: 'Authenticated failed, User not found'
    });
    return
  }

  var comPass = data.comparePassword(req.body.password);
  console.log(comPass);
  if (!comPass) {
    res.json({
      success: false,
      statusCode: 201,
      message: 'Authentication failed. Wrong password'
    });
    return
  }

  const token = generateJWTToken(data);
  res.json({
    success: true,
    mesage: "Enjoy your token",
    token: token,
    data,
    statusCode: 200
  });
})

//Function to handle Profile API (GET,POST) functionality for authenticated users 
router.route('/profile').get(checkJWT, (req, res, next) => {
    User.findOne({_id: req.decoded.user._id}, (err, user) => {
      
      res.json({
        success: true,
        user: user,
        message: "Successful"
      });
    });
  })
  .post(checkJWT, (req, res, next) => {
    User.findOne({_id: req.decoded.user._id}, (err, user) => {
      if (err) return next(err);

      if (req.body.name) user.name = req.body.name;
      if (req.body.email) user.email = req.body.email;
      if (req.body.password) user.password = req.body.password;

      user.isSeller = req.body.isSeller;

      user.save();
      res.json({
        success: true,
        message: 'Successfully edited your profile'
      });
    });
  });

router.route('/address').get(checkJWT, async(req, res, next) => {
  const user = await User.findOne({ _id: req.decoded.user._id});
   if(JSON.stringify(user.address) === "{}"){
    res.json({
      success: false,
      address: null,
      message: "You have not entered your shipping address. Please enter your shipping address."
    });
    return
   }
      res.json({
        success: true,
        address: user.address,
        message: "Successful"
      });

  })
  .post(checkJWT, async (req, res, next) => {
    const {addr1, addr2,city, state, country,postalCode} = req.body;
    if (!addr1 || !addr2 || !city || !state || !country || !postalCode) {
      res.json({
        success: false,
        message: ' All address field is required.'
      });
      return
    }
    const user = await User.findOne({_id: req.decoded.user._id});
    user.address.addr1 = req.body.addr1;
    user.address.addr2 = req.body.addr2;
    user.address.city = req.body.city;
    user.address.state = req.body.state;
    user.address.country = req.body.country;
    user.address.postalCode = req.body.postalCode;

    user.save();
    res.json({
      success: true,
      message: 'Successfully edited your address'
    });

  });





//Function to handle Orders functionality for authenticated users  
router.get('/orders', checkJWT, (req, res, next) => {
  Order.find({owner: req.decoded.user._id})
    .populate('products.product')
    .populate('owner')
    .exec((err, orders) => {
      if (err) {
        res.json({
          success: false,
          message: "Couldn't find your order"
        });
      } else {
        res.json({
          success: true,
          message: 'Found your order',
          orders: orders
        });
      }
    });
});

//Function to handle specific order functionality 
router.get('/orders/:id', checkJWT, (req, res, next) => {
  Order.findOne({_id: req.params.id})
    .deepPopulate('products.product.owner')
    .populate('owner')
    .exec((err, order) => {
      if (err) {
        res.json({
          success: false,
          message: "Couldn't find your order"
        });
      } else {
        res.json({
          success: true,
          message: 'Found your order',
          order: order
        });
      }
    });
});


//Exporting the module 
module.exports = router;