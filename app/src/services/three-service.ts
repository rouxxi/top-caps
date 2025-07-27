import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gltfImportFormat from '../configs/gltf-files-format';
import type {RawKing, RawPawn, RawTeam, GameInformation} from "./GameService.ts";
import  {GameService} from "./GameService.ts";
import { Object3D} from "three";
import Pawn from "../models/Pawn.ts";
import {GameEventHandler} from "./game-event-handler.ts";

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
    mousePosition: THREE.Vector2;
    raycaster: THREE.Raycaster;
    gridHelper?: THREE.GridHelper;
    game?: GameService;
    selectedPawn?: THREE.Object3D;
    possibleMoveToString?: string[];
    eventHandler: GameEventHandler;

    constructor(isPreview: boolean = false) {
        this.clickEvent = this.clickEvent.bind(this);
        this.mouseTracking = this.mouseTracking.bind(this);
        // this.applyClick = this.applyClick.bind(this);

        this.isPreviewMod = isPreview;
        this.gltfLoader = new GLTFLoader();
        this.textureLoader = new THREE.TextureLoader();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, 1.5, 0.1, 200); // Si le near est 0 => on ne voit rien
        this.mousePosition = new THREE.Vector2(0, 0);
        this.raycaster = new THREE.Raycaster();
        this.eventHandler = new GameEventHandler();

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
            this.renderer?.domElement.addEventListener('click', this.clickEvent, false )
            this.renderer?.domElement.addEventListener('mousemove', this.mouseTracking, false )

            const render = () => {
                //TODO faire des presets pour 3 / 4 position de camera
                // this._setDefaufaultCameraPosition();

                this._setDefaufaultCameraPosition()
                // console.log(this.game?.isGameFinished)
                this.raycaster.setFromCamera( this.mousePosition, this.camera );
                this.renderer?.render( this.scene, this.camera );

                requestAnimationFrame(render);
            }

            requestAnimationFrame( render );
        }
    }

    mouseTracking ( event) {
        const canvas = event.target,
            box = canvas.getBoundingClientRect(),
            x = event.clientX - box.left,
            y = event.clientY - box.top;

        this.mousePosition.setX( ( x / canvas.scrollWidth ) * 2 - 1);
        this.mousePosition.setY(- ( y / canvas.scrollHeight ) * 2 + 1);
    }

    applyPawnChangesFromDB (pawn) {
        console.log("applyPawnChanges")
        console.log(this.scene)
        const objects3D = this.scene.getObjectsByProperty( 'game_id', pawn.id);
        const pawnToMove = objects3D.find( object => object.name.includes('pawn'))
        console.log({pawnToMove})
        if (pawnToMove) {
            pawnToMove?.position.setX(pawn.position_x +1);
            pawnToMove?.position.setZ(pawn.position_y +1);

            const gamePawn = this.game?.findPawn(pawn?.id)

            if (gamePawn) {
                gamePawn.setNewPosition([pawn[0], pawn[1]]);
            }

        }
    }

    consumeGameInformation ({ gameInformation , pawns, kings, teams}: { gameInformation: GameInformation , pawns: RawPawn[], kings: RawKing[], teams: RawTeam[]}) {
        let serializedTeam = []
        for (let team of teams) {
            const teamPawns = pawns.filter((pawn)=> pawn.team_id === team.id).map((pawn)=>(new Pawn(pawn.id, pawn.position_x, pawn.position_y, team.id, team.pawns_skin)));
            const teamKing = kings.find((king)=> king.team_id === team.id);
            serializedTeam.push({id: team.id, name: team.name, selected: team.selected, pawns_skin:team.pawns_skin , kingPosition: [teamKing.position_x, teamKing.position_y], teamPawns});
        }

        this.game = new GameService({
            status: gameInformation.status,
            game_mod: gameInformation.game_mod,
            active_team: gameInformation.active_team,
            grid: gameInformation.grid,
            teams:serializedTeam
            })
    }

    _setDefaufaultCameraPosition () {
        this.camera.position.set(5.2703592609926995, -5.437118187186904,2.5351721718969245);
        this.camera.rotation.set(1.5707953270448742,-0.000000024265056283,0.024266359264332023);
        this.camera.quaternion.set(0.7070765593887276,-0.006499171120743169,0.006499164621286416, 0.7070772664970695 )
        this.scene.position.set(0,0,0);
        this.scene.rotation.set(-0.6953905063863763,-0.02340503126905997,-0.019525808419736532);
    }

    clickEvent (event) {
        const board = this.scene.getObjectByName('board-group');
        console.log({board});
        if (board instanceof Object3D) {
            const intersect = this.raycaster.intersectObject(board);
            const selectedTile = intersect.find((obj) => obj.object.name.includes('tile')); // je n'arrive pas a selectionner mes pawns xD
            const tilePosition = selectedTile?.object.game_position;

            console.log(selectedTile);
            if (!this.selectedPawn && !selectedTile?.object?.is_available_move) {
                this.selectedPawn = this.scene.getObjectByName( `pawn-${tilePosition}`);
            } else if (this.selectedPawn && selectedTile?.object?.is_available_move) {
                const positionToMove = selectedTile.object.name.split('-')[1].split(',').map((el)=> parseInt(el));

                const pawnToMove = this.scene.getObjectByName( this.selectedPawn.name);

                if (pawnToMove) {
                    pawnToMove.position.set(positionToMove[0] + 1, this.selectedPawn.position.y, positionToMove[1] + 1);
                    pawnToMove.name = `pawn-${positionToMove[0]},${positionToMove[1]}`
                }

                const gamePawn = this.game?.findPawn(pawnToMove?.game_id)

                if (gamePawn) {
                    gamePawn.setNewPosition([positionToMove[0], positionToMove[1]]);
                }
                if (gamePawn && pawnToMove) {
                    this.eventHandler.pawnSync({
                        id: gamePawn.id,
                        team_id: gamePawn.teamId,
                        position_x: gamePawn.position_x,
                        position_y: gamePawn.position_y
                    })
                }
                //TODO faire la condition pour vérifier que le pion est bien le mm que celui selectionné
                this.selectedPawn = undefined;
            } else {
                this.selectedPawn = undefined;
            }

            //TODO ajouter un check que les case available ne sont précisé que pour un piont
            if (this.selectedPawn && selectedTile && this.scene.getObjectsByProperty('is_available_move', true).length === 0) {
                const pawn = this.game?.findPawn(this.selectedPawn.game_id);
                const availableMoves = this.game?.availableMoves(pawn);
                this.possibleMoveToString = availableMoves?.map((position) => position.join(','));

                this.scene.traverse((element) => {
                    if (this.possibleMoveToString?.includes(element.name.split('-')[1]) && element.isObject3D) {
                        element.is_available_move = true;
                        element.material.color.set({r:0, g:255, b:0, isColor: true})
                    }
                })
            } else {
                this.scene.traverse((element) => {
                    if (element.original_color) {
                        element.material.color.set(element.original_color)
                    }

                    if (element.is_available_move) {
                        element.is_available_move = false;
                    }
                })
            }
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
        this.gridHelper =  new THREE.GridHelper( 6, Math.max(...grid.flat()) );
        const gridTable = new THREE.Group();
        gridTable.name = 'grid'
        this.gridHelper.position.setX(3.5);
        this.gridHelper.position.setY(1);
        this.gridHelper.position.setZ(3.5);

        gridTable.add( this.gridHelper );

        const board = new THREE.Group();
        this.scene.add(board);

        board.name = 'board-group';
        board.add(this.gridHelper)
        for (let [x,y] of grid) {
            board.add(this._createTile([x,y]))
        }

        board.position.set(1,1,1);
        // this.scene.add(gridTable);
        this._setDefaufaultCameraPosition()
    }

    generatePawns (pawnArray: RawPawn[], teams: RawTeam[] = []) {
        console.log('geneatePawns')
        const pawnsGroup = new THREE.Group();
        pawnsGroup.position.set(0,0,0);

        this.scene.add( pawnsGroup );
        pawnsGroup.name = 'pawns-group';
        for (let pawn of pawnArray) {
            const team = teams.find((team)=> pawn.team_id === team.id);
            this.loadPawn(
             team?.pawns_skin,
             [pawn.position_x,pawn.position_y],
             pawn.id,
               // this.scene
                pawnsGroup
            );
           console.log(this.scene)
           // this.scene.add(generatedPawn)
        }

        // this.scene.add(pawnsGroup);
    }

    _createTile (position: [number,number])  {

        const cubeGeo = new THREE.BoxGeometry(1, 0.5, 1);

        const lightMaterial = new THREE.MeshBasicMaterial({ color: 0x002288 });
        const blackMaterial = new THREE.MeshBasicMaterial({ color: 0x555555 });
        let theme, originalColor;
        if (position[1] % 2 === 0) {
            theme = position[0] % 2 === 0 ? lightMaterial : blackMaterial;
            originalColor = position[0] % 2 === 0 ? 0x002288 : 0x555555;
        } else {
            theme = position[0] % 2 === 0 ? blackMaterial : lightMaterial;
            originalColor = position[0] % 2 === 0 ? 0x555555 : 0x002288;
        }

        const mesh = new THREE.Mesh(cubeGeo, theme);
        mesh.position.set(position[0], 1,  position[1]);
        mesh.name = `tile-${position[0]},${position[1]}` // give the position to all cases for find them
        mesh.game_position = `${position[0]},${position[1]}` // give the position to all cases for find them
        mesh.original_color = originalColor
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
                    config.preview.rotation.x,
                    config.preview.rotation.y,
                    config.preview.rotation.z
                );

                gltf.scene.position.set(0,0,0);
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

    loadPawn (name: string, position: [number, number], id, group) {
        if (!name) return;
        const config = gltfImportFormat.getConfigByName(name);
        if (!config) return;
        this.gltfLoader.load(`/assets/pawn-skin/${name}/scene.gltf`,
            (gltf) => {
                gltf.scene.position.set(position[0]+ config.game.position.x,config.game.position.y,position[1] + config.game.position.z);

                gltf.scene.rotateZ(config.game.rotation.z)
                gltf.scene.rotateX(config.game.rotation.x)
                gltf.scene.scale.set(config.game.scale.x,config.game.scale.y,config.game.scale.z);

                gltf.scene.game_id = id;
                gltf.scene.game_position = position.join(',');
                gltf.scene.name = `pawn-${position.join(',')}`
                group.add(gltf.scene)
            },
            (prog) => {
                // console.log({prog })
            },
            (err) => {
                console.log({err})
            },
        )
    }
}
