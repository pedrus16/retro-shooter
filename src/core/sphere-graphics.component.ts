import { Mesh, MeshBuilder, Scene } from 'babylonjs';

import { Entity } from './entity.class';
import { GraphicsComponent } from './graphics.component';

export class SphereGraphicsComponent implements GraphicsComponent {

    private sphereMesh: Mesh;

    constructor(scene: Scene) {
        this.sphereMesh = MeshBuilder.CreateSphere('sphere', { diameter: 1 }, scene);
    }

    public update(host: Entity) {
        this.sphereMesh.position = host.position;
        this.sphereMesh.rotationQuaternion = host.rotation;
    }

}
