import { Mesh, MeshBuilder, Scene, SceneLoader, StandardMaterial, Texture } from 'babylonjs';

import mapFile from '../assets/maps/test.gltf';
import { GraphicsComponent } from './graphics-component.interface';

export class MapGraphicsComponent implements GraphicsComponent {

    constructor(scene: Scene) {
        SceneLoader.Append('./', mapFile, scene, (loadedScene) => {
            loadedScene.meshes.forEach((mesh) => mesh.checkCollisions = true);
            console.log('map loaded');
        });
    }

    public update() {}

}
