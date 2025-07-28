import {EventDispatcher} from "three";
import {httpService} from "./http-service.ts";
import type Pawn from "../models/Pawn.ts";

export class GameEventHandler extends EventDispatcher {
    async pawnSync (pawn: Pawn) {
       return await httpService.put('/pawns', pawn)
    }

    async teamHasToPlay (gameId: number , teamId: number) {
        console.log(gameId , teamId)
        return await httpService.put('/games', {id: gameId, active_team: teamId })
    }
};
