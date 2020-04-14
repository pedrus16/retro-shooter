import { Entity } from '../entity.class';
import { GraphicsComponent } from '../graphics-component.interface';
import arrow from "../../assets/images/arrow.png";
import { Mesh, MeshBuilder, Scene, SpriteManager, Sprite, Ray, VertexBuffer, StandardMaterial, VertexData, Vector3, Material, Color3 } from 'babylonjs';

export class ImpostorGraphicsComponent implements GraphicsComponent {

    private sprite: Sprite;
    private sphere: Mesh;

    private debugSphere: Mesh;
    private debugVertices: Mesh[];

    private redMaterial: StandardMaterial;
    private whiteMat: StandardMaterial;

    constructor(private scene: Scene) {
        var spriteManagerArrow = new SpriteManager("arrowManager", arrow, 2, { width: 128, height: 128 }, scene);
        this.sprite = new Sprite("sprite", spriteManagerArrow);
        this.sprite.cellIndex = 0;

        const segments = 8;
        const rings = 4;
        const vertices = this.createSphereVertices(segments, rings, 0.25);
        const vertexData = new VertexData();
        vertexData.positions = vertices;
        vertexData.indices = this.createSphereFaces(segments, rings);
        vertexData.normals = vertices.map((_, index) => index % 3 === 0 ? 0 : 1);

        this.sphere = new Mesh("custom", scene);
        vertexData.applyToMesh(this.sphere);
        this.sphere.updateFacetData();
        this.sphere.isVisible = true;

        const wireframeMat = new StandardMaterial("wireframe", scene);
        wireframeMat.wireframe = true;
        wireframeMat.alpha = 0.5;
        this.sphere.material = wireframeMat;

        // DEBUG
        this.whiteMat = new StandardMaterial("white", scene);
        this.whiteMat.alpha = 1;
        this.whiteMat.diffuseColor = new Color3(0.0, 1.0, 0.0);

        this.redMaterial = new StandardMaterial("red", scene);
        this.redMaterial.alpha = 1;
        this.redMaterial.diffuseColor = new Color3(1.0, 0.0, 0.0);

        this.debugSphere = MeshBuilder.CreateSphere("debug1", { diameter: 0.025 }, scene);
        this.debugVertices = [
            MeshBuilder.CreateSphere("debug2", { diameter: 0.025 }, scene),
            MeshBuilder.CreateSphere("debug3", { diameter: 0.025 }, scene),
            MeshBuilder.CreateSphere("debug4", { diameter: 0.025 }, scene),
        ];

        this.debugVertices[0].material = this.whiteMat;
        this.debugVertices[1].material = this.whiteMat;
        this.debugVertices[2].material = this.whiteMat;

        if (this.scene.activeCamera) {
            console.log(this.scene.activeCamera.getProjectionMatrix());
        }
    }

    public update(host: Entity) {
        this.sphere.position = host.position;
        this.sprite.position = host.position;
        
        const camera = this.scene.activeCamera;
        if (camera) {
            // this.sprite.angle = camera.getProjectionMatrix();
            const delta = host.position.subtract(camera.position);
            const ray = new Ray(camera.position, delta, delta.length());
            const hit = ray.intersectsMesh(this.sphere);

            if (hit && hit.pickedPoint) {
                // DEBUG
                this.debugSphere.position = hit.pickedPoint;

                const index = hit.faceId * 3;
                const indices = this.sphere.getIndices();
                const vertices = this.sphere.getVerticesData(VertexBuffer.PositionKind);
                if (indices && vertices) {
                    const vertexIndices = [indices[index], indices[index + 1], indices[index + 2]];
                    const v1Index = vertexIndices[0] * 3;
                    const v1 = this.sphere.position.add(new Vector3(vertices[v1Index], vertices[v1Index + 1], vertices[v1Index + 2]));
                    const v2Index = vertexIndices[1] * 3;
                    const v2 = this.sphere.position.add(new Vector3(vertices[v2Index], vertices[v2Index + 1], vertices[v2Index + 2]));
                    const v3Index = vertexIndices[2] * 3;
                    const v3 = this.sphere.position.add(new Vector3(vertices[v3Index], vertices[v3Index + 1], vertices[v3Index + 2]));

                    // DEBUG
                    this.debugVertices[0].position = v1;
                    this.debugVertices[1].position = v2;
                    this.debugVertices[2].position = v3;

                    const v1Dist = Vector3.Distance(hit.pickedPoint, v1);
                    const v2Dist = Vector3.Distance(hit.pickedPoint, v2);
                    const v3Dist = Vector3.Distance(hit.pickedPoint, v3);

                    if (v1Dist < v2Dist && v1Dist < v3Dist) {
                        this.sprite.cellIndex = vertexIndices[0];
                        this.debugVertices[0].material = this.redMaterial
                        this.debugVertices[1].material = this.whiteMat
                        this.debugVertices[2].material = this.whiteMat
                    } else if (v2Dist < v1Dist && v2Dist < v3Dist) {
                        this.sprite.cellIndex = vertexIndices[1];
                        this.debugVertices[0].material = this.whiteMat
                        this.debugVertices[1].material = this.redMaterial
                        this.debugVertices[2].material = this.whiteMat
                    } else if (v3Dist < v1Dist && v3Dist < v2Dist) {
                        this.sprite.cellIndex = vertexIndices[2];
                        this.debugVertices[0].material = this.whiteMat
                        this.debugVertices[1].material = this.whiteMat
                        this.debugVertices[2].material = this.redMaterial
                    }
                }

            }
        }
    }

    private createSphereVertices(segments: number, rings: number, radius: number): number[] {
        const vertices = [];
        vertices.push(0, radius, 0);
        for (let ring = 1; ring < rings; ring++) {
            const phi = ring / rings * Math.PI;
            for (let segment = 0; segment < segments; segment++) {
                const theta = segment / segments * Math.PI * 2;
                const x = Math.cos(theta) * Math.sin(phi) * radius;
                const y = Math.cos(phi) * radius;
                const z = Math.sin(theta) * Math.sin(phi) * radius;
                vertices.push(x, y, z);
            }
        }
        vertices.push(0, -radius, 0);

        return vertices;
    }

    private createSphereFaces(segments: number, rings: number): number[] {
        const indices = [];
        const vertexCount = (rings - 1) * segments + 2;
        const lastIndex = vertexCount - 1;

        for (let segment = 0; segment < segments; segment++) {
            indices.push(0, segment + 1, (segment + 1) % segments + 1);

            const v1 = lastIndex - segments + segment;
            const v2 = lastIndex - segments + (segment + 1) % segments;
            indices.push(lastIndex, v2, v1);
        }
        for (let ring = 1; ring < rings - 1; ring++) {
            for (let segment = 0; segment < segments; segment++) {
                const v1 = segment + (ring - 1) * segments + 1;
                const v2 = (segment + 1) % segments + (ring - 1) * segments + 1;
                const v3 = segment + ring * segments + 1;
                const v4 = (segment + 1) % segments + ring * segments + 1;
                indices.push(v1, v3, v2);
                indices.push(v2, v3, v4);
            }
        }

        return indices;
    }

}
