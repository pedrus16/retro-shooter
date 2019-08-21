import { Mesh, MeshBuilder, Scene, SceneLoader, StandardMaterial, Texture } from 'babylonjs';

import groundImage from '../assets/images/ground.jpg';
import mapFile from '../assets/maps/test.gltf';
import { Entity } from './entity.class';
import { GraphicsComponent } from './graphics.component';

export class GroundGraphicsComponent implements GraphicsComponent {

    constructor(scene: Scene) {
        SceneLoader.Append('./', mapFile, scene, (loadedScene) => {
            loadedScene.meshes.forEach((mesh) => mesh.checkCollisions = true);
            console.log('map loaded');
        });
    }

    public update(host: Entity) {}

}
