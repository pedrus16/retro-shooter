import { Engine, Scene, MeshBuilder, Mesh, Vector3 } from 'babylonjs';

import { Entity } from './entity.class';
import { PhysicsComponent } from './physics-component.interface';

export class CharacterPhysicsComponent implements PhysicsComponent {
    
    private cubeMesh: Mesh;

    constructor(private engine: Engine, private scene: Scene) {
        this.cubeMesh = MeshBuilder.CreateBox('physicCube', { height: 1.8, width: 0.5, depth: 0.5 }, scene);
        this.cubeMesh.visibility = 0;
        this.cubeMesh.checkCollisions = true;
        this.cubeMesh.collisionGroup = 0b11;
    }

    public update(host: Entity, scene: Scene) {
        const deltaTimeSec = this.engine.getDeltaTime() / 1000;
        this.cubeMesh.position = host.position;

        host.velocity = host.velocity.add(this.scene.gravity);

        const displacement = new Vector3(
            host.velocity.x * deltaTimeSec,
            host.velocity.y * deltaTimeSec,
            host.velocity.z * deltaTimeSec
        );

        const prevPos = this.cubeMesh.position.clone();
        this.cubeMesh.moveWithCollisions(displacement);
        const velocity = this.cubeMesh.position.subtract(prevPos);

        host.velocity = velocity.divide(new Vector3(deltaTimeSec, deltaTimeSec, deltaTimeSec));
        host.position = this.cubeMesh.position;
    }

}
