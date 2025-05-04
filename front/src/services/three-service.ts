import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gltfImportFormat from '../configs/gltf-files-format';

type Grid = [number, number][];

//TODO penset  à this.scene.getObjectByName pour essayer de remove

export class ThreeService {
    scene: THREE.Scene;
    camera: THREE.Camera;
    renderer?: THREE.WebGLRenderer;
    gltfLoader : GLTFLoader;
    textureLoader: THREE.TextureLoader;
    isPreviewMod: boolean;
    controls?: OrbitControls;

    constructor(isPreview: boolean = false) {
        this.isPreviewMod = isPreview;
        this.gltfLoader = new GLTFLoader();
        this.textureLoader = new THREE.TextureLoader();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, 1.5, 0.1, 200); // Si le near est 0 => on ne voit rien
        
        if(isPreview) {
            this.camera.position.set(0.8,1,0.8);
        }

        this.setupLight()       
    }

    init(canvas : HTMLElement) {
        this.renderer = new THREE.WebGLRenderer({
            canvas, 
            alpha: true
        });
        this.renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)
        this.renderer.setPixelRatio(window.devicePixelRatio); // askip permet de ne pas déformer les pixel
        this.controls = new OrbitControls(this.camera, this.renderer?.domElement);

        if (this.isPreviewMod) {
            //create infinit loop for rotation auto
            this.controls.autoRotate = true;
            this.controls.enabled = false;

            const render = () => {
                const timer = Date.now()

                this.scene.rotateY(timer/400000000000000)
        
                this.renderer?.render( this.scene, this.camera );
        
                requestAnimationFrame(render);
            }

            requestAnimationFrame( render );
        } else {
            this.controls.minDistance = 1;
            this.controls.maxDistance = 180;
            // controls.enablePan = false;
            this.controls.target.set(1, 1, 1);
            this.controls.addEventListener("change",() => this.renderer?.render(this.scene, this.camera ));
        }
    }



    resetPreviewPawn() {
        this.scene = new THREE.Scene();
        this.setupLight()
    }

    setupLight () {
        const dirLight1 = new THREE.DirectionalLight( 0xffffff, 10 );
        dirLight1.position.set( 1, 1, 1 );
        this.scene.add( dirLight1 );

        const dirLight2 = new THREE.DirectionalLight( 0x002288, 10 );
        dirLight2.position.set( - 1, - 1, - 1 );
        this.scene.add( dirLight2 );

        const ambientLight = new THREE.AmbientLight( 0x555555 );
        this.scene.add( ambientLight );
    }

    generateBattleField (grid:Grid) {
        const board = new THREE.Group();

        for (let [x,y] of grid) {
            board.add(this._createTile([x,y]))
        }

        board.position.set(1,1,1);
        this.scene.add(board);
    }
    
    _createTile (position: [number,number])  {

        const cubeGeo = new THREE.BoxGeometry(1, 0.5, 1);

        const lightMaterial = new THREE.MeshBasicMaterial({ color: 0x002288 });
        const blackMaterial = new THREE.MeshBasicMaterial({ color: 0x555555 });
        let theme;
        if (position[1] % 2 === 0) {

            theme = position[0] % 2 === 0 ? lightMaterial : blackMaterial;
        } else {
            theme = position[0] % 2 === 0 ? blackMaterial : lightMaterial;
        }

        const mesh = new THREE.Mesh(cubeGeo, theme);        
        mesh.position.set(position[0], 1,  position[1]);
        mesh.name = `${position[0]},${position[1]}` // give the position to all cases for find them
        // mesh.receiveShadow= true;

        return mesh
    }

    loadPreviewPawn (name:string) {
        const config = gltfImportFormat.getConfigByName(name);



        this.gltfLoader.load(`/assets/pawn-skin/${name}/scene.gltf`,
         (gltf) => {
                // const materials = config.texturesPath.map((texturePath : string) => new THREE.MeshBasicMaterial({map:this.loadColorTexture(`/assets/${name}/${texturePath}`)}) );

                // resizeElement
                const sizeOfPawn = new THREE.Box3().setFromObject( gltf.scene.children[0])
                const scaleX = config.preview.toSclale / (sizeOfPawn.max.x - sizeOfPawn.min.x);
                const scaleY = config.preview.toSclale / (sizeOfPawn.max.y - sizeOfPawn.min.y);
                const scaleZ = config.preview.toSclale / (sizeOfPawn.max.z - sizeOfPawn.min.z);
                gltf.scene.scale.set(scaleX,scaleY, scaleZ)

                // orientation dépend de l'export fait par le créateur
                gltf.scene.children[0].position.set(
                    config.preview.toCenterPosition.x,
                    config.preview.toCenterPosition.y,
                    config.preview.toCenterPosition.z
                );
                gltf.scene.children[0].rotation.set(
                    config.preview.toPlanRotation.x,
                    config.preview.toPlanRotation.y,
                    config.preview.toPlanRotation.z
                );
                
                gltf.scene.position.set(0,0,0);
                
                // if (materials.length > 0) {
                //     console.log(document.getRootNode())
                    
                //     gltf.scene.traverse((node)=> {
                //         if (node.isMesh) {
                //         node.material.map = materials
                //         }
                //     })
                // }
       
                this.scene.add(gltf.scene)
            },
            (prog) => {
                console.log({prog })
            },
            (err) => {
                console.log({err})
            },
        )
    }

    loadColorTexture( path: string ) {
        const texture = this.textureLoader.load( path );
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
    }

    loadPawn (name: string) {
        this.gltfLoader.load('/caps_01/scene.gltf',
            (gltf) => {
                gltf.scene.position.set(0,0,0);
                gltf.scene.rotation.set(-0.7,0.5,0.5);
                gltf.scene.scale.set(5,5,5);

                console.log('gltf.asset', gltf.asset)
                this.scene.add(gltf.scene)
                this.render()
            },
            (prog) => {
                console.log({prog })
            },
            (err) => {
                console.log({err})
            },
        )
    }

    generateOnePawn ({theme, position } : Record<string, string> ) {
        console.log(theme, position)
    }
}