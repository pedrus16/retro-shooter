import { Quaternion, Scene, Vector3 } from 'babylonjs';

import { GraphicsComponent } from './graphics-component.interface';
import { InputComponent } from './input-component.interface';
import { PhysicsComponent } from './physics-component.interface';
import { CameraComponent } from './camera-component.interface';

export class Entity {

    public position = new Vector3();
    public velocity = Vector3.Zero();
    public rotationQuaternion = Quaternion.Zero();

    constructor(
        private inputComponent: InputComponent,
        private graphicsComponent: GraphicsComponent,
        private physicsComponent: PhysicsComponent,
        private cameraComponent?: CameraComponent
    ) {}

    public update(scene: Scene) {
        this.inputComponent.update(this);
        this.physicsComponent.update(this, scene);
        if (this.cameraComponent) {
            this.cameraComponent.update(this);
        }
        this.graphicsComponent.update(this, scene);
    }

}
