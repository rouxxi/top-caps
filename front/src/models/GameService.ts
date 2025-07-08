import Pawn from "./Pawn.ts";

export type Team = {
    id: number;
    name: string;
    selected: boolean;
    pawns_skin: string;
    teamPawns: Pawn[];
};

type RawTeam = {
    id: number;
    name: string;
    pawns_skin: string,
    selected: boolean;
}
type RawPawn = {
    id: number;
    team_id: number;
    position_x: number;
    position_y: number;
}

type RawKing = {
    id: number;
    team_id: number;
    position_x: number;
    position_y: number;
}


export const STATUSES = {
    CREATED: 'created',
    TEAM_SELECTED: 'team_selected',
    STARTED: 'started',
    FINISHED: 'finished'
}

export class GameService {
    id?: string;
    status?: string;
    game_mod?: string;
    active_team?: number;
    grid: [number, number][] = [];
    teams: Team[] = [];

    generateGame(rawInformations: { id:string,status: string, mode: string, grid: [number, number][],active_team: number |null, pawns: RawPawn[], kings:RawKing[], teams: RawTeam[] }) {
       try {
           this.id = rawInformations.id;
           this.status = rawInformations.status;
           this.grid = rawInformations.grid
           this.game_mod = rawInformations.mode;
           this.active_team = rawInformations.active_team ?? rawInformations.teams[0].id;

           const teams = rawInformations.teams.map((team)=> {
               const pawns = rawInformations.pawns
                   .filter((pawn)=> pawn.team_id === team.id)
                   .map((pawn)=> {
                       return new Pawn(pawn.id, [pawn.position_x, pawn.position_y], team.name, team.pawns_skin)
                   });
               const king = rawInformations.kings.find((king)=> king.team_id === team.id);
               return {
                   id: team.id,
                   name: team.name,
                   selected: team.selected,
                   kingPosition: [king?.position_x, king?.position_y],
                   teamPawns: pawns,
                   pawns_skin: team.pawns_skin
               }
           })

           this.teams = teams

       } catch (err) {
           console.log(err)
       }
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

    findKingPositionByTeamName (teamName: string) {
        const  team = this.teams.find((team) => team.name === teamName)
        return team?.kingPosition
    }

    isKingPosition (position: number[] , team: string) {
        return position[0] === this.findKingPositionByTeamName(team)?.[0] && position[1] === this.findKingPositionByTeamName(team)?.[1]  
    }

    isPositionEmpty (position: [number, number] ) {
        return !this.allPawns.some((pawn)=> pawn.position[0] === position[0] && pawn.position[1] === position[1]);
    }

    isGridCaseExists(position: [number, number]) {
        return this.grid.some((([x,y])=> x === position[0] && y === position[1]));
    }

    nearPawnNumber (singlePawn: Pawn) {
        let nearPawns = 0;
        const positions = singlePawn.nearPositions.filter((nearPosition)=> nearPosition[0] > 0 && nearPosition[1] > 0 && !this.isKingPosition(nearPosition, singlePawn.teamName))
        
        for (const nearPosition of positions) {
            if (this.allPawns.filter((pawn)=> pawn.position[0] === nearPosition[0] && pawn.position[1] === nearPosition[1] ).length) {
                nearPawns += 1;
            }
        }

        return nearPawns;
    }

    availableMoves (pawn: Pawn) {
        const pawnMovesList = this.movesList(pawn);

        const pawnMovesListFiltered = pawnMovesList.filter(([x, y])=> {
            if (!this.isGridCaseExists([x,y])) return false;     
            if (this.isKingPosition([x,y], pawn.teamName)) return false;
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