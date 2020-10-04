var express = require('express');
var router = express.Router();
const passport = require('passport');
var multer  = require('multer')
// var uploadartwork = multer({ dest: 'events/artworks/' })


var storage = multer.memoryStorage()
var storageb = multer.memoryStorage()
var uploadartwork = multer({ storage: storage })
var updateartwork = multer({ storage: storageb })

var { getevents, addnewevent, deleteevent, maketickets, editprofile, editevent, updateevent, getaddticket, printtickets, sellingtickets } = require('../controllers/events.js');
var { setupticket, deleteticket } = require('../controllers/drawticket');
const {samples } = require('../controllers/samples.js');
const pool = require('../config/database.js');




router.get('/', getevents)
router.post('/addnewevent',uploadartwork.single('pic') , addnewevent)
router.get('/deleteevent/:eventid', deleteevent)
router.get('/tickets/deleteticket/:eventid/:ticketid', deleteticket)
router.get('/tickets/:ename', maketickets)
router.get('/printing/:ename', printtickets)
router.post('/editprofile', editprofile)
router.post('/tickets/addticket/:ename', setupticket)
router.get('/editevent/:eventid', editevent)
router.post('/updateevent/:eventid',updateartwork.single('pic') , updateevent)
router.get('/tickets/addticket/:eventname', getaddticket);
router.get('/selling/:ename', sellingtickets)

router.get('/tickets/samples/:eventid/:ticketid', samples)

router.get('/hostingevent', function(req, res, next) {
  if (req.isAuthenticated()) {
  
    res.render('utickets/hostingevent', { 
      
    })
} else {
    res.redirect('/login')
}
});

router.get('/addevent', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.render('utickets/addevent', { 
      title: 'UTickets | Add event', 
      layout: 'layoutA',
      page_name: 'UTickets | Host event',
      user: req.user,
      eventdata: null,
      message: res.locals.message
    })
} else {
    res.redirect('/login')
}
});


router.get('/profile', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.render('utickets/profile', { 
      title: 'UTickets | My profile', 
      layout: 'layoutA',
      page_name: 'UTickets | My Profile',
      user: req.user,
      message: res.locals.message
    })
} else {
    res.redirect('/login')
}
});

router.post('/updpass', (req, res, next) => {
  if (req.isAuthenticated()) {
      let password = req.body.password
      let newpass = req.body.newpass
      let newpassconf = req.body.newpassconf
      if (password.length === 0 || newpass.length === 0 || newpassconf.length === 0) {
          req.flash('message', 'You must provide your current password, new password, and new password confirmation.')
          res.redirect('../utickets/profile')
      } else if (newpass != newpassconf) { 
          req.flash('message', 'Your passwords do not match.')
          res.redirect('../utickets/profile')
      } else {
          next()
      }
  } else {
      res.redirect('../utickets/profile')
  }
}, passport.authenticate('updatePassword', {
  successRedirect : '../utickets/profile',
  failureRedirect : '../utickets/profile',
  failureFlash : true
}))


// =============================================================
module.exports = router;
// ==============================================================

