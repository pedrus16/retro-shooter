import 'babylonjs-loaders';

import { Color3, DirectionalLight, Engine, HemisphericLight, Scene, UniversalCamera, Vector3 } from 'babylonjs';

import { Entity } from './entity.class';
import { MapGraphicsComponent } from './map-graphics.component';
import { SphereGraphicsComponent } from './sphere-graphics.component';

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

        const light = new HemisphericLight('light1', new Vector3(-1, 1, -1), this.scene);

        const ground = new Entity(new MapGraphicsComponent(this.scene));

        this.addEntity(ground);
    }

    private update() {
        this.entities.forEach((entity) => entity.update(this.scene));
    }

}
