import { Vector3, Quaternion } from 'babylonjs';

import { Entity } from './entity.class';
import { INPUT_MAP } from './game.class';
import { InputComponent } from './input-component.interface';

const JUMP_VELOCITY = 5;

export class CharacterInputComponent implements InputComponent {

    private spaceReleased = true;

    public update(host: Entity) {
        const direction = Vector3.Zero();

        if (INPUT_MAP.KeyW) {
            direction.z += 1;
        }
        if (INPUT_MAP.KeyS) {
            direction.z -= 1;
        }
        if (INPUT_MAP.KeyD) {
            direction.x += 1;
        }
        if (INPUT_MAP.KeyA) {
            direction.x -= 1;
        }

        const directionFromRotation = Vector3.Zero();
        const verticalAxisRotation = new Quaternion(0, host.rotationQuaternion.y, 0, host.rotationQuaternion.w);
        direction.rotateByQuaternionToRef(verticalAxisRotation, directionFromRotation);
        host.velocity = directionFromRotation.normalize().scale(10).add(new Vector3(0, host.velocity.y, 0));

        if (INPUT_MAP.Space) {
            if (this.spaceReleased) {
                this.spaceReleased = false;
                host.velocity.y = JUMP_VELOCITY;
            }
        } else {
            this.spaceReleased = true;
        }
    }

}
