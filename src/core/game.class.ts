import 'babylonjs-loaders';

import { DirectionalLight, Engine, Scene, UniversalCamera, Vector3 } from 'babylonjs';

import { Entity } from './entity.class';
import { GroundGraphicsComponent } from './ground-graphics.component';
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
        const camera = new UniversalCamera('Camera', new Vector3(0, 2, 0), this.scene);
        camera.setTarget(new Vector3(0, 2, 1));
        camera.attachControl(this.canvas, true);
        camera.applyGravity = true;
        camera.ellipsoid = new Vector3(0.5, 1.7, 0.5);
        camera.checkCollisions = true;
        camera.minZ = 0;

        const light1 = new DirectionalLight('light1', new Vector3(0.5, -1, 0), this.scene);

        const ground = new Entity(new GroundGraphicsComponent(this.scene));

        this.addEntity(ground);
    }

    private update() {
        this.entities.forEach((entity) => entity.update(this.scene));
    }

}
