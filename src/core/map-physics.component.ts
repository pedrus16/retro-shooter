import { Engine, Scene, MeshBuilder, Mesh, Vector3, SceneLoader } from 'babylonjs';

import { PhysicsComponent } from './physics-component.interface';
import mapFile from '../assets/maps/test.gltf';

export class MapPhysicsComponent implements PhysicsComponent {
    
    constructor(private engine: Engine, scene: Scene) {
        SceneLoader.Append('./', mapFile, scene, (loadedScene) => {
            loadedScene.meshes.forEach((mesh) => mesh.checkCollisions = true);
            console.log('map loaded');
        });
    }

    public update() {}

}
