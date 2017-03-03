
import React, { Component } from 'react';
import { Circle } from 'react-konva';
import { inject, observer } from 'mobx-react';

// marbles sprite from https://dribbble.com/shots/2186007-Monster-Marbles
import MarbleSprite from './monster-marbles-sprite-sheets.jpg';
import { MarbleDefinitions } from './Physics';

@inject('physics') @observer
class Marble extends Component {
    onDragStart() {
        const { physics, id } = this.props;

        this.setState({
            origX: physics.marbles[id].x,
            origY: physics.marbles[id].y,
            startTime: new Date()
        });
    }

    onDragMove() {
        const { physics, id } = this.props;
        const { x, y } = this.refs.circle.attrs;

        physics.marbles[id].x = x;
        physics.marbles[id].y = y;
    }

    onDragEnd() {
        const { physics } = this.props,
              circle = this.refs.circle,
              { origX, origY } = this.state,
              { x, y } = circle.attrs;


        const deltaT = new Date() - this.state.startTime,
              dist = (x - origX) ** 2 + (y - origY) ** 2,
              v = Math.sqrt(dist)/(deltaT/16); // distance per frame (= 16ms)

        physics.shoot({
           x: x,
           y: y,
           vx: (x - origX)/(v/2), // /2 is a speedup factor
           vy: (y - origY)/(v/2)
           }, this.props.id);
    }

    render() {
        const { sprite, type, draggable, id, physics } = this.props;

        const { x, y, r } = physics.marbles[id];

        return (
            <Circle x={x} y={y} radius={r}
                    fillPatternImage={sprite}
                    fillPatternOffset={MarbleDefinitions[type]}
                    fillPatternScale={{ x: r*2/111, y: r*2/111 }}
                    shadowColor={MarbleDefinitions[type].c}
                    shadowBlur="15"
                    shadowOpacity="1"
                    draggable={draggable}
                    onDragStart={this.onDragStart.bind(this)}
                    onDragEnd={this.onDragEnd.bind(this)}
                    onDragMove={this.onDragMove.bind(this)}
                    ref="circle"
                    />
        );
    }
}

export default Marble;
export { MarbleSprite };
