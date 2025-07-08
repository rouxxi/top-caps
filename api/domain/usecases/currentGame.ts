import playersRepository from "../../repository/players.ts";
import gameRepository from "../../repository/games.ts";
import kingRepository from "../../repository/kings.ts";
import pawnRepository from "../../repository/pawns.ts";
import {getPreset} from "../../utils/gridGenerator.ts";

interface CreateGameBody {
    preset:number;
    gameMod: string;
    teams: {
        name: string,
        pawnSkin:string
    }[]
}

export async function currentGame(id: string) {
    const [game] = await gameRepository.getById(id)
    return game;
}