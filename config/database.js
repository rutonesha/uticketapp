const { Pool } = require('pg')

const pool = new Pool({
    user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_DATABASE,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
	// ssl: false,
	pool: {
		max: 500,
		min: 0,
		acquire: 30000,
		idle: 10000
	  }
})

module.exports = pool;


// require('dotenv').config()
// const pg = require('pg')

// const {Pool} = require('pg')
// const isProduction = process.env.NODE_ENV === 'production'

// const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`

// const pool = new Pool({
//   connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
//   ssl: isProduction,
// })

// module.exports = {pool}