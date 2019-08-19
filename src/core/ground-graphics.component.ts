import { Mesh, MeshBuilder, Scene, StandardMaterial, Texture } from 'babylonjs';

import groundImage from '../assets/images/ground.jpg';
import { Entity } from './entity.class';
import { GraphicsComponent } from './graphics.component';

export class GroundGraphicsComponent implements GraphicsComponent {

    private groundMesh: Mesh;

    constructor(scene: Scene) {
        this.groundMesh = MeshBuilder.CreateGround('ground', { width: 100, height: 100 }, scene);

        const groundMaterial = new StandardMaterial('ground', scene);
        const groundTexture = new Texture(groundImage, scene, undefined, undefined, 4);
        groundTexture.uScale = 128;
        groundTexture.vScale = 128;
        groundMaterial.diffuseTexture = groundTexture;
        groundMaterial.specularTexture = groundTexture;

        this.groundMesh.material = groundMaterial;
    }

    public update(host: Entity) {
        this.groundMesh.position = host.position;
        this.groundMesh.rotationQuaternion = host.rotation;
    }

}
