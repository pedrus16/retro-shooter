import { Vector3 } from 'babylonjs';

import { Entity } from './entity.class';
import { InputComponent } from './input-component.interface';

export class CharacterInputComponent implements InputComponent {

    public update(host: Entity) {
        const elapsed = new Date().getTime() / 500;
        const newPosition = new Vector3(
            Math.cos(elapsed) * 4,
            host.position.y,
            Math.sin(elapsed) * 4
        );
        host.moveTo(newPosition);
    }

}
