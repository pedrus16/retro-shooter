import { Vector3, Quaternion, Scene, Engine, FreeCamera } from 'babylonjs';

import { Entity } from '../entity.class';
import { INPUT_MAP, Game } from '../game.class';
import { InputComponent } from '../input-component.interface';
import { CharacterPhysicsComponent } from './character-physics.component';
import { ImpostorGraphicsComponent } from '../impostor/impostor-graphics.component';
import { ProjectilePhysicsComponent } from '../projectile/projectile-physics.component';

import boltSprite from "../../assets/images/bolt.png";

const JUMP_VELOCITY = 5;
const MOVE_SPEED = 6;

export class CharacterInputComponent implements InputComponent {

    private spaceReleased = true;
    private mousePressed = false;

    constructor(private characterPhysics: CharacterPhysicsComponent, private scene: Scene, private engine: Engine) {
        window.addEventListener("click", () => {
            this.mousePressed = true;
        });
    }

    public update(host: Entity) {
        const direction = Vector3.Zero();

        if (INPUT_MAP.KeyW) {
            direction.z -= 1;
        }
        if (INPUT_MAP.KeyS) {
            direction.z += 1;
        }
        if (INPUT_MAP.KeyD) {
            direction.x -= 1;
        }
        if (INPUT_MAP.KeyA) {
            direction.x += 1;
        }
        if (INPUT_MAP.Space) {
            if (this.spaceReleased && this.characterPhysics.touchingGround) {
                this.spaceReleased = false;
                host.velocity.y = JUMP_VELOCITY;
            }
        } else {
            this.spaceReleased = true;
        }

        if (this.mousePressed) {
            this.mousePressed = false;
            const camera = this.scene.activeCamera as FreeCamera;
            const boltSpeed = 60;
            const forward = camera.getForwardRay(1).direction;
            const bolt = this.createProjectile(host.position.add(new Vector3(0, 1, 0).add(forward.scale(3))), forward.scale(boltSpeed));
            Game.addEntity(bolt);
        }

        // const directionFromRotation = Vector3.Zero();

        // TODO Fix me when looking at the ground the direction is messed up
        // const verticalAxisRotation = new Quaternion(0, host.rotationQuaternion.y, 0, host.rotationQuaternion.w);
        // direction.rotateByQuaternionToRef(verticalAxisRotation, directionFromRotation);
        const displacement = this.characterPhysics.calcMovePOV(direction.x, 0, direction.z);

        if (this.characterPhysics.touchingGround) {
            const directionalSpeed = displacement.normalize().scale(MOVE_SPEED).add(new Vector3(0, host.velocity.y, 0));
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

    private createProjectile(origin: Vector3, initialVelocity: Vector3): Entity {
        const ent = new Entity(
            { update: () => null },
            new ImpostorGraphicsComponent(this.scene, boltSprite, { segments: 8, rings: 4, frameWidth: 64, frameHeight: 64 }),
            new ProjectilePhysicsComponent(this.engine, this.scene)
        );

        ent.position = origin;
        ent.velocity = initialVelocity;

        return ent;
    }

}
