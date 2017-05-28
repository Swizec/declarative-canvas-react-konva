
import { observable, action, computed } from 'mobx';

// marbles sprite from https://dribbble.com/shots/2186007-Monster-Marbles
import MarbleSprite from '../monster-marbles-sprite-sheets.jpg';

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


class Sprite {
    @observable sprite = null;

    @action loadSprite(callback = () => null) {
        const sprite = new Image();
        sprite.src = MarbleSprite;

        sprite.onload = () => {
            this.sprite = sprite;

            callback();
        };
    }

    @computed get marbleTypes() {
        return Object.keys(MarbleDefinitions);
    }

    @computed get marbleDefinitions() {
        return MarbleDefinitions;
    }
}

export default new Sprite();
export { MarbleDefinitions };
