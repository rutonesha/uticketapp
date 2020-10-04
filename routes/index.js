var express = require('express');
var router = express.Router();
const passport = require('passport');

router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('utickets')
} else {
    res.render('index', {
        title: 'Ubumwe | Home',
        user: req.user,
        message: res.locals.message,
        page_name: 'Ubumwe | Home'
    })
}
});



router.get('/tickets', function(req, res, next) {
  res.render('tickets', { 
    title: 'Ubumwe | Tickets',
    page_name: 'Ubumwe | Tickets'
   });
});
// ------------------------------------------------
router.get('/register', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('utickets')
} else {
    res.render('register', {
        title: 'Ubumwe | Register',
        user: req.user,
        message: res.locals.message,
        page_name: 'Ubumwe | Register',
        layout: 'layout'
    })
}
});
// --------------------------------------------------
router.post('/register', (req, res, next) => {
  if (req.isAuthenticated()) {
      req.flash('message', ['You are already logged in.', 'Error', 'Account available'])
      res.redirect('../utickets')
      console.log('You are already logged in.')
  } else {
      let user = (req.body.username).toLowerCase()
      let pass = req.body.password
      let passConf = req.body.passConf
      console.log("data checked")
      if (user.length === 0 || pass.length === 0 || passConf.length === 0) {
          req.flash('message', ['You must provide a username, password, and password confirmation.', 'Error', 'Missing information'])
          res.redirect('/register')
      } else if (pass != passConf) {
          req.flash('message', '')
          req.flash('message', ['Your passwords do not match', 'Error', 'Passwords must match'])
          res.redirect('/register')
          console.log("error")
      } else {
          next()
      }
  }
}, passport.authenticate('register', {
  successRedirect : '../utickets',
  failureRedirect : '/register',
  failureFlash : true
}))
// ----------------------------------------------
router.get('/logout', (req, res) => {
  if (req.isAuthenticated()) {
      console.log('User [' + req.user.username + '] has logged out.')
      req.logout()
      res.redirect('/login');
  } else {
      res.redirect('/login')
  }
})

// =============================================
router.get('/login', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/utickets')
} else {
    res.render('login', {
        title: 'Ubumwe | Login',
        user: req.user,
        message: res.locals.message,
        page_name: 'Ubumwe | Login'
    })
}
});
// -----------------------------------------------
router.post('/login', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect('/utickets/hostingevent')
  } else {
      let user = (req.body.username).toLowerCase()
        let pass = req.body.password
        if (user.length === 0 || pass.length === 0) {
            req.flash('message', 'You must provide a username and password')
            res.redirect('/login')
        } else {
            next()
      }
  }
}, passport.authenticate('login', {
  successRedirect : '/utickets',
  failureRedirect : '/login',
  failureFlash : true
}))
// -----------------------------------------------------
router.get('/forgotpassword', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('../utickets/hostingevent')
} else {
    res.render('forgotpassword', {
        title: 'Ubumwe | Login',
        user: req.user,
        message: res.locals.message,
        page_name: 'Ubumwe | Login'
    })
}
});

// -------------------------------------------------
module.exports = router;
