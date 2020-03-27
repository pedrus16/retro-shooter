import { Mesh, MeshBuilder, Scene } from 'babylonjs';

import { Entity } from './entity.class';
import { GraphicsComponent } from './graphics-component.interface';

export class CharacterGraphicsComponent implements GraphicsComponent {

    // private cubeMesh: Mesh;

    constructor(scene: Scene) {
        // this.cubeMesh = MeshBuilder.CreateBox('playerCube', { height: 1.8, width: 0.5, depth: 0.5 }, scene);
        // this.cubeMesh.checkCollisions = false;
    }

    public update(host: Entity) {
        console.log("GRAPHIC", host.position);
        // this.cubeMesh.position = host.position;
        // this.cubeMesh.rotationQuaternion = host.rotation;
    }

}
