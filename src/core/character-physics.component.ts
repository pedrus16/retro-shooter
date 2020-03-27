import { Engine, Scene, MeshBuilder, Mesh, Vector3 } from 'babylonjs';

import { Entity } from './entity.class';
import { PhysicsComponent } from './physics-component.interface';

export class CharacterPhysicsComponent implements PhysicsComponent {
    
    private cubeMesh: Mesh;
    private weight = 1;

    constructor(private engine: Engine, private scene: Scene) {
        this.cubeMesh = MeshBuilder.CreateBox('physicCube', { height: 1.8, width: 0.5, depth: 0.5 }, scene);
        this.cubeMesh.checkCollisions = true;
        // this.cubeMesh.visibility = 0;
    }

    public update(host: Entity, scene: Scene) {
        const deltaTimeSec = this.engine.getDeltaTime() / 1000;
        this.cubeMesh.position = host.position;

        const gravity = this.scene.gravity.multiplyByFloats(this.weight, this.weight, this.weight);
        host.velocity = host.velocity.add(gravity);

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
        console.log("PHYSIC", host.position);
    }

}
