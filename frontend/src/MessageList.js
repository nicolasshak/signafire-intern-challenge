import React from 'react';
import Button from './Button';

import './message.css'

const MessageList = (props) => {

	var messages = [];

	var compareVal = props.showTrashed ? 0 : 1;

	for( var i in props.messages ) {
		if(props.messages[i].trashed !== compareVal) {
			messages.push(
				<Message 
					messageInfo={props.messages[i]} 
					setTrashed={props.setTrashed}
					setStarred={props.setStarred}
				/>
			);
		}
	}

	if(messages.length === 0) {
		messages = <div className="message empty">No messages</div>
	}

	return(
		<div className="message-list">
			{messages}
		</div>
	);
}

const Message = (props) => {

  return (
    <div className="message">
      <div className="user-details">
        <img src={props.messageInfo.avatar} />
        <div className="user-handle">
          {props.messageInfo.handle}
        </div>
      </div>
      <div className="message-contents">
        <div className="message-header">
          <div className="source-date">
            {props.messageInfo.source} | {props.messageInfo.timestamp}
          </div>
          <Button
	        	value={props.messageInfo.starred}
	        	message="Star Message!"
	        	activeMessage="Starred!"
	        	func={props.setStarred}
	        	messageid={props.messageInfo.message_id}
	        />
	        <Button
	        	value={props.messageInfo.trashed}
	        	message="Trash Message"
	        	activeMessage="Trashed"
	        	func={props.setTrashed}
	        	messageid={props.messageInfo.message_id}
	        />
        </div>
        <div className="message-body">
          {props.messageInfo.content}
        </div>
      </div>
    </div>
  );
}

export default MessageList;