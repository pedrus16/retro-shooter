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
        // this.cubeMesh.ellipsoid = new Vector3(0.5, 4.0, 0.5);
        // this.cubeMesh.ellipsoidOffset = new Vector3(0, 0, 0);
    }

    public update(host: Entity, scene: Scene) {
        const deltaTimeSec = this.engine.getDeltaTime() / 1000;
        this.cubeMesh.position = host.position;

        const gravity = this.scene.gravity.multiplyByFloats(this.weight, this.weight, this.weight);
        host.velocity.y += gravity.y * this.weight;

        // host.velocity = host.velocity.add(gravity);

        const displacement = new Vector3(
            host.velocity.x * deltaTimeSec,
            host.velocity.y * deltaTimeSec,
            host.velocity.z * deltaTimeSec
        );

        const posY = this.cubeMesh.position.y;
        this.cubeMesh.moveWithCollisions(displacement);
        const velocityY = (this.cubeMesh.position.y - posY);

        // console.log("velY", velocityY);
        host.velocity.y = velocityY / deltaTimeSec;
        host.position = this.cubeMesh.position;

        // host.velocity = host.position.subtract(prevPos); //.multiplyByFloats(1 / deltaTimeSec, 1 / deltaTimeSec, 1 / deltaTimeSec);

        // console.log(host.velocity.y);
    }

}
