import { Entity } from '../entity.class';
import { GraphicsComponent } from '../graphics-component.interface';
import arrow from "../../assets/images/arrow.png";
import { Mesh, MeshBuilder, Scene, SpriteManager, Sprite, Vector3 } from 'babylonjs';

export class ImpostorGraphicsComponent implements GraphicsComponent {

    private sprite: Sprite;

    constructor(private scene: Scene) {
        var spriteManagerArrow = new SpriteManager("arrowManager", arrow, 2, { width: 128, height: 128 }, scene);
        this.sprite = new Sprite("sprite", spriteManagerArrow);
        this.sprite.cellIndex = 0;
    }

    public update(host: Entity) {
        const segments = 8;
        const rings = 4;
        this.sprite.position = host.position;

        const camera = this.scene.activeCamera;
        if (camera) {
            const axis1 = camera.position.subtract(host.position);
            const axis3 = Vector3.Cross(camera.position, axis1);
            const axis2 = Vector3.Cross(axis3, axis1);
            const angle = Vector3.RotationFromAxis(axis1, axis2, axis3);

            const piece = Math.PI / segments;
            const segmentIndex = Math.floor((-(angle.y - piece) / Math.PI / 2) * segments) % segments + segments / 2;
            const ringIndex = Math.floor(-angle.x / Math.PI / 2 * rings) % rings + rings / 2;
            this.sprite.cellIndex = ringIndex * segments + segmentIndex + 1 ;
        }
    }

}
