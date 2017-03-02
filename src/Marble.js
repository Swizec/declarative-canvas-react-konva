
import React, { Component } from 'react';
import { Circle } from 'react-konva';
import { inject, observer } from 'mobx-react';

// marbles sprite from https://dribbble.com/shots/2186007-Monster-Marbles
import MarbleSprite from './monster-marbles-sprite-sheets.jpg';
import { MarbleDefinitions } from './Physics';

const MarbleR = 25;

@inject('physics') @observer
class Marble extends Component {
    onDragEnd() {
        const { x, y, physics, index } = this.props,
              circle = this.refs.circle;

        physics.shoot({
            x: circle.attrs.x,
            y: circle.attrs.y,
            vx: (circle.attrs.x-x)/7,
            vy: (circle.attrs.y-y)/7
        }, index);
    }

    render() {
        const { x, y, sprite, type, draggable } = this.props;

        return (
            <Circle x={x} y={y} radius={MarbleR}
                    fillPatternImage={sprite}
                    fillPatternOffset={MarbleDefinitions[type]}
                    fillPatternScale={{ x: MarbleR*2/111, y: MarbleR*2/111 }}
                    shadowColor={MarbleDefinitions[type].c}
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
export { MarbleSprite };
