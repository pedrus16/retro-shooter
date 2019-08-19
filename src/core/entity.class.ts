import { Quaternion, Scene, Vector3 } from 'babylonjs';

import { GraphicsComponent } from './graphics.component';

export class Entity {

    public position = new Vector3();
    public rotation = new Quaternion();

    constructor(private graphicsComponent: GraphicsComponent) {}

    public update(scene: Scene) {
        this.graphicsComponent.update(this, scene);
    }

}
