
const router = require('express').Router();
const stripe = require('stripe')('sk_test_wkcPYTXmqh2Y1Qayai7cW1Bk');

const Category = require('../models/category');
const Product = require('../models/product');
const Review = require('../models/review');
const Order = require('../models/order');

const checkJWT = require('../middlewares/check-jwt');


//Function to facilitate obtaining the product information 
router.get('/products', async(req, res, next) => {
  const perPage = 10;
  const page = req.query.page;
 const totalProducts = await Product.count({});
  const products = await Product.find({}).skip(perPage * page).limit(perPage).populate('category').populate('owner');

 res.json({
  success: true,
  message: 'category',
  products: products,
  totalProducts: totalProducts,
  pages: Math.ceil(totalProducts / perPage)
});

  
});

//Function to facilitate categories GET and POST requests 
router.route('/categories')
.get(async (req, res, next) => {
 let categories =  await Category.find({})
    res.json({
      success: true,
      message: "Success",
      categories: categories
    })
  })
  .post(async (req, res, next) => {
    let category = new Category();
    category.name = req.body.category;
    category.save();
    res.json({
      success: true,
      message: "Successful"
    });
  });


  //Function to facilitate get request of specific categories
  router.post('/categorybyId', async(req, res, next) => {
    const perPage = 10;
    // const page = req.query.page;
    const {categoryId,page} = req.body;

    const totalProducts = await Product.count({category: categoryId});
    const products = await Product.find({category: categoryId}).skip(perPage * page)
    .limit(perPage).populate('category').populate('owner').populate('reviews')

   const category = await Category.findOne({category: categoryId});

  res.json({
    success: true,
    message: 'category',
    products: products,
    categoryName: category.name,
    totalProducts: totalProducts,
    pages: Math.ceil(totalProducts / perPage)
  });
  });



  //Function to facilitate get request of specific product 
  router.get('/product/:id', async(req, res, next) => {
  const product =   await Product.findById({ _id: req.params.id }).populate('category').populate('owner').deepPopulate('reviews.owner');
   
  if (!product) {
    res.json({
      success: false,
      message: 'Product is not found'
    });
    return
  } 

  res.json({
    success: true,
    product: product
  });

  });


 //Function to facilitate review functionality 
  router.post('/review', checkJWT, async(req, res, next) => {

    const product = await Product.findOne({ _id: req.body.productId});

    let review = new Review();
    review.owner = req.decoded.user._id;

    if (req.body.title) review.title = req.body.title;
    if (req.body.description) review.description = req.body.description
    review.rating = req.body.rating;

    product.reviews.push(review._id);
    product.save();
    review.save();
    res.json({
      success: true,
      message: "Successfully added the review"
    });
  });

//Function to facilitate payment functionality  using STRIPE API 
router.post('/payment', checkJWT, (req, res, next) => {
  const stripeToken = req.body.stripeToken;
  const currentCharges = Math.round(req.body.totalPrice * 100);

  stripe.customers.create({
      source: stripeToken.id
    })
    .then(function(customer) {
      return stripe.charges.create({
        amount: currentCharges,
        currency: 'usd',
        customer: customer.id
      });
    })
    .then(function(charge) {
      const products = req.body.products;

      let order = new Order();
      order.owner = req.decoded.user._id;
      order.totalPrice = currentCharges;
      
      products.map(product => {
        order.products.push({
          product: product.product,
          quantity: product.quantity
        });
      });

      order.save();
      res.json({
        success: true,
        message: "Successfully made a payment"
      });
    });
});

 
//Exporting the module 
module.exports = router;


