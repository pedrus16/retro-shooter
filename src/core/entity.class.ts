import { Quaternion, Scene, Vector3 } from 'babylonjs';

import { GraphicsComponent } from './graphics-component.interface';
import { InputComponent } from './input-component.interface';
import { PhysicsComponent } from './physics-component.interface';

export class Entity {

    public position = new Vector3();
    public velocity = Vector3.Zero();
    public rotation = new Quaternion();

    constructor(
        private inputComponent: InputComponent,
        private graphicsComponent: GraphicsComponent,
        private physicsComponent: PhysicsComponent
    ) {}

    public update(scene: Scene) {
        this.inputComponent.update(this, scene);
        this.physicsComponent.update(this, scene);
        this.graphicsComponent.update(this, scene);
    }

}
