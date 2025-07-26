type ConfigElement = {
    preview: {
        rotation: {
            x:number,
            y:number,
            z:number,
        },
        toCenterPosition: {
            x:number,
            y:number,
            z:number
        },
        toSclale: number,
    },
    game: {
        position: {
            x: number,
            y: number,
            z: number,
        },
        rotation: {
            x:number,
            y:number,
            z:number,
        },
        scale: {
            x:number,
            y:number,
            z:number,
        }
    }
    texturesPath: string[]
}

const gltfConfig : Record<string, ConfigElement> = {
    'black_caps': {
        preview: {
            rotation: {
                x:-1.3,
                y:0,
                z:0,
            },
            toCenterPosition: {
                x:1,
                y:1,
                z:1
            },
            toSclale: 1,
        },
        game: {
            position: {
                x:0.82,
                y: 1.55,
                z: 1.12,
            },
            rotation: {
                x:-0.35,
                y:0,
                z:-84.3,
            },
            scale: {
                x:0.18,
                y:0.18,
                z:0.18,
            }
        },
        texturesPath: []
        
    },
    'nuka_kola': {
        preview: {
            rotation: {
                x:-4.2,
                y:3.3,
                z:0.6,
            },
            toCenterPosition: {
                x:1,
                y:1,
                z:1
            },
            toSclale: 1,
        },
        game: {
            position: {
                x: 1,
                y: 1.70,
                z: 1,
            },
            rotation: {
                x:-0.35,
                y:3,
                z:-10.18,
            },
            scale: {
                x:0.011,
                y:0.011,
                z:0.011,
            }
        },
        texturesPath: ['/textures/07_-_Default_diffuse.png', '/textures/07_-_Default_normal.png', '/textures/07_-_Default_specularGlossiness.png']
    },
}

function getConfigByName (name :  string) : ConfigElement {
    const exists = Object.keys(gltfConfig).includes(name)
    if (!exists) {
        throw new Error(`Cannot find config for ${name} in /config/gltf-files-format.ts`)
    }

    const [ , value ] = Object.entries(gltfConfig).find(([keyName, value]) => name === keyName )

    return value;
}


export default {
    ...gltfConfig,
    getConfigByName,
    keys () : string[] {
        return Object.keys(gltfConfig)
    }
}