module.exports = function(db, app) {

	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	});

	/*
	 * Highlighted text is returned as a string in JSX format
	 */
	app.get('/messages', function(req, res) {

		query = `
			SELECT 
				messages.message_id,
				users.handle,
				users.avatar,
				messages.timestamp,
				messages.source,
				messages.content,
				messages.score,
				messages.starred,
				messages.trashed
			FROM 
				messages
			JOIN 
				users
			ON 
				users.user_id = messages.user_id
		`;

		if( req.query['sort'] !== undefined ) {

			query += ' ORDER BY messages.score';

			req.query['sort'] === 'true' ?
				query += ' ASC' :
				query += ' DESC';
		}

		db.all(query, [], (err, rows) => {

			if (err) {
				return console.log(err.message);
			}

			for(var i = 0; i < rows.length; i++) {

				if(req.query['search'] !== undefined) {

					if(rows[i]['trashed'] === 0) {

						var regex = new RegExp(req.query['search'], 'g');
						var highlighted = rows[i]['content'].replace(regex, '<span class="highlighted">' + req.query['search'] + '</span>');
						
						rows[i]['content'] = highlighted;
					}
				}

				var parsedDate = new Date(rows[i]['timestamp']) + '';
				parsedDate = parsedDate.split(' ');

				rows[i]['timestamp'] = parsedDate[1] + ', ' + parsedDate[2] + ' ' + parsedDate[3];
			}

			res.send(rows);
		});
	});

	app.get('/starred', function(req, res) {

		query = `
			SELECT
				*
			FROM
				messages
			WHERE
				messages.starred = 1
		`;

		db.all(query, [], (err, rows) => {

			if (err) {
				return console.log(err.message);
			}

			res.send({
				numStarred: rows.length
			});
		});
	});

	app.post('/update', function(req, res) {

		if( req.body.messageId !== undefined &&
			req.body.value !== undefined &&
			req.body.colName !== undefined) {

			var query = `
				UPDATE
					messages
				SET
					${req.body.colName} = ${req.body.value}
				WHERE
					message_id = ${req.body.messageId}
			`;

			db.run(query, [], function(err) {

				if(err) {
					console.log(err);
				}
			});
		}

		res.sendStatus('OK');
	});
}


