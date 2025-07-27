import {EventDispatcher} from "three";
import {httpService} from "./http-service.ts";

export class GameEventHandler extends EventDispatcher {
    async pawnSync (pawn) {
        await httpService.put('/pawns', pawn)
    }
};
