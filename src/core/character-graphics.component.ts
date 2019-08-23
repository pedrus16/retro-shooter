import { Mesh, MeshBuilder, Scene } from 'babylonjs';

import { Entity } from './entity.class';
import { GraphicsComponent } from './graphics-component.interface';

export class CharacterGraphicsComponent implements GraphicsComponent {

    private cubeMesh: Mesh;

    constructor(scene: Scene) {
        this.cubeMesh = MeshBuilder.CreateBox('cube', { height: 1.8, width: 0.5, depth: 0.5 }, scene);
    }

    public update(host: Entity) {
        this.cubeMesh.position = host.position;
        this.cubeMesh.rotationQuaternion = host.rotation;
    }

}
