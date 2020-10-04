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
                    
                    const nodeHtmlToImage = require('node-html-to-image')

                    nodeHtmlToImage({
                    output: './image.png',
                    html: '<html><body>Hello {{name}}!</body></html>',
                    content: { name: 'you' }
                    })
                    .then(() => console.log('The image was created successfully!'))
                      



                   
                }
            }))

        }

    } else {
        res.redirect('/login')
    }
}

module.exports = {samples}