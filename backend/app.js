var http = require('http');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const HTTP_PORT = 3001;

/*
 * I thought it would lend itself to the challenge to perform the 
 * db setup and etl on server launch rather than connecting to a
 * db file.
 */
let db = new sqlite3.Database(':memory:', (err) => {

	if (err) {
		return console.error(err.message);
	}
	console.log('Connected to in-memory database.');
});

createTableUsers = `
	CREATE TABLE
		users( 
			user_id integer PRIMARY KEY AUTOINCREMENT,
			handle text UNIQUE,
			avatar text 
		)
`

db.run(createTableUsers);

createTableMessages = `
	CREATE TABLE 
		messages( 
			message_id integer,
			user_id integer, 
			timestamp text, 
			source text, 
			content text, 
			score integer, 
			starred integer, 
			trashed integer
		)
`
db.run(createTableMessages);
db.serialize();

// Insert messages into db
const etl = require('./etl.js');
etl(db, './messages.json');

const api = require('./api.js');
api(db, app);

http.createServer(app).listen(HTTP_PORT, function() {
	console.log('Server is bound to port: ', HTTP_PORT);
});