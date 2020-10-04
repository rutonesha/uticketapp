const pool = require('../config/database.js');
const { Client } = require('pg');
const passport = require('passport');
const app = require('../app.js');
const uniqueString = require('unique-string');
var uidNumber = require("uid-safe")
async function setupticket(req, res, done) {

    if (req.isAuthenticated()){
      const client = await pool.connect()
      await client.query('BEGIN') 
      const ename = req.params.ename
      const userid = req.user.userid


      if (typeof ename !== 'undefined' && ename && ename !== null){
        await JSON.stringify(client.query('SELECT eventid,ename,allticketstablenames FROM allevent WHERE ename=($1) AND userid=($2)', [ename,userid], (err, checkresult) => {
          if (err){
            console.log(err)
          } 
          if (typeof checkresult == 'undefined' || checkresult.rows[0] == null){
            res.render('error', { title: 'Page not found', layout: 'error' });
          }
          if (ename == checkresult.rows[0].ename){
              const allticketstablenames = checkresult.rows[0].allticketstablenames
              const eventid = checkresult.rows[0].eventid
              const createdat = Date()
              const updatedat = Date()
              const symtext = uniqueString();
              const { ticketname, ticketart, ticketartname, numberoftickets, ticketsize, twidth, theight, symbol, scaleX, scaleY, rotate, cordx, cordy, bgcolor, bordercolor, usebarcode, price, currency } = req.body
              

              JSON.stringify(client.query('SELECT ticketid FROM tickettable WHERE ticketname=($1) AND eventid=($2)', [ticketname, eventid], (err, result) => {
                if (err) {
                  console.log(err)
                }

                if (result.rows[0]) {
                  console.log('ticket name already used')
                  req.flash('message', ['The ticket name '+ ticketname +' already used!', 'Warning'])
                  res.redirect('/utickets/tickets/addticket/'+ ename +'')
                } else {

                  JSON.stringify(pool.query('INSERT INTO tickettable (userid, eventid, ticketname, ticketart, ticketartname, numberoftickets, ticketsize, twidth, theight, symbol, rotate, cordx, cordy, bgcolor, bordercolor, usebarcode, createdat, updatedat, scalex, scaley, price, currency, mytablename) VALUES ($1, $2, $3, $4, $5 , $6, $7 ,$8 ,$9 ,$10 ,$11 ,$12 ,$13 ,$14 ,$15, $16, $17,$18, $19, $20, $21, $22, $23)', [userid, eventid, ticketname, ticketart, ticketartname, numberoftickets, ticketsize, twidth, theight, symbol, rotate, cordx, cordy, bgcolor, bordercolor, usebarcode, createdat, updatedat, scaleX, scaleY, price, currency, allticketstablenames], (err, results)=>{
                    if (err){
                      console.log(err)
                    }
                    if (results){
                        
                      for (let i = 0; i < numberoftickets; i++) {
                        const serialnumber = uidNumber.sync(18)
                        const codes = uniqueString()
                        const tickettype = ticketname
                        JSON.stringify(pool.query('INSERT INTO '+allticketstablenames+' (serialnumber, codes, tickettype) VALUES ($1, $2, $3)', [serialnumber, codes, tickettype], (err, results)=>{
                          if (err){
                            return done(err);
                          }
                          
                        }))
                      }
                      
                      console.log("tickket inserted successful")
                      console.log()
                      req.flash('message', ['New ticket ' + ticketname + ' is created', 'Success', 'Ticket created'])
                      res.redirect('/utickets/tickets/'+ ename +'')

                    }
                  }));
                  const status = "Make tickets"
                  JSON.stringify(pool.query('UPDATE allevent SET  status=$1 WHERE eventid=$2',[ status, eventid], (err, result) => {
                    if (err){
                      console.log(err)
                      return done(err)
                    } else {
                      console.log("eveent status  updated");
                    }
                    
                  }))

                }
            }))


            } else {
              res.render('error', { title: 'Event not found', layout: 'error' });
            }
              
            
          }
        ))

      } else {
        res.render('error', { title: 'Event not found', layout: 'error' });
      }
       



        // var codestablename = userid+eventid+codes
        // console.log(codestablename)
        // var createcodestable = ""
    }
    else {
        res.redirect('../login')
    }
}

// ===============================================================

async function deleteticket(req,res, next) {
  
  if (req.isAuthenticated()){
    const client = await pool.connect()
    await client.query('BEGIN')
    const userid = req.user.userid
    // const eventname = req.params.ename
    const eventid = req.params.eventid
    const ticketid = req.params.ticketid
    console.log('startting deletion')
    
    if (typeof eventid !== 'undefined' && typeof ticketid !== 'undefined'){
      await JSON.stringify(client.query('SELECT ticketid,ticketname FROM tickettable WHERE eventid=($1) AND ticketid=($2)', [eventid,ticketid], (err, checkticket) => {
        if (err){
          console.log(err)
          // res.flash('message', ['Ticket can not be deleted', 'Error', 'Security Purpose'])
          // res.redirect('../tickets/'+eventname+'')
        }
        if (checkticket){
          const ticketname = checkticket.rows[0].ticketname
          JSON.stringify(pool.query('DELETE FROM tickettable WHERE ticketid = $1 AND eventid = $2', [ticketid, eventid], (err, result) => {
                if (err){
                    console.log(err)
                } 
                if (result){
                    console.log("Ticket is  deleted")
                    JSON.stringify(client.query('SELECT eventid,ename FROM allevent WHERE eventid=($1)', [eventid], (err, checkresults) => {
                      if (err){
                        console.log(err)
                      }
                      if( checkresults.rows[0].eventid == eventid){
                        console.log('redidrecting now')
                        const eventname = checkresults.rows[0].ename  
                        req.flash('message', ['Ticket ' + ticketname + ' is deleted successful', 'Success', 'Deletion complete'])
                        res.redirect('/utickets/tickets/'+eventname+'')
                      }
                    }))
                    // res.send('ok')
                    
                }
            }
            ))
        }
      }))
    }

    

       
  }
  else {
      res.redirect('../login')
  }
}


// =====================================================================================

module.exports = { setupticket, deleteticket }