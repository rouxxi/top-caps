export default class Pawn {
    id: number;
    position_x : number
    position_y : number
    skin: string
    teamId : number;

    constructor(id: number, position_x: number, position_y: number, teamId: number, skin: string) {
        this.setNewPosition = this.setNewPosition.bind(this);

        this.position_x = position_x;
        this.position_y = position_y;
        this.teamId = teamId;
        this.skin = skin;
        this.id = id;
    }

    setNewPosition (newPosition: [number, number]) {
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