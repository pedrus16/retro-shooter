import groundImage from './assets/images/ground.jpg';
import {
  ArcRotateCamera,
  Engine,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Texture,
  Vector3,
  DirectionalLight
  } from 'babylonjs';

const canvas: any = document.getElementById('renderCanvas');
const engine: Engine = new Engine(canvas, false);

function createScene(): Scene {
  const scene: Scene = new Scene(engine);

  const camera: ArcRotateCamera = new ArcRotateCamera('Camera', Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
  camera.attachControl(canvas, true);

  const light1 = new DirectionalLight('light1', new Vector3(0.5, -1, 0), scene);

  const sphere = MeshBuilder.CreateSphere('sphere', { diameter: 1 }, scene);
  const ground = MeshBuilder.CreateGround('ground', { width: 100, height: 100 }, scene);

  sphere.position.y = 0.5;

  const groundMaterial = new StandardMaterial('ground', scene);
  const groundTexture = new Texture(groundImage, scene, undefined, undefined, 4);
  groundTexture.uScale = 128;
  groundTexture.vScale = 128;
  groundMaterial.diffuseTexture = groundTexture;
  groundMaterial.specularTexture = groundTexture;

  ground.material = groundMaterial;

  return scene;
}

const gameScene: Scene = createScene();

engine.runRenderLoop(() => {
  gameScene.render();
});
