import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Collisions from './Collisions';

class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Inelastic collisions</h2>
                    <p>Rendered on canvas, built with React and Konva</p>
                </div>
                <div className="App-intro">
                    <Collisions width={500} height={500} />
                </div>
            </div>
        );
    }
}

export default App;
