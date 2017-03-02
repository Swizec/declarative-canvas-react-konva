
import React, { Component } from 'react';
import { Circle } from 'react-konva';

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
    moon: { x: -575, y: -299, c: '#b20717' },
    bear: { x: -576, y: -421, c: '#a88534' }
};

const MarbleR = 25;

class Marble extends Component {
    onDragEnd() {
        const { x, y } = this.props,
              circle = this.refs.circle;

        this.props.onShoot({
            x: circle.attrs.x,
            y: circle.attrs.y,
            vx: (circle.attrs.x-x)/7,
            vy: (circle.attrs.y-y)/7
        });
    }

    render() {
        const { x, y, sprite, type, draggable } = this.props;

        return (
            <Circle x={x} y={y} radius={MarbleR}
                    fillPatternImage={sprite}
                    fillPatternOffset={Marbles[type]}
                    fillPatternScale={{ x: MarbleR*2/111, y: MarbleR*2/111 }}
                    shadowColor={Marbles[type].c}
                    shadowBlur="15"
                    shadowOpacity="1"
                    draggable={draggable}
                    onDragEnd={this.onDragEnd.bind(this)}
                    ref="circle"
                    />
        );
    }
}

export default Marble;
export { Marbles, MarbleSprite };
