import 'babylonjs-loaders';

import { ActionManager, Engine, ExecuteCodeAction, HemisphericLight, Scene, UniversalCamera, Vector3 } from 'babylonjs';

import { CharacterGraphicsComponent } from './character-graphics.component';
import { CharacterInputComponent } from './character-input.component';
import { CharacterPhysicsComponent } from './character-physics.component';
import { Entity } from './entity.class';
import { MapGraphicsComponent } from './map-graphics.component';

export const INPUT_MAP: { [code: string]: boolean } = {};

export class Game {

    private canvas: any;
    private engine: Engine;
    private scene: Scene;
    private entities: Entity[] = [];

    constructor() {
        this.canvas = document.getElementById('renderCanvas');
        this.engine = new Engine(this.canvas, false);
        this.scene = new Scene(this.engine);
        this.scene.gravity = new Vector3(0, -9.81, 0);
        this.scene.collisionsEnabled = true;

        this.scene.actionManager = new ActionManager(this.scene);

        this.scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (event) => {
            INPUT_MAP[event.sourceEvent.code] = event.sourceEvent.type === 'keydown';
        }));

        this.scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (event) => {
            INPUT_MAP[event.sourceEvent.code] = event.sourceEvent.type === 'keydown';
        }));

        this.createScene();
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
    }

    public addEntity(entity: Entity) {
        this.entities.push(entity);
    }

    private createScene() {
        const camera = new UniversalCamera('Camera', new Vector3(20, 10, -20), this.scene);
        camera.setTarget(new Vector3(0, 1, 0));
        camera.attachControl(this.canvas,  true);
        camera.minZ = 0;

        const light = new HemisphericLight('light1', new Vector3(-1, 2, -0.5), this.scene);

        const ground = new Entity(new MapGraphicsComponent(this.scene), { update: () => null }, { update: () => null });
        const player = this.buildPlayerEntity();

        this.addEntity(ground);
        this.addEntity(player);

        player.position = new Vector3(0, 1, 0);
    }

    private buildPlayerEntity(): Entity {
        return new Entity(
            new CharacterGraphicsComponent(this.scene),
            new CharacterInputComponent(),
            new CharacterPhysicsComponent(this.engine)
        );
    }

    private update() {
        this.entities.forEach((entity) => entity.update(this.scene));
    }

}
