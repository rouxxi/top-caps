import {EventDispatcher} from "three";
import {httpService} from "./http-service.ts";

export class GameEventHandler extends EventDispatcher {
    async pawnSync (pawn) {
       return await httpService.put('/pawns', pawn)
    }
};
