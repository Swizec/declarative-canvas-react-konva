
import React, { Component } from 'react';

import { Stage, Layer, Group, Circle } from 'react-konva';
// marbles sprite from https://dribbble.com/shots/2186007-Monster-Marbles
import MarbleSprite from './monster-marbles-sprite-sheets.jpg';
import { scalePoint } from 'd3-scale';
import { range } from 'd3-array';

const Marbles = {
    dino: { x: -222, y: -177, c: '#8664d5' },
    redHeart: { x: -222, y: -299, c: '#e47178' },
    sun: { x: -222, y: -420, c: '#5c96ac' },

    yellowHeart: { x: -400, y: -177, c: '#c8b405' },
    mouse: { x: -400, y: -299, c: '#7d7e82' },
    pumpkin: { x: -400, y: -420, c: '#fa9801' },

    frog: { x: -576, y: -177, c: '#98b42b' },
    moon: { x: -575, y: -299, c: '#b20717' },
    bear: { x: -576, y: -421, c: '#a88534' }
};

const MarbleR = 25;

const Marble = ({ x, y, sprite, type }) => (
    <Circle x={x} y={y} radius={MarbleR}
            fillPatternImage={sprite}
            fillPatternOffset={Marbles[type]}
            fillPatternScale={{ x: MarbleR*2/111, y: MarbleR*2/111 }}
            shadowColor={Marbles[type].c}
            shadowBlur="15"
            shadowOpacity="1"
           />
);

class Collisions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sprite: null,
            positions: this.initialPositions
        }
    }

    get initialPositions() {
        const { width, height } = this.props,
              center = width/2;

        return range(3, 0, -1).map(y => {
            if (y === 3) return [[center, 200]];

            const left = center - y*(MarbleR+5),
                  right = center + y*(MarbleR+5);

            return range(left, right, MarbleR*2+5).map(x => [x, 200-y*(MarbleR*2+5)]);
        }).reduce((acc, pos) => acc.concat(pos), []);
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
              { width, height } = this.props,
              marbleTypes = Object.keys(Marbles);

        if (!sprite) {
            return (<h2>Loading sprites ...</h2>);
        }


        return (
            <Stage width={width} height={height}>
                <Layer>
                    <Group>
                        {this.state.positions.map(([x, y], i) => (
                            <Marble x={x}
                                    y={y}
                                    type={marbleTypes[i%marbleTypes.length]}
                                    sprite={sprite}
                                    key={`${marbleTypes[i%marbleTypes.length]}-${i}`} />
                         ))}
                    </Group>
                </Layer>
            </Stage>
        )
    }
}

export default Collisions;
