import { Scene } from 'babylonjs';

import { Entity } from './entity.class';

export interface InputComponent {

    update(host: Entity, scene: Scene): void;

}
