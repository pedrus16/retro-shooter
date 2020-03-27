import { Mesh, MeshBuilder, Scene, Camera, Vector3, UniversalCamera } from 'babylonjs';

import { Entity } from './entity.class';
import { GraphicsComponent } from './graphics-component.interface';

export class CharacterGraphicsComponent implements GraphicsComponent {

    private cubeMesh: Mesh;

    constructor(scene: Scene) {
        this.cubeMesh = MeshBuilder.CreateBox('playerCube', { height: 1.8, width: 0.5, depth: 0.5 }, scene);
        this.cubeMesh.collisionGroup = 0b00;
    }

    public update(host: Entity) {
        this.cubeMesh.position = host.position;
        this.cubeMesh.rotationQuaternion = host.rotationQuaternion;
    }

}
