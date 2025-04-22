import Pawn from "./Pawn";
import { defaultGrid } from "../constants/index";

export type Team = {
    name: string;
    kingPosition: [number, number];
    teamPawns: Pawn[];
};

export class PawnSet {
    grid: [number, number][] = [];
    teams: Team[] = [];

    init (config?: any) {
        if (config) {
            this.grid = config.grid;
            this.teams = config.teams;
        } else {
            this.grid = defaultGrid;
            this.teams = [
                {
                    name: 'Team 1',
                    kingPosition: [1,1],
                    teamPawns:[
                        new Pawn([1,2],'Team 1'),
                        new Pawn([2,2],'Team 1'),
                        new Pawn([3,2],'Team 1'),
                        new Pawn([4,2],'Team 1')
                    ]
                },
                {
                    name: 'Team 2',
                    kingPosition: [6,6],
                    teamPawns:[
                        new Pawn([3,5],'Team 1'),
                        new Pawn([4,5],'Team 1'),
                        new Pawn([5,5],'Team 1'),
                        new Pawn([6,5],'Team 1')
                    ]
                },
            ]
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
        return this.allPawns.filter((pawn)=> pawn.position[0] === position[0] && pawn.position[1] === position[1]).length === 0;
    }

    availableGridCases (singlePawn: Pawn) {
        return this.grid.filter(([x, y])=> !this.isKingPosition([x,y], singlePawn.teamName));        
    }

    nearPawnNumber (singlePawn: Pawn) {
        let nearPawns = 0;
        for (const nearPosition of singlePawn.nearPositions.filter((nearPosition)=> nearPosition[0] > 0 && nearPosition[1] > 0 && !this.isKingPosition(nearPosition, singlePawn.teamName))) {
            if (this.allPawns.filter((pawn)=> pawn.position[0] === nearPosition[0] && pawn.position[1] === nearPosition[1] ).length) {
                nearPawns += 1;
            }
        }

        return nearPawns;
    }

    availableMoves (pawn: Pawn) {
        const pawnMovesList = this.movesList(pawn);
        //à refaire pour chaque nearNumber
        const pawnMovesListFiltered = pawnMovesList.filter(([x, y])=> {
            if (!this.isPositionEmpty([x, y])) return false;
            if (!this.availableGridCases(pawn).some(([gridPositionX, gridPositionY])=> gridPositionX === x && gridPositionY === y)) return false
            return true 
        });
        
        // check si quelqu'un est sur le trajet
        // check si la case est dans la grille

        // return this.availableCases.includes(position)
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