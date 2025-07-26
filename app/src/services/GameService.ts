import Pawn from "../models/Pawn.ts";

export type Team = {
    id: number;
    name: string;
    selected: boolean;
    pawns_skin: string;
    kingPosition: [number, number];
    teamPawns: Pawn[];
};

export type RawTeam = {
    id: number;
    name: string;
    pawns_skin: string,
    selected: boolean;
}
export  type RawPawn = {
    id: number;
    team_id: number;
    position_x: number;
    position_y: number;
}

export type RawKing = {
    id: number;
    team_id: number;
    position_x: number;
    position_y: number;
}

export type GameInformation = {
    grid:[number,number][],
    id:string,
    status: string, game_mode: string,
    active_team: number | null
}

export const STATUSES = {
    CREATED: 'created',
    TEAM_SELECTED: 'team_selected',
    STARTED: 'started',
    FINISHED: 'finished'
}

export class GameService {
    status?: string;
    game_mod?: string;
    active_team?: number;
    grid: [number, number][] = [];
    teams: Team[] = [];

    constructor({status,game_mod,active_team, grid, teams }: {status: string,game_mod: string,active_team: number, grid: [number,number][], teams: Team[] }) {
        this.status = status;
        this.game_mod = game_mod;
        this.active_team = active_team;
        this.grid = grid;
        this.teams = teams;
    }

    get teamNames () {
        let names : string[] = [];
        for (const team of this.teams ){
            names.push(team.name);
        }
        return names;
    }
    get allPawns () : Pawn[] {
        let pawns = [];
        for (let team of this.teams) {
            pawns.push(team.teamPawns)
        }
        return pawns.flat();
    }

    findPawn (id: number): Pawn | undefined {
        const pawn =  this.allPawns.find((pawn) => pawn.id === id);
        return pawn
    }

    findKingPositionByTeamName (teamId: number) {
        const  team = this.teams.find((team) => team.id === teamId)
        return team?.kingPosition
    }

    isKingPosition (position: number[] , teamId: number) {
        return position[0] === this.findKingPositionByTeamName(teamId)?.[0] && position[1] === this.findKingPositionByTeamName(teamId)?.[1]
    }

    isPositionEmpty (position: [number, number] ) {
        return !this.allPawns.some((pawn)=> pawn.position[0] === position[0] && pawn.position[1] === position[1]);
    }

    isGridCaseExists(position: [number, number]) {
        return this.grid.some((([x,y])=> x === position[0] && y === position[1]));
    }

    nearPawnNumber (singlePawn: Pawn) {
        let nearPawns = 0;
        const positions = singlePawn.nearPositions.filter((nearPosition)=> nearPosition[0] > 0 && nearPosition[1] > 0 && !this.isKingPosition(nearPosition, singlePawn.teamId))
        
        for (const nearPosition of positions) {
            if (this.allPawns.filter((pawn)=> pawn.position[0] === nearPosition[0] && pawn.position[1] === nearPosition[1] ).length) {
                nearPawns += 1;
            }
        }

        return nearPawns;
    }

    get isGameFinished () {
        return this.allPawns.some((pawn) => this.isKingPosition(pawn.position, this.teams[0].id)  || this.isKingPosition(pawn.position, this.teams[1].id)  )
    }

    availableMoves (pawn: Pawn) {
        const pawnMovesList = this.movesList(pawn);

        const pawnMovesListFiltered = pawnMovesList.filter(([x, y])=> {
            if (!this.isGridCaseExists([x,y])) return false;     
            if (this.isKingPosition([x,y], pawn.teamId)) return false;
            if (!this.isPositionEmpty([x, y])) return false;

            const xDiffPositif =  pawn.position[0] - x;
            const yDiffPositif =  pawn.position[1] - y;

            let isMovmentBlocked = false;
            for (let i = 1; i <= this.nearPawnNumber(pawn); i++ ) {
                const newPositionX = xDiffPositif === 0 ? pawn.position[0] : xDiffPositif < 0 ? (pawn.position[0] + i) : (pawn.position[0]-i);
                const newPositionY = yDiffPositif === 0 ? pawn.position[1] : yDiffPositif < 0 ?  (pawn.position[1] + i) : (pawn.position[1]-i);

                if (!this.isPositionEmpty([newPositionX, newPositionY])) {
                    isMovmentBlocked = true;
                }
            }
            if (isMovmentBlocked) return false;

            return true
        });

        return pawnMovesListFiltered;
    }
    
    movesList (pawn: Pawn) {
        const nearPawnNumber = this.nearPawnNumber(pawn);
       if (nearPawnNumber === 0) return []
       return [
            [pawn.position[0] + nearPawnNumber, pawn.position[1]],
            [pawn.position[0] - nearPawnNumber, pawn.position[1]],
            [pawn.position[0], pawn.position[1] + nearPawnNumber],
            [pawn.position[0], pawn.position[1] - nearPawnNumber],
            [pawn.position[0] + nearPawnNumber, pawn.position[1] + nearPawnNumber],
            [pawn.position[0] - nearPawnNumber, pawn.position[1] + nearPawnNumber],
            [pawn.position[0] - nearPawnNumber, pawn.position[1] - nearPawnNumber],
            [pawn.position[0] + nearPawnNumber, pawn.position[1] - nearPawnNumber],
        ]         
    }
}