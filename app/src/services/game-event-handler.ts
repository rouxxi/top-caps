import {EventDispatcher} from "three";
import {RequestService} from "./request-service.ts";
import type Pawn from "../models/Pawn.ts";

export class GameEventHandler extends EventDispatcher {
    async pawnSync (pawn: Pawn) {
       return await RequestService.put('/pawns', pawn)
    }

    async teamHasToPlay (gameId: number , teamId: number) {
        console.log(gameId , teamId)
        return await RequestService.put('/games', {id: gameId, active_team: teamId })
    }
};
