const   sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./database.sqlite3');

db.serialize(function() {

// creating artist table 

db.run(`CREATE TABLE IF NOT EXISTS Artist (id INTEGER PRIMARY KEY,
	name TEXT NOT NULL,
	data_of_birth TEXT NOT NULL,
	biography TEXT NOT NULL,
	is_currently_employed INTEGER DEFAULT 1 )`);

// creating series table 

db.run(`CREATE TABLE IF NOT EXISTS Series (id INTEGER PRIMARY KEY,
	name TEXT NOT NULL,
	description TEXT NOT NULL )`);

// creating issue table 

db.run(`CREATE TABLE IF NOT EXISTS Issue (id INTEGER PRIMARY KEY,
	name TEXT NOT NULL,
	issue_number INTEGER NOT NULL,
	publication_date TEXT NOT NULL,
	artist_id INTEGER NOT NULL,
	series_id INTEGER NOT NULL,
	FOREIGN KEY(artist_id) REFERENCES Artist(id),
	FOREIGN KEY(series_id) REFERENCES Series(id)
	 )`);
 
});


