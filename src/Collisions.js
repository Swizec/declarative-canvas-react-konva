
import React, { Component } from 'react';

import { Provider as MobXProvider, observer } from 'mobx-react';

import Physics from './Physics';
import MarbleList from './MarbleList';
import { MarbleSprite } from './Marble';

@observer
class Collisions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sprite: null,
            marbles: this.initialPositions
        }
    }

    componentDidMount() {
        const sprite = new Image();
        sprite.src = MarbleSprite;

        sprite.onload = () => {
            console.log("Loaded the sprite");
            this.setState({
                sprite: sprite
            });

            Physics.startGameLoop();
        };
    }

    render() {
        return (
            <MobXProvider physics={Physics}>
                <MarbleList sprite={this.state.sprite} />
            </MobXProvider>
        )
    }
}

export default Collisions;
