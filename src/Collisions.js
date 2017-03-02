
import React, { Component } from 'react';

import { Stage, Layer, Group } from 'react-konva';
import { range } from 'd3-array';
import { timer } from 'd3-timer';

import Marble, { Marbles as MarbleDefinitions, MarbleSprite } from './Marble';

const MarbleR = 25;

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
              marbleTypes = Object.keys(MarbleDefinitions);

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
                                    onShoot={(newPos) => this.shoot(newPos, i)}
                                    key={`marble-${i}`} />
                        ))}
                    </Group>
                </Layer>
            </Stage>
        )
    }
}

export default Collisions;
