import { Engine, Scene, MeshBuilder, Mesh, Vector3, Ray, Quaternion } from 'babylonjs';

import { Entity } from '../entity.class';
import { PhysicsComponent } from '../physics-component.interface';

export const TICK_PER_SECOND = 60;

export class CharacterPhysicsComponent implements PhysicsComponent {
    
    private cubeMesh: Mesh;
    // private feetMesh: Mesh;

    private elapsedTimeSec = 0;
    private groundHit = false;

    constructor(private engine: Engine, private scene: Scene) {
        this.cubeMesh = MeshBuilder.CreateBox('playerCollision', { height: 1.8, width: 0.5, depth: 0.5 }, scene);
        this.cubeMesh.ellipsoid = new Vector3(0.25, 0.9, 0.25);
        this.cubeMesh.visibility = 0;
        this.cubeMesh.checkCollisions = true;
        this.cubeMesh.collisionGroup = 0b1;

        // this.feetMesh = MeshBuilder.CreateCylinder('feetCollision', { height: 0.1, diameter: 0.5 });
        // this.feetMesh.parent = this.cubeMesh;
        // this.feetMesh.position = new Vector3(0, -0.9, 0);
        // this.feetMesh.collisionGroup = 0b00;
    }

    public update(host: Entity, scene: Scene) {
        this.elapsedTimeSec += this.engine.getDeltaTime() / 1000;
        const tickDurationSec = 1 / TICK_PER_SECOND;

        if (this.elapsedTimeSec < tickDurationSec) {
            return;
        }

        while (this.elapsedTimeSec >= tickDurationSec) {
            const deltaTimeSec = tickDurationSec;
            this.cubeMesh.position = host.position;
            this.cubeMesh.rotationQuaternion = Quaternion.FromEulerAngles(0, host.rotationQuaternion.toEulerAngles().y, 0);
    
            const gravity = this.scene.gravity.scale(deltaTimeSec);
            host.velocity = host.velocity.add(gravity);

            const ray = new Ray(this.cubeMesh.position.add(new Vector3(0, -0.9, 0)), new Vector3(0, -1, 0), 1);

            const pickInfo = scene.pickWithRay(ray, (mesh) => {
                return mesh != this.cubeMesh && (mesh.collisionGroup & this.cubeMesh.collisionGroup) > 0;
            });

            this.groundHit = !!pickInfo && pickInfo.hit && pickInfo.distance < 0.05;

            if (this.groundHit) {
                host.velocity.y = host.velocity.y > 0 ? host.velocity.y : 0;
            }
    
            const displacement = new Vector3(
                host.velocity.x * deltaTimeSec,
                host.velocity.y * deltaTimeSec,
                host.velocity.z * deltaTimeSec
            );

            const prevPos = this.cubeMesh.position.clone();
            this.cubeMesh.moveWithCollisions(displacement);
            const actualDisplacement = this.cubeMesh.position.subtract(prevPos);

            host.velocity = actualDisplacement.divide(new Vector3(deltaTimeSec, deltaTimeSec, deltaTimeSec));
            host.position = this.cubeMesh.position;
    
            this.elapsedTimeSec -= tickDurationSec;
        }

    }

    public get touchingGround() {
        return this.groundHit;
    }

    public calcMovePOV(right: number, up: number, forward: number): Vector3 {
        return this.cubeMesh.calcMovePOV(right, up, forward);
    }

}
