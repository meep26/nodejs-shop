const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const errorController = require('./controllers/error');
const User = require('./models/user');

// FOR CLOUD DATABASE
const MONGODB_URI = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds139459.mlab.com:39459/${process.env.MONGO_DEFAULT_DATABASE}`;

// FOR LOCAL DATABASE
// const MONGODB_URI = 'mongodb://localhost/db-shop';

const app = express();
const store = new MongoDBStore({
   uri: MONGODB_URI,
   collection: 'sessions'
}); 

const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, 'images');
   },
   filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
   }
});

const fileFilter = (req, file, cb) => {
   if ( file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' ) {
      cb(null, true);
   }
   else {
      cb(null, false);
   }
}

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

// Setting up EJS template engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Getting the form within the body
app.use(bodyParser.urlencoded({extended: false}));

// File handling
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"));

//for static middleware(images,, .css, .js )
app.use(express.static(path.join(__dirname, 'public'))); 
app.use('/images', express.static(path.join(__dirname, 'images'))); 

// SEssion middleware
app.use(session({
   secret: 'my secret',
   resave: false,
   saveUninitialized: false,
   store: store
}))

app.use(csrfProtection);
app.use(flash());

app.use( (req, res, next) => {
   if ( !req.session.user) {
      return next();
   }
   User.findById(req.session.user._id)
      .then(user => {
         if (!user) {
            return next();
         }
         req.user = user;
         next();
      })
      .catch(err => {
         throw new Error(err);
      });
})

app.use((req, res, next) => {
   res.locals.isAuthenticated = req.session.isLoggedIn;
   res.locals.csrfToken = req.csrfToken();
   next();
});

// Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// Displaying 500 page
app.get('/500', errorController.get500);

// Displaying 404 page
app.use(errorController.get404);

app.use((error, req, res, next) => {
   res.redirect('/500');
})

mongoose
   .connect(
      MONGODB_URI,
      {
         useNewUrlParser: true
      }
   )
   .then(result => {
      app.listen(process.env.NODE_ENV || 3000);
      console.log("Connected");
   })
   .catch(err => console.log(`Connection error: ${err}`));