import { Scene } from 'babylonjs';

import { Entity } from './entity.class';

export interface GraphicsComponent {

    update(host: Entity, scene: Scene): void;

}
