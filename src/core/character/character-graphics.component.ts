import { Scene, Engine } from 'babylonjs';

import { Entity } from '../entity.class';
import { GraphicsComponent } from '../graphics-component.interface';
import { AdvancedDynamicTexture, Image } from 'babylonjs-gui';
import crossbow from "../../assets/images/weapons/crossbow3.png";

export class CharacterGraphicsComponent implements GraphicsComponent {

    // private cubeMesh: Mesh;
    // private prevHostPosition = Vector3.Zero();
    // private elapsedTimeSec = 0;

    constructor(private engine: Engine, private gui: AdvancedDynamicTexture, scene: Scene) {
        // this.cubeMesh = MeshBuilder.CreateBox('playerCube', { height: 1.8, width: 0.5, depth: 0.5 }, scene);
        // this.cubeMesh.collisionGroup = 0b0;
        // const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("WeaponHUD", true, scene, Texture.NEAREST_SAMPLINGMODE);
        
        const image = new Image("crossbow", crossbow);
        image.width = "480px";
        image.height = "270px";
        image.stretch = Image.STRETCH_NONE;
        image.verticalAlignment = Image.VERTICAL_ALIGNMENT_BOTTOM;
        image.horizontalAlignment = Image.HORIZONTAL_ALIGNMENT_RIGHT;
        this.gui.addControl(image);
    }

    public update(host: Entity) {
        // if (host.position.subtract(this.prevHostPosition).length() || this.elapsedTimeSec >= (1 / TICK_PER_SECOND)) {
        //     this.prevHostPosition = host.position.clone();
        //     this.cubeMesh.position = host.position;
        // } else {
        //     const elapsedTimeSec = this.engine.getDeltaTime() / 1000;
        //     this.cubeMesh.position = this.cubeMesh.position.add(host.velocity.multiplyByFloats(elapsedTimeSec, elapsedTimeSec, elapsedTimeSec));
        // }

        // TODO Interpolate between position changes because the physic component tick rate is not tied to the framerate.
        // this.cubeMesh.position = host.position;

        // this.cubeMesh.rotationQuaternion = host.rotationQuaternion;
    }

}
