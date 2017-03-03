
import { observable, computed, action } from 'mobx';
import { range } from 'd3-array';
import { timer } from 'd3-timer';
import { scaleQuantize } from 'd3-scale';
import { quadtree } from 'd3-quadtree';

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
    @observable marbles = [];
    timer = null;
    xScale = scaleQuantize().domain([0, this.width])
                            .range(range(0, this.width, this.MarbleR*2));
    yScale = scaleQuantize().domain([0, this.height])
                            .range(range(0, this.height, this.MarbleR*2));

    @computed get initialPositions() {
        const { width, height, MarbleR } = this,
              center = width/2;

        let marbles = range(3, 0, -1).map(y => {
            if (y === 3) return [{ x: center, y: 200,
                                   vx: 0, vy: 0, r: this.MarbleR}];

            const left = center - y*(MarbleR+5),
                  right = center + y*(MarbleR+5);

            return range(left, right, MarbleR*2+5).map(x => ({
                x: x,
                y: 200-y*(MarbleR*2+5),
                vx: 0,
                vy: 0,
                r: this.MarbleR
            }));
        }).reduce((acc, pos) => acc.concat(pos), []);

        marbles = [].concat(marbles, {
            x: width/2,
            y: height-150,
            vx: 0,
            vy: 0,
            r: this.MarbleR
        });

        marbles.forEach((m, i) => marbles[i].id = i);

        return marbles;
    }

    @computed get marbleTypes() {
        return Object.keys(MarbleDefinitions);
    }

    @action startGameLoop() {
        this.marbles = this.initialPositions;

        this.timer = timer(() => this.simulationStep());
    }

    @action simulationStep() {
        const { width, height, MarbleR } = this;

        const moveMarble = ({x, y, vx, vy, id}) => {
            let _vx = ((x+vx < MarbleR) ? -vx : (x+vx > width-MarbleR) ? -vx : vx)*.99,
                _vy = ((y+vy < MarbleR) ? -vy : (y+vy > height-MarbleR) ? -vy : vy)*.99;

            // nearest marble is a collision candidate
            const subdividedSpace = quadtree().extent([[-1, -1],
                                                       [this.width+1, this.height+1]])
                                              .x(d => d.x)
                                              .y(d => d.y)
                                              .addAll(this.marbles
                                                          .filter((m, i) => id !== i)),
                  candidate = subdividedSpace.find(x, y, MarbleR*2);

            if (candidate) {
               // borrowing @air_hadoken's implementation from here:
               // https://github.com/airhadoken/game_of_circles/blob/master/circles.js#L64
                const cx = candidate.x,
                      cy = candidate.y,
                      nx = cx - x,
                      ny = cy - y,
                      c = (_vx * nx + _vy * ny) / (nx ** 2 + ny ** 2) * 2;

                _vx = (_vx - c * nx)/2;
                _vy = (_vy - c * ny)/2;

                candidate.vx += -_vx;
                candidate.vy += -_vy;
            }

            return {
                x: x+_vx,
                y: y+_vy,
                vx: _vx,
                vy: _vy
            }
        };

        this.marbles.forEach((marble, i) => {
            const { x, y, vx, vy } = moveMarble(marble);

            this.marbles[i].x = x;
            this.marbles[i].y = y;
            this.marbles[i].vx = vx;
            this.marbles[i].vy = vy;
        });
    }

    @action shoot({ x, y, vx, vy }, i) {
        this.marbles[i].x = x;
        this.marbles[i].y = y;
        this.marbles[i].vx = vx;
        this.marbles[i].vy = vy
    }

    @action _ticked() {
        console.log(this.marbles[0].x, this.marbles[0].y);
    }
}

export default new Physics();
export { MarbleDefinitions };
