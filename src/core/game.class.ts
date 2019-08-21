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
        const camera = new UniversalCamera('Camera', new Vector3(0, 10, 10), this.scene);
        camera.setTarget(Vector3.Zero());
        camera.attachControl(this.canvas, true);

        const light1 = new DirectionalLight('light1', new Vector3(0.5, -1, 0), this.scene);

        const sphere = new Entity(new SphereGraphicsComponent(this.scene));
        sphere.position.y = 0.5;
        const ground = new Entity(new GroundGraphicsComponent(this.scene));

        this.addEntity(sphere);
        this.addEntity(ground);
    }

    private update() {
        this.entities.forEach((entity) => entity.update(this.scene));
    }

}
