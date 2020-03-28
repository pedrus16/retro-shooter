import { Mesh, MeshBuilder, Scene, Camera, Vector3, UniversalCamera, Nullable, Engine } from 'babylonjs';

import { Entity } from '../entity.class';
import { GraphicsComponent } from '../graphics-component.interface';
import { TICK_PER_SECOND } from './character-physics.component';

export class CharacterGraphicsComponent implements GraphicsComponent {

    private cubeMesh: Mesh;
    // private prevHostPosition = Vector3.Zero();
    // private elapsedTimeSec = 0;

    constructor(private engine: Engine, scene: Scene) {
        this.cubeMesh = MeshBuilder.CreateBox('playerCube', { height: 1.8, width: 0.5, depth: 0.5 }, scene);
        this.cubeMesh.collisionGroup = 0b0;
    }

    public update(host: Entity) {
        // if (host.position.subtract(this.prevHostPosition).length() || this.elapsedTimeSec >= (1 / TICK_PER_SECOND)) {
        //     this.prevHostPosition = host.position.clone();
        //     this.cubeMesh.position = host.position;
        // } else {
        //     const elapsedTimeSec = this.engine.getDeltaTime() / 1000;
        //     this.cubeMesh.position = this.cubeMesh.position.add(host.velocity.multiplyByFloats(elapsedTimeSec, elapsedTimeSec, elapsedTimeSec));
        // }

        // TODO Interpolate between position changes because the physic component tick rate is not tied to the framerate.
        this.cubeMesh.position = host.position;

        this.cubeMesh.rotationQuaternion = host.rotationQuaternion;
    }

}
