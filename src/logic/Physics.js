
import { observable, computed, action } from 'mobx';
import { range } from 'd3-array';
import { timer } from 'd3-timer';
import { quadtree } from 'd3-quadtree';

class Physics {
    @observable MarbleR = 25;
    @observable width = 800;
    @observable height = 600;
    @observable marbles = [];
    timer = null;

    @computed get initialPositions() {
        const { width, height, MarbleR } = this,
              center = width/2;

        const lines = 4,
              maxY = 200;

        let marbles = range(lines, 0, -1).map(y => {
            if (y === lines) return [{ x: center, y: maxY,
                                       vx: 0, vy: 0, r: this.MarbleR}];

            const left = center - y*(MarbleR+5),
                  right = center + y*(MarbleR+5);

            return range(left, right, MarbleR*2+5).map(x => ({
                x: x,
                y: maxY-y*(MarbleR*2+5),
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

    @action startGameLoop() {
        this.marbles = this.initialPositions;

        this.timer = timer(() => this.simulationStep());
    }

    @action simulationStep() {
        const { width, height, MarbleR } = this;

        const moveMarble = ({x, y, vx, vy, id}) => {
            let _vx = ((x < MarbleR) ? -vx : (x > width-MarbleR) ? -vx : vx)*.99,
                _vy = ((y < MarbleR) ? -vy : (y > height-MarbleR) ? -vy : vy)*.99;

            x = (x < MarbleR) ? MarbleR : (x > width-MarbleR) ? width-MarbleR : x;
            y = (y < MarbleR) ? MarbleR : (y > height-MarbleR) ? height-MarbleR : y;

            // nearest marble is a collision candidate
            const subdividedSpace = quadtree().extent([[-1, -1],
                                                       [this.width+1, this.height+1]])
                                              .x(d => d.x)
                                              .y(d => d.y)
                                              .addAll(this.marbles
                                                          .filter(m => id !== m.id)),
                  candidate = subdividedSpace.find(x, y, MarbleR*2);

            if (candidate) {

                // borrowing @air_hadoken's implementation from here:
                // https://github.com/airhadoken/game_of_circles/blob/master/circles.js#L64
                const cx = candidate.x,
                      cy = candidate.y,
                      cvx = candidate.vx,
                      cvy = candidate.vy,
                      dx = cx - x,
                      dy = cy - y,
                      d = Math.sqrt(dx ** 2 + dy ** 2),
                      dirx = dx/d,
                      diry = dy/d,
                      // Shift marbles so no overlap
                      dr = 2*MarbleR-d,
                      drx = dr*dirx,
                      dry = dr*diry,
                      dv = (_vx-cvx)*dirx + (_vy-cvy)*diry,
                      dvx = dv*dirx,
                      dvy = dv*diry;

                _vx += -dvx;
                _vy += -dvy;

                candidate.vx += dvx;
                candidate.vy += dvy;
                candidate.x += drx+candidate.vx;
                candidate.y += dry+candidate.vy;
            }

            return {
                x: x + _vx,
                y: y + _vy,
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
        const maxSpeed = 20;

        this.marbles[i].x = x;
        this.marbles[i].y = y;
        this.marbles[i].vx = vx < maxSpeed ? vx : maxSpeed;
        this.marbles[i].vy = vy < maxSpeed ? vy : maxSpeed;
    }
}

export default new Physics();
