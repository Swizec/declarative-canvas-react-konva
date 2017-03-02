
import { observable, computed, action } from 'mobx';
import { range } from 'd3-array';
import { timer } from 'd3-timer';

const MarbleDefinitions = {
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

class Physics {
    @observable MarbleR = 25;
    @observable width = 800;
    @observable height = 600;
    @observable _marbles = [];
    timer = null;

    @computed get initialPositions() {
        const { width, height, MarbleR } = this,
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

    @computed get marbleTypes() {
        return Object.keys(MarbleDefinitions);
    }

    @computed get marbles() {
        if (!this._marbles.length) {
            this._marbles = this.initialPositions;
        }

        return this._marbles;
    }

    @action setDimension(width, height) {
        this.width = width;
        this.height = height;
    }

    @action startGameLoop() {
        this.timer = timer(() => this.simulationStep());
    }

    @action simulationStep() {
        const { width, height, MarbleR } = this;

        const moveMarble = ({x, y, vx, vy}) => ({
            x: x+vx,
            y: y+vy,
            vx: ((x+vx < MarbleR) ? -vx : (x+vx > width-MarbleR) ? -vx : vx)*.99,
            vy: ((y+vy < MarbleR) ? -vy : (y+vy > height-MarbleR) ? -vy : vy)*.99
        });

        this._marbles.forEach((marble, i) => {
            const { x, y, vx, vy } = moveMarble(marble);

            this._marbles[i].x = x;
            this._marbles[i].y = y;
            this._marbles[i].vx = vx;
            this._marbles[i].vy = vy;
        });
    }

    @action shoot({ x, y, vx, vy }, i) {
        this._marbles[i].x = x;
        this._marbles[i].y = y;
        this._marbles[i].vx = vx;
        this._marbles[i].vy = vy
    }
}

export default new Physics();
export { MarbleDefinitions };
