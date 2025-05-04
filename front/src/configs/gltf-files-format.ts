type ConfigElement = {
    preview: {
        toPlanRotation: {
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
    texturesPath: string[]
}

const gltfConfig : Record<string, ConfigElement> = {
    'black_caps': {
        preview: {
            toPlanRotation: {
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
        texturesPath: []
        
    },
    'nuka_kola': {
        preview: {
            toPlanRotation: {
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