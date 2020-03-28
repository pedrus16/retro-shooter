import 'babylonjs-loaders';

import { ActionManager, Engine, ExecuteCodeAction, HemisphericLight, Scene, UniversalCamera, Vector3 } from 'babylonjs';

import { CharacterGraphicsComponent } from './character/character-graphics.component';
import { CharacterInputComponent } from './character/character-input.component';
import { CharacterPhysicsComponent } from './character/character-physics.component';
import { Entity } from './entity.class';
import { MapGraphicsComponent } from './map-graphics.component';
import { MapPhysicsComponent } from './map-physics.component';
import { CharacterCameraComponent } from './character/character-camera.component';

export const INPUT_MAP: { [code: string]: boolean } = {};

const GRAVITY_Y = -9.81;

export class Game {

    private canvas: any;
    private engine: Engine;
    private scene: Scene;
    private entities: Entity[] = [];

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
        });

        this.scene.onPointerDown = () => {
            this.engine.enterFullscreen(true);
        };
    }

    public addEntity(entity: Entity) {
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

        this.addEntity(ground);
        this.addEntity(player);

        player.position = new Vector3(9.7, 10, 5);
    }

    private buildPlayerEntity(): Entity {
        return new Entity(
            new CharacterInputComponent(),
            new CharacterGraphicsComponent(this.scene),
            new CharacterPhysicsComponent(this.engine, this.scene),
            new CharacterCameraComponent(this.scene)
        );
    }

    private update() {
        this.entities.forEach((entity) => entity.update(this.scene));
    }

}
