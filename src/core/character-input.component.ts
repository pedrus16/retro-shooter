import { Vector3 } from 'babylonjs';

import { Entity } from './entity.class';
import { INPUT_MAP } from './game.class';
import { InputComponent } from './input-component.interface';

export class CharacterInputComponent implements InputComponent {

    private spaceReleased = true;

    public update(host: Entity) {
        const direction = Vector3.Zero();

        if (INPUT_MAP.KeyW) {
            direction.x += 1;
        }
        if (INPUT_MAP.KeyS) {
            direction.x -= 1;
        }
        if (INPUT_MAP.KeyA) {
            direction.z += 1;
        }
        if (INPUT_MAP.KeyD) {
            direction.z -= 1;
        }

        host.velocity = direction.normalize().scale(20).add(new Vector3(0, host.velocity.y, 0));

        if (INPUT_MAP.Space) {
            if (this.spaceReleased) {
                this.spaceReleased = false;
                host.velocity.y = 100;
            }
        } else {
            this.spaceReleased = true;
        }
    }

}
