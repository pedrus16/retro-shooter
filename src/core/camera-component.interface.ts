import { Entity } from './entity.class';

export interface CameraComponent {

    update(host: Entity): void;

}
