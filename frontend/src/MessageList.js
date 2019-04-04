import React, { Component } from 'react';
import { Button } from './Button';
import './css/message.css'

const API = 'http://localhost:3001';

class MessageList extends Component {

	constructor(props) {
    super(props);

    this.state = {
      messages: [],
      numStarred: 0,
      showTrashed: false,
      sort: 'None',
      search: ''
    }

    this.setStarred = this.setStarred.bind(this);
    this.setTrashed = this.setTrashed.bind(this);
    this.toggleShowTrashed = this.toggleShowTrashed.bind(this);
    this.updateSort = this.updateSort.bind(this);
  }

	componentDidMount() {

		this.refresh();
	}

	refresh() {

		var params = [];

		if(this.state.search.length !== 0) {

			params.push('search=' + this.state.search);
		}

		if(this.state.sort !== 'None') {

			if(this.state.sort === 'Descending') {

				params.push('sort=false');
			}
			else {

				params.push('sort=true');
			}
		}

		var query = params.join('&');

    fetch(API + '/messages?' + query)
      .then(response => response.json())
      .then(data => {
        this.setState({ messages: data });
        fetch(API + '/starred')
          .then(response => response.json())
          .then(data => this.setState({ numStarred: data.numStarred }));
      });
  }

  updateMessage(colName, messageId, value) {

    fetch(API + '/update', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messageId: messageId,
        value: value,
        colName: colName
      })
    }).then(() => this.refresh());
  }

  updateSort() {

  	var newVal = 'None';

  	switch(this.state.sort) {
  		case('None'):
  			newVal = 'Descending';
  			break;
  		case('Descending'):
  			newVal = 'Ascending';
  			break;
  	}

  	this.setState({sort: newVal}, () => this.refresh());
  }

  updateSearch(event) {
  	this.setState({search: event.target.value}, () => this.refresh());
  }

  toggleShowTrashed() {
    this.setState({showTrashed: !this.state.showTrashed});
  }

  setTrashed(messageId, value) {
    this.updateMessage('trashed', messageId, !value);
  }

  setStarred(messageId, value) {
    this.updateMessage('starred', messageId, value);
  }

	render() {

		var messages = [];

		var compareVal = this.state.showTrashed ? 0 : 1;

		for( var i in this.state.messages ) {

			if(this.state.messages[i].trashed !== compareVal) {

				messages.push(
					<Message 
						messageInfo={this.state.messages[i]} 
						setTrashed={this.setTrashed}
						setStarred={this.setStarred}
					/>
				);
			}
		}

		if(messages.length === 0) {

			messages = <div className="message empty">No messages</div>
		}

		return(
			<div className="message-list">
				<div className="starred">
          Starred: {this.state.numStarred}
        </div>
        <div className="options">
          <Button
            value={this.state.showTrashed}
            message="Show Trashed Messages"
            activeMessage="Show Untrashed Messages"
            func={this.toggleShowTrashed}
          />
          <Button
          	value={false}
          	message={'Sort: ' + this.state.sort}
          	func={this.updateSort}
          />
          <input
          	value={this.state.search}
          	onChange={this.updateSearch.bind(this)} 
          	placeholder="Search..."
          />
        </div>
				{messages}
			</div>
		);
	}
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
          <div className="buttons">
	          <Button
		        	value={props.messageInfo.starred}
		        	message="Star Message!"
		        	activeMessage="Starred!"
		        	func={props.setStarred}
		        	messageid={props.messageInfo.message_id}
		        />
		        <Button
		        	/*
		        	 * ! flips colors of button (setTrashed() also inverts value)
		        	 */
		        	value={!props.messageInfo.trashed}
		        	message="Trash Message"
		        	activeMessage="Trashed"
		        	func={props.setTrashed}
		        	messageid={props.messageInfo.message_id}
		        />
		       </div>
        </div>
        {
        	/*
        	 * Have to make sure all messages are sanitized
        	 * because of dangerouslySetInnerHTML
        	 */
        }
        <div
        	className="message-body"
        	dangerouslySetInnerHTML={{__html: props.messageInfo.content}}
        >
        </div>
      </div>
    </div>
  );
}

export default MessageList;