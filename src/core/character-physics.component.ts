import { Engine, Scene } from 'babylonjs';

import { Entity } from './entity.class';
import { PhysicsComponent } from './physics-component.interface';

export class CharacterPhysicsComponent implements PhysicsComponent {

    constructor(private engine: Engine) {}

    public update(host: Entity, scene: Scene) {
        const deltaTime = this.engine.getDeltaTime();

        const newPosition = host.position.addInPlaceFromFloats(
            host.velocity.x * deltaTime / 1000,
            host.velocity.y * deltaTime / 1000,
            host.velocity.z * deltaTime / 1000
        );

        host.position = newPosition;
    }

}
