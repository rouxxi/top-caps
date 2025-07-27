import {EventDispatcher} from "three";
import {httpService} from "./http-service.ts";

export class GameEventHandler extends EventDispatcher {
    async pawnSync (pawn) {
       return await httpService.put('/pawns', pawn)
    }

    async teamHasToPlay (gameId , teamId) {
        console.log(gameId , teamId)
        return await httpService.put('/games', {id: gameId, active_team: teamId })
    }
};
