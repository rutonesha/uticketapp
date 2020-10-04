const fs = require('fs');
const PDFDocument = require('pdfkit');
const bwipjs = require('bwip-js');
// const drawing = require('bwip-js/examples/drawing-pdfkit');
const pool = require('../config/database.js');
// const drawsvg = require('bwip-js/examples/drawing-svg');

// const drawsvg = require('./drawing-svg');

async function pdftic(req, res, done) {

    const eventid = req.params.eventid
    const ticketid = req.params.ticketid
    const userid = req.user.userid

    const client = await pool.connect()
    await client.query('BEGIN') 

    if (typeof eventid !== 'undefined' && eventid && ticketid !== null && typeof ticketid !== 'undefined'){
        await JSON.stringify(client.query('SELECT ename FROM allevent WHERE eventid=($1) AND userid=($2)', [eventid,userid], (err, checkresult) => {
            if (err) {
                console.log(err)
            }
            if (checkresult.rows.lenght > 1) {
                console.log('Invalid ticket retrieved')
                req.flash('message', ['The ticket name '+ checkresult.rows[0].ename +' is invalid to print !', 'Error', 'Unable to retrieve ticket'])
                res.redirect('/utickets/tickets/addticket/'+ checkresult.rows[0].ename +'')
            } else {
                JSON.stringify(client.query('SELECT * FROM tickettable WHERE ticketid=($1) AND eventid=($2)', [ticketid, eventid], (err, results) => {
                    if (err) {
                        console.log(err)
                    }

                    if (results.rows.lenght > 1) {
                        console.log('Invalid ticket retrieved')
                        req.flash('message', ['The ticket name '+ results.rows[0].ticketname +' is invalid to print !', 'Error', 'Unable to retrieve ticket'])
                        res.redirect('/utickets/tickets/addticket/'+ ename +'')
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

                        if (ticketsize == 'small') {
                            const twidth = 14
                            const theight = 5.5
                            
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
                            req.flash('message', ['Unable to retrieve ticket '+ results.rows[0].ticketname +' size !', 'Error', 'Unable to retrieve ticket'])
                            res.redirect('/utickets/tickets/addticket/'+ ename +'')
                        }

                        JSON.stringify(client.query('SELECT * FROM '+ mytablename +'', (err, results) => {
                            if (err){
                                console.log(err)
                            }
                            if(results){
                                for (let index = 0; index < array.length; index++) {
                                    const element = array[index];
                                    
                                }
                            }
                        }))

                        
                        if (usebarcode == 'on'){
                            let opts = {
                                bcid: symbol,
                                text: 'bwip-js.metafloor.com',
                                padding: 2,
                                backgroundcolor: 'ffffff',
                                scalex: scalex,
                                scale: scaley,
                                rotate: rotate,
                        };
                        }
                    }
                }))
            }
        }))

        

    }

    if (req.isAuthenticated()){
       const doc = new PDFDocument; 
        let opts = {
                bcid: 'qrcode',
                text: 'bwip-js.metafloor.com',
                padding: 2,
                backgroundcolor: '077a56',
                scale: 1,
        };

        bwipjs.fixupOptions(opts);

        doc.pipe(fs.createWriteStream('bwip-js.pdf'));
        doc.image('C:/Users/Yves/Desktop/app/cazzzzzzy/public/img/services/KCCC.jpg', 0, 0, {width: 300} )

        at(0, 0, {
                bcid: 'qrcode',
                text: 'bwip-js.metafloor.com',
                padding: 2,
                backgroundcolor: '077a56',
                scale: 1,
        });

        doc.image('C:/Users/Yves/Desktop/app/cazzzzzzy/public/img/services/KCCC.jpg', 100, 20, {width: 300} )

        at(100, 20, {
                bcid: 'qrcode',
                text: 'bwip-js.metafloor.com',
                scale: '1',
                padding: '8',
                backgroundcolor: "AFB364",
                bordercolor: "000000"
        });

        doc.end();
        console.log('saved as bwip-js.pdf');

        // ==============================================

        function at(x, y, opts, scale) {
            doc.save();
            doc.translate(x, y);
            doc.scale(scale || .5);
            
            bwipjs.fixupOptions(opts);
            bwipjs.render(opts, drawing(doc, opts, bwipjs.FontLib));
        
            doc.restore();
        }

    }

}





// Always call fixupOptions() before passing to a drawing constructor.


// The drawing needs FontLib to extract glyph paths.
// let svg = bwipjs.render(opts, drawsvg(opts, bwipjs.FontLib));
// console.log(svg);



// doc.path(svg)
//   .stroke()





// Use a different scale, just because...


// Maxicode requires a custom scale at the pdfdoc level
// doc.buffer()



// We render at bwipjs.scale == 2 to get good detail on the drawing,
// then scale back down.  pdfkit, BWIPP and bwip-js all use the
// same scale factor of 72pt/inch.
