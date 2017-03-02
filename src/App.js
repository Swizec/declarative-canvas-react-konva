
import React, { Component } from 'react';
import './App.css';

import Collisions from './Collisions';

class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <h2>Elastic collisions</h2>
                    <p>Rendered on canvas, built with React and Konva</p>
                </div>
                <div className="App-intro">
                    <Collisions width={800} height={600} />
                </div>
            </div>
        );
    }
}

export default App;
