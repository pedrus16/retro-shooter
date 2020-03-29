import { Vector3, Quaternion } from 'babylonjs';

import { Entity } from '../entity.class';
import { INPUT_MAP } from '../game.class';
import { InputComponent } from '../input-component.interface';
import { CharacterPhysicsComponent } from './character-physics.component';

const JUMP_VELOCITY = 5;

export class CharacterInputComponent implements InputComponent {

    private spaceReleased = true;

    constructor(private characterPhysics: CharacterPhysicsComponent) {}

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
        if (INPUT_MAP.Space) {
            if (this.spaceReleased && this.characterPhysics.touchingGround) {
                this.spaceReleased = false;
                host.velocity.y = JUMP_VELOCITY;
            }
        } else {
            this.spaceReleased = true;
        }

        const directionFromRotation = Vector3.Zero();
        // TODO Fix me when looking at the ground the direction is messed up
        const verticalAxisRotation = new Quaternion(0, host.rotationQuaternion.y, 0, host.rotationQuaternion.w);
        direction.rotateByQuaternionToRef(verticalAxisRotation, directionFromRotation);

        if (this.characterPhysics.touchingGround) {
            const directionalSpeed = directionFromRotation.normalize().scale(10).add(new Vector3(0, host.velocity.y, 0));
            host.velocity = directionalSpeed;
        } else {
            // host.velocity = host.velocity.multiply(directionFromRotation.multiplyByFloats(0.5, 1, 0.5));
        }
        
        // new Vector3(
        //     directionalSpeed.x - host.velocity.x <= 0 ? host.velocity.x : directionalSpeed.x,
        //     directionalSpeed.y - host.velocity.y <= 0 ? host.velocity.y : directionalSpeed.y,
        //     directionalSpeed.z - host.velocity.z <= 0 ? host.velocity.z : directionalSpeed.z
        // );
    }

}
