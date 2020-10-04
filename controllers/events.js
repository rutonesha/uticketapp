
const pool = require('../config/database.js');



// =====================================================================================
    async function addnewevent(req, res, done) {
        
        if (req.isAuthenticated()){
            
            const userid = req.user.userid
            const {ename, etype, edate, etime, venue, adress, moreadress, perfomernames, ftperfomernames, otherperfomernames, artworkname, artworkdata} = req.body
            const name = req.file.mimetype
            const databuffer = req.file.buffer
            const data = databuffer.toString('base64')
            const createdat = Date()
            const allticketstablenames = 'ticketsofuser'+userid+'withname'+ename
            
            const client = await pool.connect()
            await client.query('BEGIN')
            await JSON.stringify(pool.query('SELECT * FROM allevent WHERE ename=($1) AND userid=($2)',[ename, userid], (err, result) => {
                if (err){
                    console.log(err);
                    return done(err)
                } 
                if (result.rows.length == 0) {
                    JSON.stringify(pool.query('INSERT INTO allevent (userid,  ename, etype, edate,etime, venue, adress, moreadress, perfomernames, ftperfomernames, otherperfomernames, artworkname, artworkdata, createdat, allticketstablenames) VALUES ($1, $2, $3, $4, $5 , $6, $7 ,$8 ,$9 ,$10 ,$11 ,$12 ,$13 ,$14, $15)',[userid, ename, etype, edate, etime, venue, adress, moreadress, perfomernames, ftperfomernames, otherperfomernames, name, data, createdat, allticketstablenames], (err, result) => {
                        console.log("working on add event")
                        // console.log(result)
                        if (err){
                            console.log(err)
                            return done(err)
                        }
                        if (result){
                            req.flash('message', ['New event ' + ename + ' created', 'Success', 'New event added'])
                            res.redirect('../utickets')
                            client.query('COMMIT')

                            JSON.stringify(pool.query('CREATE TABLE IF NOT EXISTS '+allticketstablenames+' (codeid integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),serialnumber text COLLATE pg_catalog."default",codes text COLLATE pg_catalog."default",tickettype text COLLATE pg_catalog."default",issold boolean DEFAULT false,soldwhen text COLLATE pg_catalog."default",soldwhere text COLLATE pg_catalog."default",soldby text COLLATE pg_catalog."default",isprinted boolean DEFAULT false,printedwhen text COLLATE pg_catalog."default",isscanned boolean DEFAULT false,scannedwhen text COLLATE pg_catalog."default",scannedby text COLLATE pg_catalog."default",scannedwhere text COLLATE pg_catalog."default")TABLESPACE pg_default;', (err, created) => {
                                if (err){
                                    console.log(err);
                                } else {
                                    console.log('tickets table created')
                                }
                            }))
                            
                            return done()
                        }
                       
                        }
                    ))
                } else {
                    req.flash('message', ['Event ' + ename + ' already exist', 'Danger', 'Event exist'])
                    res.redirect('/utickets/addevent')
                }
            }))
            
        }
        else{
            res.redirect('../login')
        }
    }

    
    // =====================================================
    async function getevents(req, res, done) {
        
    try {
        if (req.isAuthenticated()){
           
            const client = await pool.connect()
            await client.query('BEGIN')
            const userid = req.user.userid
            await  JSON.stringify(pool.query('SELECT * FROM allevent WHERE userid=($1)',[userid], (err, results) => {
                if (err){
                    console.log(err)
                    return done(err)
                }
                if (results){
                    client.query('COMMIT')
                    res.render('utickets/index', { 
                        title: 'UTicket | Home', 
                        layout: 'layoutA',
                        page_name: 'UTicket | Home',
                        user: req.user,
                        allevents : results.rows,
                        message: res.locals.message
                    })

                    console.log("all events are retrieved")
                    
                    return done(res.end())
                    
                }
            
                }
            ))
            
           
        }
        else {
            res.redirect('../login')
        }
    }
    catch(e) {
        throw (e)
        
    } 
    
    }
// =============================================
    async function getaddticket(req, res, next) {
        
        
        if (req.isAuthenticated()) {
            const eventname= req.params.eventname
            const userid = req.user.userid
            const client = await pool.connect()
            await client.query('BEGIN')

            if (typeof eventname == 'undifined' || eventname == null){
                res.render('error', { title: 'Page not found', layout: 'error' });
            } else {
                await JSON.stringify(client.query('SELECT eventid,ename FROM allevent WHERE ename=($1) AND userid=($2)', [eventname,userid], (err, checkresult) => {
                    if (err){
                        console.log(err)
                    }
                    if(checkresult.rows[0] == 'undefined' || checkresult.rows[0] == null){
                        req.flash('message', 'Please open an Event to work on!')
                        res.redirect('../utickets')
                    } 
                    if (checkresult.rows[0]) {
                      res.render('utickets/addticket', { 
                        title: 'UTickets | Add ticket', 
                        layout: 'layoutA',
                        page_name: 'UTickets | Add ticket',
                        eventname: req.params.eventname,
                        user: req.user,
                        message: res.locals.message
                    })  
                    }
                }));
 
            }
          
      } else {
          res.redirect('/login')
      }
      }
    // ==================================================
    async function deleteevent(req,res, done) {
        

        // const allticketstablenames = 'ticketsofuser'+userid+'withname'+ename
        if (req.isAuthenticated()){
            const userid = req.user.userid
            const eventid = req.params.eventid
             await JSON.stringify(pool.query('DELETE FROM allevent WHERE userid = $1 AND eventid = $2', [userid, eventid], (err, result) => {
                console.log("deleted item")
                if (err){
                    console.log(err)
                    return done(err)
                } 
                if (result){
                    console.log("Event  deleted")
                    req.flash('message', ['Event is deleted successful', 'Success'])
                    res.redirect('/')
                    return done()
                }
             }
            ))
        }
        else {
            res.redirect('login')
        }
    }

    // =================================================================
    async function printtickets(req, res, done){
        

        if (req.isAuthenticated()){
            const userid = req.user.userid
            const ename = req.params.ename
            if (typeof ename !== 'undefined' && ename){
            await JSON.stringify(pool.query('SELECT * FROM allevent WHERE userid = $1 AND ename=$2',[userid, ename], (err, results) => {
            //    console.log(results)
            if (err){
                console.log(err)
                return done()
            }
            if (typeof results.rows[0] == 'undefined' || results.rows[0] == null){
                res.render('error', { title: 'Event not found', layout: 'error' });
            }
             if (results.rows.length == 1) {
                const eventid = results.rows[0].eventid
                 JSON.stringify(pool.query('SELECT * FROM tickettable WHERE userid = $1 AND eventid=$2',[userid, eventid], (err, alltickets) => {
                    if (err){
                        console.log(err)
                    }
                    if (alltickets){
                      res.render('utickets/printing', {
                        title: 'UTickets | Printing tickets', 
                        layout: 'layoutA',
                        page_name: 'UTickets | Printing tickets',
                        user: req.user,
                        allevents: results.rows[0],
                        alltickets: alltickets.rows,
                        message: res.locals.message
                })  
                    }

                    
                }))
                
                console.log('all  printing options retrieved')
            }
        })) 
            }
            
        } else {
            res.redirect('/login')
        }
        
    }

    // =================================================================
    async function sellingtickets(req, res, done){
        

        if (req.isAuthenticated()){
            const userid = req.user.userid
            const ename = req.params.ename
            if (typeof ename !== 'undefined' && ename){
            await JSON.stringify(pool.query('SELECT * FROM allevent WHERE userid = $1 AND ename=$2',[userid, ename], (err, results) => {
            //    console.log(results)
            if (err){
                console.log(err)
                return done()
            }
            if (typeof results.rows[0] == 'undefined' || results.rows[0] == null){
                res.render('error', { title: 'Event not found', layout: 'error' });
            }
             if (results.rows.length == 1) {
                const eventid = results.rows[0].eventid
                 JSON.stringify(pool.query('SELECT * FROM tickettable WHERE userid = $1 AND eventid=$2',[userid, eventid], (err, alltickets) => {
                    if (err){
                        console.log(err)
                    }
                    if (alltickets){
                      res.render('utickets/selling', {
                        title: 'UTickets | Selling tickets', 
                        layout: 'layoutA',
                        page_name: 'UTickets | Selling tickets',
                        user: req.user,
                        allevents: results.rows[0],
                        alltickets: alltickets.rows,
                        message: res.locals.message
                })  
                    }

                    
                }))
                
                console.log('all  printing options retrieved')
            }
        })) 
            }
            
        } else {
            res.redirect('/login')
        }
        
    }


    // =================================================================
    async function maketickets(req, res, next){
        

        if (req.isAuthenticated()){
            const userid = req.user.userid
            const ename = req.params.ename
            if (typeof ename !== 'undefined' && ename){
            await JSON.stringify(pool.query('SELECT * FROM allevent WHERE userid = $1 AND ename=$2',[userid, ename], (err, results) => {
            //    console.log(results)
            if (err){
                console.log(err)
            }
            if (typeof results.rows[0] == 'undefined' || results.rows[0] == null){
                res.render('error', { title: 'Page not found', layout: 'error' });
            }
             if (results.rows.length == 1) {
                const eventid = results.rows[0].eventid
                 JSON.stringify(pool.query('SELECT * FROM tickettable WHERE userid = $1 AND eventid=$2',[userid, eventid], (err, alltickets) => {
                    if (err){
                        console.log(err)
                    }
                    if (alltickets){
                      res.render('utickets/tickets', {
                        title: 'UTickets | Setup tickets', 
                        layout: 'layoutA',
                        page_name: 'UTickets | Setup tickets',
                        user: req.user,
                        allevents: results.rows[0],
                        alltickets: alltickets.rows,
                        message: res.locals.message
                })  
                    }

                    
                }))


                
                console.log('all tickets retrieved')
            }
        })) 
            }
            
        } else {
            res.redirect('/login')
        }
        
    }
    // ===============================================================================
    async function editevent(req, res, next){
        
        if (req.isAuthenticated()){
            const userid = req.user.userid
            const eventid = req.params.eventid
           await  JSON.stringify(pool.query('SELECT * FROM allevent WHERE userid = $1 AND eventid=$2',[userid, eventid ], (err, results) => {
               console.log(results)
            if (err){
                console.log(err)
                console.log("error is here")
            }
            if (results){
                res.render('utickets/addevent', {
                    title: 'UTickets | Edit event', 
                    layout: 'layoutA',
                    page_name: 'UTickets | Edit event',
                    user: req.user,
                    eventdata: results.rows[0],
                    message: res.locals.message
                })
                console.log("events  is retrieved to be edited")
            }
            else{
                req.flash('message', '')
            }
        })) 
        } else {
            res.redirect('login')
        }
        
    }
    // ====================================================================

    async function updateevent(req, res) {
        if (req.isAuthenticated()){
            const userid = req.user.userid
            console.log(req.file)
            const name = req.file.mimetype
            const databuffer = req.file.buffer
            const data = databuffer.toString('base64')
            
            const eventid = req.params.eventid
            var modifiedat = Date()
            const client = await pool.connect()
            await client.query('BEGIN')
            JSON.stringify(pool.query('UPDATE allevent SET userid=$1,  ename=$2, etype=$3, edate=$4, venue=$5, adress=$6, moreadress=$7, perfomernames=$8, ftperfomernames=$9, otherperfomernames=$10, currency=$11, regularprice=$12, vipprice=$13, vvipprice=$14, tableof=$15, tableprice=$16, artworkname=$17, artworkdata=$18, modifiedat=$19, etime=$20 WHERE eventid=$21',[userid, req.body.ename, req.body.etype, req.body.edate, req.body.venue, req.body.adress, req.body.moreadress, req.body.perfomernames, req.body.ftperfomernames, req.body.otherperfomernames, req.body.currency, req.body.regularprice, req.body.vipprice, req.body.vvipprice, req.body.tableof, req.body.tableprice, name, data, modifiedat,req.body.etime, eventid], (err, result) => {
                console.log("working on eddit event")
                // console.log(result)
                if (err){
                    console.log(err)
                }
                if (result){
                    req.flash('message', 'Event ' + req.body.ename + ' is updated')
                    res.redirect('/utickets')
                    // client.query('COMMIT')
                    // return (result)
                }
                else{
                    console.log("  eventttt editeddddd")
                    // console.log(result)
                    
                }
                }
            ))
        }
        else{
            res.redirect('login')
        }
    }

    // ===================================================================

    async function editprofile(req, res, next){
        const userid = req.user.userid
        var updatedat = Date()
        const { firstname, secondname, adress, testmony, district, country, city } = req.body
        if (req.isAuthenticated()){
           await  JSON.stringify(pool.query('UPDATE users SET firstname=$1, secondname=$2, adress=$3, testmony=$4, district=$5, country=$6, city=$7,updatedat=$8 WHERE userid=$9', [firstname, secondname, adress, testmony, district, country, city, updatedat, userid], (err, results) => {
               console.log(results)
            if (err){
                console.log(err)
                console.log("error is here")
                console.log(updatedat,firstname,secondname,adress, userid)
            }
            if (results){
                res.redirect('/utickets/profile')
                req.flash('message', 'Profile is updated')
                
                console.log("user profile updated")
                
            }
            else{
                req.flash('message', 'welcome to UTickets')
                
            }
        })) 
        } else {
            res.redirect('../login')
        }
        
    }

    
module.exports = {
    getevents,
    addnewevent,
    deleteevent,
    maketickets,
    editprofile,
    getaddticket,
    editevent,
    printtickets,
    sellingtickets,
    updateevent
}
