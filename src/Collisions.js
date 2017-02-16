
import React, { Component } from 'react';

import { Stage, Layer, Group, Circle } from 'react-konva';
// marbles sprite from https://dribbble.com/shots/2186007-Monster-Marbles
import MarbleSprite from './monster-marbles-sprite-sheets.jpg';

const Marbles = {
    dino: { x: -222, y: -177, c: '#8664d5' },
    redHeart: { x: -222, y: -299, c: '#e47178' },
    sun: { x: -222, y: -420, c: '#5c96ac' },

    yellowHeart: { x: -400, y: -177, c: '#c8b405' },
    mouse: { x: -400, y: -299, c: '#7d7e82' },
    pumpkin: { x: -400, y: -420, c: '#fa9801' },

    frog: { x: -576, y: -177, c: '#98b42b' },
    moon: { x: -576, y: -299, c: '#b20717' },
    bear: { x: -576, y: -421, c: '#a88534' }
};

const Marble = ({ x, y, sprite, type }) => (
    <Circle x={x} y={y} radius={25}
            fillPatternImage={sprite}
            fillPatternOffset={Marbles[type]}
            fillPatternScale={{ x: 25*2/111, y: 25*2/111 }}
            shadowColor={Marbles[type].c}
            shadowBlur="15"
            shadowOpacity="1"
           />
);

class Collisions extends Component {
    state = {
        sprite: null,
        positions: []
    }

    componentDidMount() {
        const sprite = new Image();
        sprite.src = MarbleSprite;

        sprite.onload = () => {
            this.setState({
                sprite: sprite
            });
        };
    }

    render() {
        const { sprite } = this.state,
              { width, height } = this.props;

        if (!sprite) {
            return (<h2>Loading sprites ...</h2>);
        }

        return (
            <Stage width={width} height={height}>
                <Layer>
                    <Group>
                        {Object.keys(Marbles).map((type) => (
                            <Marble x={Math.random()*1000%width}
                                    y={Math.random()*1000%height}
                                    type={type}
                                    sprite={sprite}
                                    key={type} />
                         ))}
                    </Group>
                </Layer>
            </Stage>
        )
    }
}

export default Collisions;
