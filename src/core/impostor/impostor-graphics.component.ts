import { Entity } from '../entity.class';
import { GraphicsComponent } from '../graphics-component.interface';
import { Mesh, MeshBuilder, Scene, SpriteManager, Sprite, Ray, VertexBuffer, StandardMaterial, VertexData, Vector3, Material, Color3, FreeCamera, Texture, AxesViewer } from 'babylonjs';

export class ImpostorGraphicsComponent implements GraphicsComponent {

    private sprite: Sprite;
    private sphere: Mesh;

    // private debugSphere: Mesh;
    // private debugVertices: Mesh[];

    // private redMaterial: StandardMaterial;
    // private whiteMat: StandardMaterial;

    private debug = false;
    // private debugBox: Mesh;

    constructor(private scene: Scene, spritesheet: string, params = { segments: 8, rings: 4, frameHeight: 128, frameWidth: 128 }) {
        var spriteManager = new SpriteManager("spritesheet", spritesheet, 2, { width: params.frameWidth, height: params.frameHeight }, scene, undefined, Texture.NEAREST_NEAREST_MIPNEAREST);
        this.sprite = new Sprite("sprite", spriteManager);
        this.sprite.cellIndex = 0;

        const vertices = this.createSphereVertices(params.segments, params.rings, 0.5);
        const vertexData = new VertexData();
        vertexData.positions = vertices;
        vertexData.indices = this.createSphereFaces(params.segments, params.rings);
        vertexData.normals = vertices.map((_, index) => index % 3 === 0 ? 0 : 1);

        this.sphere = new Mesh("custom", scene);
        this.sphere.checkCollisions = false;
        this.sphere.collisionGroup = 0b0;
        vertexData.applyToMesh(this.sphere);
        this.sphere.updateFacetData();
        this.sphere.isVisible = this.debug;

        const wireframeMat = new StandardMaterial("wireframe", scene);
        wireframeMat.wireframe = true;
        wireframeMat.alpha = 0.5;
        this.sphere.material = wireframeMat;

        // this.debugBox = MeshBuilder.CreateBox("debug", { size: 1, width: 0.5, height: 0.25 });
        // this.debugBox.material = wireframeMat;

        // DEBUG
        // this.whiteMat = new StandardMaterial("white", scene);
        // this.whiteMat.alpha = 1;
        // this.whiteMat.diffuseColor = new Color3(0.0, 1.0, 0.0);

        // this.redMaterial = new StandardMaterial("red", scene);
        // this.redMaterial.alpha = 1;
        // this.redMaterial.diffuseColor = new Color3(1.0, 0.0, 0.0);

        // this.debugSphere = MeshBuilder.CreateSphere("debug1", { diameter: 0.025 }, scene);
        // this.debugSphere.checkCollisions = false;

        // this.debugSphere.isVisible = this.debug;
        // this.debugVertices = [
        //     MeshBuilder.CreateSphere("debug2", { diameter: 0.025 }, scene),
        //     MeshBuilder.CreateSphere("debug3", { diameter: 0.025 }, scene),
        //     MeshBuilder.CreateSphere("debug4", { diameter: 0.025 }, scene),
        // ];

        // this.debugVertices[0].isVisible = this.debug;
        // this.debugVertices[0].checkCollisions = false;
        // this.debugVertices[1].isVisible = this.debug;
        // this.debugVertices[1].checkCollisions = false;
        // this.debugVertices[2].isVisible = this.debug;
        // this.debugVertices[2].checkCollisions = false;

        // this.debugVertices[0].material = this.whiteMat;
        // this.debugVertices[1].material = this.whiteMat;
        // this.debugVertices[2].material = this.whiteMat;
    }

    public update(host: Entity) {
        this.sphere.position = host.position;
        this.sphere.rotationQuaternion = host.rotationQuaternion;
        this.sprite.position = host.position;

        // this.debugBox.position = host.position;
        // this.debugBox.rotationQuaternion = host.rotationQuaternion;

        const camera = this.scene.activeCamera as FreeCamera;
        if (camera) {
            const delta = host.position.subtract(camera.position);

            // TODO
            // const direction = delta.normalizeToNew();
            // const angle = Vector3.Dot(this.sphere.rotationQuaternion.toEulerAngles(), direction);
            // const rotation = this.sphere.rotationQuaternion.toEulerAngles().multiply(direction);
            // console.log(angle);
            // this.sprite.angle = angle;
            
            // const cross = Vector3.Cross(camera.rotationQuaternion.toEulerAngles(), this.sphere.rotation);
            // const rotation = camera.rotation.subtract(this.sphere.rotation);
            // const dot = Vector3.Dot(delta.normalizeToNew(), rotation);
            // console.log(cross);
            // this.sprite.angle = rotation.y;

            const ray = new Ray(camera.position, delta, delta.length());
            const hit = ray.intersectsMesh(this.sphere);

            if (hit && hit.pickedPoint) {
                // DEBUG
                // this.debugSphere.position = hit.pickedPoint;

                const index = hit.faceId * 3;
                const indices = this.sphere.getIndices();
                const vertices = this.sphere.getVerticesData(VertexBuffer.PositionKind);
                if (indices && vertices) {
                    this.sphere.computeWorldMatrix();
                    var matrix = this.sphere.getWorldMatrix();
                    // var worldPosition = Vector3.TransformCoordinates(local_position, matrix);

                    const vertexIndices = [indices[index], indices[index + 1], indices[index + 2]];
                    const v1Index = vertexIndices[0] * 3;
                    const v1 = Vector3.TransformCoordinates(new Vector3(vertices[v1Index], vertices[v1Index + 1], vertices[v1Index + 2]), matrix);
                    const v2Index = vertexIndices[1] * 3;
                    const v2 = Vector3.TransformCoordinates(new Vector3(vertices[v2Index], vertices[v2Index + 1], vertices[v2Index + 2]), matrix);
                    const v3Index = vertexIndices[2] * 3;
                    const v3 = Vector3.TransformCoordinates(new Vector3(vertices[v3Index], vertices[v3Index + 1], vertices[v3Index + 2]), matrix);

                    // DEBUG
                    // this.debugVertices[0].position = v1;
                    // this.debugVertices[1].position = v2;
                    // this.debugVertices[2].position = v3;

                    const v1Dist = Vector3.Distance(hit.pickedPoint, v1);
                    const v2Dist = Vector3.Distance(hit.pickedPoint, v2);
                    const v3Dist = Vector3.Distance(hit.pickedPoint, v3);

                    if (v1Dist < v2Dist && v1Dist < v3Dist) {
                        this.sprite.cellIndex = vertexIndices[0];
                        // this.debugVertices[0].material = this.redMaterial
                        // this.debugVertices[1].material = this.whiteMat
                        // this.debugVertices[2].material = this.whiteMat
                    } else if (v2Dist < v1Dist && v2Dist < v3Dist) {
                        this.sprite.cellIndex = vertexIndices[1];
                        // this.debugVertices[0].material = this.whiteMat
                        // this.debugVertices[1].material = this.redMaterial
                        // this.debugVertices[2].material = this.whiteMat
                    } else if (v3Dist < v1Dist && v3Dist < v2Dist) {
                        this.sprite.cellIndex = vertexIndices[2];
                        // this.debugVertices[0].material = this.whiteMat
                        // this.debugVertices[1].material = this.whiteMat
                        // this.debugVertices[2].material = this.redMaterial
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
