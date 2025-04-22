export default class Pawn {
    posX : number
    posY : number
    teamName : string;

    constructor(position: [number, number], teamName: string) {
        this.posX = position[0];
        this.posY = position[1];
        this.teamName = teamName;
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