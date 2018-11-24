const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

// GET => /
router.get('/', shopController.getIndex);

// GET => /products
router.get('/products', shopController.getProducts);

// GET => /product/<productId>
router.get('/products/:productId', shopController.getProduct);

// GET => /cart
router.get('/cart', shopController.getCart);

// POST =>
router.post('/cart', shopController.postCart);

// GET => /cart
router.get('/orders', shopController.getOrders);

// GET => /checkout
router.get('/checkout', shopController.getCheckout);

module.exports = router;