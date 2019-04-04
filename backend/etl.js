/*
 *	Load messages from json at path into db
 */

var fs = require('fs');

module.exports = function(db, path) {

	var data = fs.readFileSync(path);
	var messages = JSON.parse(data);

	for( var i in messages['messages'] ) {
		
		const currentMessage = messages['messages'][i];

		/*
		 * Could just insert since messages.json is one message per handle
		 */
		var queryInsertUser = 'INSERT OR REPLACE INTO users(handle, avatar) VALUES (?, ?)';
		var userDetails = [currentMessage['handle'], currentMessage['avatar']];
		
		db.run(queryInsertUser, userDetails, function(err) {		
			
			if (err) {
				return console.log(err.message);
			}
		});

		var querySelectUser = 'SELECT user_id FROM users WHERE handle = ?';
		var userHandle = [currentMessage['handle']];

		db.get(querySelectUser, userHandle, function(err, row) {		

			if (err) {
				return console.log(err.message);
			}

			userId = row['user_id'];

			var queryInsertMessage = `
				INSERT INTO
					messages(
						message_id,
						user_id, 
						timestamp, 
						source, 
						content, 
						score, 
						starred, 
						trashed 
					) 
				VALUES 
					(?, ?, ?, ?, ?, ?, ?, ?)
			`;
			
			var messageDetails = [
				currentMessage['id'],
				userId,
				currentMessage['timestamp'],
				currentMessage['source'],
				currentMessage['content'],
				currentMessage['score'],
				currentMessage['meta']['isStarred'],
				currentMessage['meta']['isTrashed']
			];

			db.run(queryInsertMessage, messageDetails);
		});
	}
}