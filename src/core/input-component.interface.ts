import { Entity } from './entity.class';

export interface InputComponent {

    update(host: Entity): void;

}
