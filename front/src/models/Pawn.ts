export default class Pawn {
    id: number;
    posX : number
    posY : number
    skin: string
    teamName : string;

    constructor(id: number, position: [number, number], teamName: string, skin: string) {
        this.posX = position[0];
        this.posY = position[1];
        this.teamName = teamName;
        this.skin = skin;
        this.id = id;
    }

    set newPosition (newPosition: [number, number]) {
        this.posX = newPosition[0];
        this.posY = newPosition[1];
    }
    
    get position () {
        return [this.posX, this.posY]
    }

    get nearPositions () {
        return [
            [this.posX + 1, this.posY],
            [this.posX - 1, this.posY],
            [this.posX, this.posY + 1],
            [this.posX, this.posY - 1],
            [this.posX + 1, this.posY + 1],
            [this.posX - 1, this.posY + 1],
            [this.posX - 1, this.posY - 1],
            [this.posX + 1, this.posY - 1],
        ]
    }
}