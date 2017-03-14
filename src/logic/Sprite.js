
import { observable, action } from 'mobx';

// marbles sprite from https://dribbble.com/shots/2186007-Monster-Marbles
import MarbleSprite from '../monster-marbles-sprite-sheets.jpg';

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
}

export default new Sprite();
