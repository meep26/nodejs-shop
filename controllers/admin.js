const Product = require('../models/product');

exports.getAddProduct = (req, res, next)=> {
   res.render('admin/edit-product', {
      title: 'Add product',
      path: '/admin/add-product',
      editing: false
   });
}

exports.postAddProduct = (req, res, next) => {
   const title = req.body.title;
   const price = req.body.price;
   const description = req.body.description;
   const imageUrl = req.body.imageUrl;
   const product = new Product({
      title: title,
      price: price,
      description: description,
      imageUrl: imageUrl
   });

   product
      .save()
      .then(result => {
         // console.log(result)
         console.log('Created Product');
         res.redirect('/admin/products');
      })
      .catch(err => console.log(err));
}

exports.getEditProduct = (req, res, next) => {
   const editMode = req.query.edit;
   if (!editMode) {
      return res.redirect('/');
   }
   const prodId = req.params.productId;
   Product
      .findById(prodId)
      .then(product => {
         if (!product) {
            return res.redirect('/');
         }
         else {
            res.render('admin/edit-product', {
               title: 'Edit product',
               path: 'admin/edit-product',
               editing: editMode,
               product: product
            });
         }
      })
      .catch(err => console.log(err));
}

exports.postEditProduct = (req, res, next) => {
   const prodId = req.body.productId;
   const updatedTitle = req.body.title;
   const updatedPrice= req.body.price;
   const updatedDescription= req.body.description;
   const updatedImageUrl= req.body.imageUrl;
   
   Product
      .findById(prodId)
      .then(product => {
         product.title = updatedTitle;
         product.price = updatedPrice;
         product.description = updatedDescription;
         product.imageUrl = updatedImageUrl;
         return product.save();
      })
      .then(result => {
         console.log('Updated Product!')
         res.redirect('/admin/products');
      })
      .catch(err => console.log(err));
}

exports.getProducts = (req, res, next) => {
   Product
      .find()
      .then((products) => {
         res.render('admin/products', {
            products: products,
            title: 'Admin Products',
            path: '/admin/products'
         });
      })
      .catch(err => console.log(err));
}

exports.postDeleteProduct = (req, res, next) => {
   const productId = req.body.productId;
   Product.findByIdAndRemove(productId)
      .then(() => {
         console.log('Product is deleted');
         res.redirect('/admin/products');
      })
      .catch(err => console.log(err));
}