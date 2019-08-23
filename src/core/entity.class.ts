import { Quaternion, Scene, Vector3 } from 'babylonjs';

import { GraphicsComponent } from './graphics-component.interface';
import { InputComponent } from './input-component.interface';

export class Entity {

    public position = new Vector3();
    public rotation = new Quaternion();

    constructor(
        private graphicsComponent: GraphicsComponent,
        private inputComponent: InputComponent
    ) {}

    public update(scene: Scene) {
        this.graphicsComponent.update(this, scene);
        this.inputComponent.update(this);
    }

    public moveTo(position: Vector3) {
        this.position = position;
    }

}
