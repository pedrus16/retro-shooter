import { Engine, Scene, UniversalCamera, Vector3, Quaternion, FreeCamera } from 'babylonjs';

import { Entity } from './entity.class';
import { CameraComponent } from './camera-component.interface';

export class CharacterCameraComponent implements CameraComponent {
    
    private camera: FreeCamera;

    constructor(scene: Scene) {
        const canvas = document.getElementById('renderCanvas') as HTMLElement;
        this.camera = new FreeCamera("playerCamera", new Vector3(0, 0, 0), scene);
        this.camera.inertia = 0;
        this.camera.rotationQuaternion = Quaternion.Zero();
        this.camera.attachControl(canvas, true);
        this.camera.minZ = 0;
        this.camera.angularSensibility = 1000;
    }

    public update(host: Entity) {
        this.camera.position = host.position.add(new Vector3(0, 0.9, 0));
        const verticalAxisRotation = new Quaternion(0, this.camera.rotationQuaternion.y, 0, this.camera.rotationQuaternion.w);
        host.rotationQuaternion = verticalAxisRotation;
    }

}
