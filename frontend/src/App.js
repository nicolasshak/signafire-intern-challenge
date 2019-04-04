import React, { Component } from 'react';
import MessageList from './MessageList';
import logo from './assets_logo-sf-small.png';
import './css/App.css';

class App extends Component {

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
          <MessageList />
        </div>
      </div>
    );
  }
}

export default App;