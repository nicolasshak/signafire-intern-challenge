import React, { Component } from 'react';
import logo from './assets_logo-sf-small.png';
import './App.css';

import MessageList from './MessageList';
import Button from './Button';

const API = 'http://localhost:3001';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      numStarred: 0,
      showTrashed: false
    }

    this.setStarred = this.setStarred.bind(this);
    this.setTrashed = this.setTrashed.bind(this);
    this.toggleShowTrashed = this.toggleShowTrashed.bind(this);
  }

  componentDidMount() {

    this.refresh();
  }

  refresh() {

    fetch(API + '/messages')
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

  setTrashed(messageId, value) {
    this.updateMessage('trashed', messageId, value);
  }

  setStarred(messageId, value) {
    this.updateMessage('starred', messageId, value);
  }

  toggleShowTrashed() {
    this.setState(() => ({showTrashed: !this.state.showTrashed}));
  }

  render() {
    return (
      <div className="App">
        <header>
          <div className="header container">
            <img src={logo} className="logo" alt="logo" />
            <div className="title">
              MESSAGE VIEWER
            </div>
          </div>
        </header>
        <div className="container content">
          <div className="starred" onClick={() => this.updateMessage(1, 1, 1)}>
            Starred: {this.state.numStarred}
          </div>
          <div className="options">
            {
              /*
               * Kinda janky use of Button implementation that 
               * only works because toggleShowTrashed() doesn't 
               * take any params.
               */
            }
            <Button
              value={this.state.showTrashed}
              message="Show Trashed Messages"
              activeMessage="Show Untrashed Messages"
              func={this.toggleShowTrashed}
            />
          </div>
          <MessageList 
            messages={this.state.messages}
            setStarred={this.setStarred}
            setTrashed={this.setTrashed}
            showTrashed={this.state.showTrashed}
          />
        </div>
      </div>
    );
  }
}

export default App;