const fs = require('fs');
const PDFDocument = require('pdfkit');
const bwipjs = require('bwip-js');
const drawing = require('bwip-js/examples/drawing-pdfkit');

const pool = require('../config/database.js');
const codetext = require('crypto-random-string');
const { Buffer } = require('buffer');


async function samples(req, res, done) {
    if (req.isAuthenticated()){
        const eventid = req.params.eventid
        const ticketid = req.params.ticketid
        const userid = req.user.userid
        const client = await pool.connect()
        await client.query('BEGIN') 

        if (typeof eventid !== 'undefined' && eventid && ticketid !== null && typeof ticketid !== 'undefined'){
            JSON.stringify(client.query('SELECT * FROM tickettable WHERE ticketid=($1) AND eventid=($2)', [ticketid, eventid], (err, results) => {
                if (err) {
                    console.log(err)
                }

                if (results.rows.lenght > 1) {
                    console.log('Invalid ticket retrieved')
                   return done(req.flash('message', ['The ticket name '+ results.rows[0].ticketname +' is invalid to print !', 'Error', 'Unable to retrieve ticket']),res.redirect('/utickets/tickets/addticket/'+ ename +'')) 
                    
                } else {
                    const ticketname = results.rows[0].ticketname
                    const ticketart = results.rows[0].ticketart
                    const numberoftickets = results.rows.lenght
                    const ticketsize = results.rows[0].ticketsize
                    const symbol = results.rows[0].symbol
                    const rotate = results.rows[0].rotate
                    const cordx = results.rows[0].cordx
                    const cordy = results.rows[0].cordy
                    const bgcolor = results.rows[0].bgcolor
                    const bordercolor = results.rows[0].bordercolor
                    const usebarcode = results.rows[0].usebarcode
                    const scalex = results.rows[0].scalex
                    const scaley = results.rows[0].scaley
                    const mytablename = results.rows[0].mytablename

                    if (ticketsize == 'Small') {
                        const twidth = 14
                        const theight = 5.5
                        const text = codetext(10)
                        const myscale = 5
                        let opts = {
                            bcid: ''+ symbol +'',
                            text: 'hhhhjkhkjhjhjh'+ text +'',
                            // padding: 0.5,
                            backgroundcolor: 'ffffff',
                            // scalex: scalex,
                            scale: scaley,
                            scale: myscale,
                            width: 5,
                            height: 5,
                            rotate: rotate,
                        
                        };
                        
                        const doc = new PDFDocument; 
                        const pdfname = results.rows[0].ticketname
                        doc.pipe(fs.createWriteStream(''+ pdfname +'.pdf'));

                        const imgs = bwipjs.toBuffer(opts)
                        doc.image('C:/Users/Yves/Desktop/app/cazzzzzzy/public/img/services/KCCC.jpg', 0, 0, {width: 415} )
                        
                        at(cordx, cordy, opts);
                    
                       




                        doc.end();
                        console.log('saved as '+ pdfname +'.pdf');

                        function at(x, y, opts, scale) {
                            doc.save();
                            doc.translate(x, y);
                            doc.scale(scale || .5);
                            
                            bwipjs.fixupOptions(opts);
                            bwipjs.render(opts, drawing(doc, opts, bwipjs.FontLib));
                        
                            doc.restore();
                        }



                        
                    } if (ticketsize == 'medium') {
                        const twidth = 14
                        const theight = 5.5
                    } if (ticketsize == 'large') {
                        const twidth = 14
                        const theight = 5.5
                    } if (ticketsize == 'customised') {
                        const twidth = results.rows[0].twidth
                        const theight = results.rows[0].theight
                    } else {
                        console.log('Invalid ticket size')
                        // req.flash('message', ['Unable to retrieve ticket '+ results.rows[0].ticketname +' size !', 'Error', 'Unable to retrieve ticket'])
                        // res.redirect('/utickets/tickets/addticket/'+ ename +'')
                    }
                }
            }))

        }

    } else {
        res.redirect('/login')
    }
}

module.exports = {samples}