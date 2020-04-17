import { Engine, Scene, MeshBuilder, Mesh, Vector3, Ray, Quaternion, Matrix } from 'babylonjs';

import { Entity } from '../entity.class';
import { PhysicsComponent } from '../physics-component.interface';

export const TICK_PER_SECOND = 60;

export class ProjectilePhysicsComponent implements PhysicsComponent {

    private elapsedTimeSec = 0;

    constructor(private engine: Engine, private scene: Scene) {
    }

    public update(host: Entity, scene: Scene) {
        this.elapsedTimeSec += this.engine.getDeltaTime() / 1000;
        const tickDurationSec = 1 / TICK_PER_SECOND;

        if (this.elapsedTimeSec < tickDurationSec) {
            return;
        }

        while (this.elapsedTimeSec >= tickDurationSec) {
            const deltaTimeSec = tickDurationSec;

            // LOGIC GOES HERE
            host.position = host.position.add(host.velocity.scale(deltaTimeSec))
            // host.position = host.position.add(host.velocity.scale(0))
            const gravity = this.scene.gravity.scale(deltaTimeSec);
            host.velocity = host.velocity.add(gravity);
            host.rotationQuaternion = this.lookRotation(host.velocity);

            this.elapsedTimeSec -= tickDurationSec;
        }

    }

    private lookRotation(pos: Vector3, up = new Vector3(0, 1, 0)): Quaternion {
        var result = Matrix.Zero();
        Matrix.LookAtLHToRef(Vector3.Zero(), pos, new Vector3(0, 1, 0), result);
        result.invert();
        return Quaternion.FromRotationMatrix(result);
    }

}
