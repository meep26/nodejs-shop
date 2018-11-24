const Product = require('../models/product');

exports.getAddProduct = (req, res, next)=> {
   res.render('admin/add-product', {
      title: 'Add product',
      path: '/admin/add-product',
      activeAddProduct: true
   });
}

exports.postAddProduct = (req, res, next) => {
   const product = new Product(req.body.title);
   product.save();
   res.redirect('/');
}

exports.getProducts = (req, res, next) => {
   Product.fetchAll((products) => {
      res.render('admin/products', {
         products: products,
         title: 'Admin Products',
         path: '/admin/products'
      });
   });
}