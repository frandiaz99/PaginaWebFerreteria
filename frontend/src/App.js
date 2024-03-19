import logo from './logo.svg';
import './App.css';
import Post from './components/Post';
import  HeaderMain  from './components/header/HeaderMain.js';
import React, { useState } from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

function App() {
  const [stateUser, setStateUser] = useState();


  return (
    <>
     <header>
        <HeaderMain/>
      </header>
    <div className="App">
     
      <body className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Post/>
        
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
          >
          Learn React
        </a>
      </body>
    </div>
          </>
  );
}

export default App;
