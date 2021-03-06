import 'babylonjs-loaders';

import { ActionManager, Engine, ExecuteCodeAction, HemisphericLight, Scene, UniversalCamera, Vector3, PhysicsImpostor, Texture, Quaternion, Matrix } from 'babylonjs';

import { CharacterGraphicsComponent } from './character/character-graphics.component';
import { CharacterInputComponent } from './character/character-input.component';
import { CharacterPhysicsComponent } from './character/character-physics.component';
import { Entity } from './entity.class';
import { MapGraphicsComponent } from './map-graphics.component';
import { MapPhysicsComponent } from './map-physics.component';
import { CharacterCameraComponent } from './character/character-camera.component';
import { AdvancedDynamicTexture } from 'babylonjs-gui';
import { ImpostorGraphicsComponent } from './impostor/impostor-graphics.component';

import arrowSprite from "../assets/images/arrow.png";
import monkeySprite from "../assets/images/monkey.png";
import boltSprite from "../assets/images/bolt.png";
import { ProjectilePhysicsComponent } from './projectile/projectile-physics.component';

export const INPUT_MAP: { [code: string]: boolean } = {};

const GRAVITY_Y = -9.81;

export class Game {

    private canvas: any;
    private engine: Engine;
    private scene: Scene;
    private static entities: Entity[] = [];

    private gui: AdvancedDynamicTexture;

    constructor() {
        this.canvas = document.getElementById('renderCanvas');

        this.engine = new Engine(this.canvas, false);
        this.scene = new Scene(this.engine);
        this.scene.gravity = new Vector3(0, GRAVITY_Y, 0);
        this.scene.collisionsEnabled = true;

        this.scene.actionManager = new ActionManager(this.scene);

        this.scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (event) => {
            INPUT_MAP[event.sourceEvent.code] = event.sourceEvent.type === 'keydown';
        }));

        this.scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (event) => {
            INPUT_MAP[event.sourceEvent.code] = event.sourceEvent.type === 'keydown';
        }));

        this.gui = AdvancedDynamicTexture.CreateFullscreenUI("WeaponHUD", true, this.scene);
        this.gui.getContext().imageSmoothingEnabled = false;
        this.gui.idealWidth = 480;
        this.gui.idealHeight = 270;

        this.createScene();

        this.scene.debugLayer.show();
    }

    public start() {
        this.scene.onBeforeRenderObservable.add(() => {
            this.update();
        });

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        window.addEventListener('resize', () => {
            this.engine.resize();
            this.gui.getContext().imageSmoothingEnabled = false;
        });

        this.scene.onPointerDown = () => {
            this.engine.enterFullscreen(true);
        };
    }

    public static addEntity(entity: Entity) {
        this.entities.push(entity);
    }

    private createScene() {
        // const camera = new UniversalCamera('Camera', new Vector3(20, 10, -20), this.scene);
        // camera.setTarget(new Vector3(0, 1, 0));
        // camera.attachControl(this.canvas,  true);
        // camera.minZ = 0;

        const light = new HemisphericLight('light1', new Vector3(-1, 2, -0.5), this.scene);

        const ground = new Entity({ update: () => null }, new MapGraphicsComponent(this.scene), { update: () => null });
        const player = this.buildPlayerEntity();

        Game.addEntity(ground);
        Game.addEntity(player);

        player.position = new Vector3(9.7, 10, 0);

        let angle = 0;
        const bolt = new Entity({
            update: (host) => {
                const elapsedTimeSec = this.engine.getDeltaTime() / 1000;

                angle += Math.PI / 2 * elapsedTimeSec;
                host.rotationQuaternion = Quaternion.RotationAxis(new Vector3(0, 1, 0), angle);
            }
        }, new ImpostorGraphicsComponent(this.scene, boltSprite, { segments: 8, rings: 4, frameWidth: 64, frameHeight: 64 }), { update: () => null });

        Game.addEntity(bolt);

        bolt.position = new Vector3(0, 1, 0);
    }

    private buildPlayerEntity(): Entity {
        const playerPhysics = new CharacterPhysicsComponent(this.engine, this.scene);
        return new Entity(
            new CharacterInputComponent(playerPhysics, this.scene, this.engine),
            new CharacterGraphicsComponent(this.engine, this.gui, this.scene),
            playerPhysics,
            new CharacterCameraComponent(this.scene)
        );
    }

    private update() {
        Game.entities.forEach((entity) => entity.update(this.scene));
    }

}
