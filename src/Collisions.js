
import React, { Component } from 'react';

import { Stage, Layer, Group, Circle } from 'react-konva';
// marbles sprite from https://dribbble.com/shots/2186007-Monster-Marbles
import MarbleSprite from './monster-marbles-sprite-sheets.jpg';
import { range } from 'd3-array';
import { timer } from 'd3-timer';

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

        this.props.onDragEnd({
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

class Collisions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sprite: null,
            marbles: this.initialPositions
        }
    }

    get initialPositions() {
        const { width, height } = this.props,
              center = width/2;

        let marbles = range(3, 0, -1).map(y => {
            if (y === 3) return [{ x: center, y: 200,
                                   vx: 0, vy: 0}];

            const left = center - y*(MarbleR+5),
                  right = center + y*(MarbleR+5);

            return range(left, right, MarbleR*2+5).map(x => ({
                x: x,
                y: 200-y*(MarbleR*2+5),
                vx: 0,
                vy: 0
            }));
        }).reduce((acc, pos) => acc.concat(pos), []);

        marbles = marbles.concat({
            x: width/2,
            y: height-150,
            vx: 0,
            vy: 0
        });

        return marbles;
    }

    componentDidMount() {
        const sprite = new Image();
        sprite.src = MarbleSprite;

        sprite.onload = () => {
            this.setState({
                sprite: sprite
            });

            this.timer = timer(() => this.gameLoop());
        };
    }

    shoot(newPos, i) {
        let marbles = this.state.marbles;

        marbles[i] = newPos;

        this.setState({
            marbles: marbles
        });
    }

    gameLoop() {
        const { width, height } = this.props;

        const moveMarble = ({x, y, vx, vy}) => ({
            x: x+vx,
            y: y+vy,
            vx: ((x+vx < MarbleR) ? -vx : (x+vx > width-MarbleR) ? -vx : vx)*.99,
            vy: ((y+vy < MarbleR) ? -vy : (y+vy > height-MarbleR) ? -vy : vy)*.99
        });

        this.setState({
            marbles: this.state.marbles.map(moveMarble)
        });
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
                        {this.state.marbles.map(({x: x, y: y}, i) => (
                            <Marble x={x}
                                    y={y}
                                    type={marbleTypes[i%marbleTypes.length]}
                                    sprite={sprite}
                                    draggable="true"
                                    onDragEnd={(newPos) => this.shoot(newPos, i)}
                                    key={`${marbleTypes[i%marbleTypes.length]}-${i}`} />
                        ))}
                    </Group>
                </Layer>
            </Stage>
        )
    }
}

export default Collisions;
