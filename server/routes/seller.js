
const router = require('express').Router();
const Product = require('../models/product');
const uploadFile = require('../services/uploadFile');

// const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

// const s3 = new aws.S3({ accessKeyId: "enter accessKeyId", secretAccessKey: "enter secretAccessKey" });

const faker = require('faker');

const checkJWT = require('../middlewares/check-jwt');

//function to upload resources to AWS using multer service 

// var upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: 'ecommercewebapplication',
//     metadata: function (req, file, cb) {
//       cb(null, {fieldName: file.fieldname});
//     },
//     key: function (req, file, cb) {
//       cb(null, Date.now().toString())
//     }
//   })
// });



//Function to handle the product's GET and POST requests by seller 
router.route('/products')
  .get(checkJWT, async (req, res, next) => {
    const product = await Product.find({owner: req.decoded.user._id}).populate('owner').populate('category');
    if (product) {
      res.json({
        success: true,
        message: "Products",
        products: product
      });
    }
  })
  .post([checkJWT, ], async (req, res, next) => { //upload.single('product_picture')
    const file = req.files.product_picture;
    if (!file) {
      res.json({success: false,message: 'No file selected'});
      return
    }
    const result = await uploadFile(file);
    if (!result) return
    const product = await Product.create({
      owner: req.decoded.user._id,
      category: req.body.categoryId,
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      // image: req.file.location,
      image: result.secure_url
    });
    // let product = new Product();
    res.json({
      success: true,
      message: 'Successfully Added the product'
    });
  });

/* Just for testing if products are added*/
router.get('/faker/test', (req, res, next) => {
  for (i = 0; i < 15; i++) {
    let product = new Product();
    product.category = "5acc1902580ba509c6622bd7";
    product.owner = "5acbfed6571913c9a9e98135";
    product.image = faker.image.cats();
    product.title = faker.commerce.productName();
    product.description = faker.lorem.words();
    product.price = faker.commerce.price();
    product.save();
  }

  res.json({
    message: "Successfully added 20 pictures"
  });

});


//Exporting the module 
module.exports = router;