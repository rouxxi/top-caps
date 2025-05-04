import Pawn from "./Pawn.ts";
import { defaultGrid } from "../constants";
import { v4 as uuidv4 } from 'uuid';

export type Team = {
    name: string;
    selected?: boolean;
    kingPosition: [number, number];
    teamPawns: Pawn[];
};

type rawTeam = {
    name: string;
    selected?: boolean;
    kingPosition: [number, number];
    teamPawns: [number, number][];
};

export const STATUSES = {
    CREATED: 'created',
    MOD_SELECTED: 'mod_selected',
    TEAM_SELECTED: 'team_selected',
    STARTED: 'started',
    FINISHED: 'finished'
}

//TODO penser a injecter le nom de l'équipe
export const GAMEPRESET = {
    '1': {
        grid: defaultGrid,
        teams: [
        {
            kingPosition: [1,1],
            teamPawns:[[1,2],[2,2],[3,2],[4,2]]
        },
        {
            kingPosition: [6,6],
            teamPawns:[[3,5],[4,5],[5,5],[6,5]]
        },
    ]},
    '2': {
        grid: defaultGrid,
        teams: [
            {
                kingPosition: [1,1],
                teamPawns:[[1,2],[2,2],[5,3],[6,3]]
            },
            {
                kingPosition: [6,6],
                teamPawns:[[1,4],[2,4],[5,5],[6,5]]
            },
        ]},
    '3': {
        grid: defaultGrid,
        teams: [
            {
                kingPosition: [1,1],
                teamPawns:[[1,3],[2,3],[3,2],[3,1]]
            },
            {
                kingPosition: [6,6],
                teamPawns:[[4,6],[4,5],[5,4],[6,4]]
            },
        ]}
}

export type GameInformation = {
    id: string;
    status: string;
    gameMod?: string;
    activePlayer?: string;
    grid: [number, number][] | [];
    teams: rawTeam[];
}

export class GameService {
    id: string;
    status: string;
    gameMod?: string;
    activePlayer?: string;
    grid: [number, number][] = [];
    teams: Team[] = [];

    constructor () {
        this.id = uuidv4();
        this.status = STATUSES.CREATED;
    }

    generate (config?: GameInformation) {
        if (config) {
            this.id = config.id;
            this.grid = config.grid;
            const teams = [];

            for (const team of config.teams) {
                teams.push(this.generateEntitiesFromTeamConfig(team))
            }

            this.teams = teams;
            this.activePlayer = config.activePlayer || teams?.[0]?.name;
        } else {
            this.grid = defaultGrid;
            this.activePlayer = 'Team 1';
            this.teams = [
                this.generateEntitiesFromTeamConfig({
                    name: 'Team 1',
                    kingPosition: [1,1],
                    teamPawns:[[1,2],[2,2],[3,2],[4,2]]
                }),
                this.generateEntitiesFromTeamConfig({
                    name: 'Team 2',
                    kingPosition: [6,6],
                    teamPawns:[[3,5],[4,5],[5,5],[6,5]]
                }),
            ]
        }
    }
    generateEntitiesFromTeamConfig (team: rawTeam) : Team {
        const teamName = team.name;
        const pawns = []

        for (const pawnPosition of team.teamPawns) {
            pawns.push(new Pawn(pawnPosition, teamName))
        }

        return {
            name: teamName,
            selected:false,
            kingPosition: team.kingPosition,
            teamPawns: pawns
        }
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