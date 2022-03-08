import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

// In every React application we have to mount our application "App" onto the 'root' div in the 'index.html' file
// 'index.html' is an empty document with a single div called 'root'
ReactDOM.render(<App />, document.getElementById('root'));