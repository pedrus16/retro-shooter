import { Scene } from 'babylonjs';

import { Entity } from './entity.class';

export interface PhysicsComponent {

    update(host: Entity, scene: Scene): void;

}
