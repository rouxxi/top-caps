export default class Pawn {
    id: number;
    position_x : number
    position_y : number
    skin: string
    teamName : string;

    constructor(id: number, position_x: number, position_y: number, teamName: string, skin: string) {
        this.position_x = position_x;
        this.position_y = position_y;
        this.teamName = teamName;
        this.skin = skin;
        this.id = id;
    }

    set newPosition (newPosition: [number, number]) {
        this.position_x = newPosition[0];
        this.position_y = newPosition[1];
    }
    
    get position () {
        return [this.position_x, this.position_y]
    }

    get nearPositions () {
        return [
            [this.position_x + 1, this.position_y],
            [this.position_x - 1, this.position_y],
            [this.position_x, this.position_y + 1],
            [this.position_x, this.position_y - 1],
            [this.position_x + 1, this.position_y + 1],
            [this.position_x - 1, this.position_y + 1],
            [this.position_x - 1, this.position_y - 1],
            [this.position_x + 1, this.position_y - 1],
        ]
    }
}