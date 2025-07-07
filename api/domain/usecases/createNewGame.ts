import playersRepository from "../../repository/players.ts";
import gameRepository from "../../repository/current_games.ts";
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

export async function createNewGame(bodyRequest: CreateGameBody) {
    const preset = getPreset(bodyRequest.preset);

    const [game] = await gameRepository.create({
        status: 'created',
        mode: bodyRequest.gameMod,
        grid: preset.grid
    })


    for (const team of bodyRequest.teams) {
        const [playerCreated] = await playersRepository.create({name: team.name})

        for (const {kingPosition,teamPawns } of preset.teams) {
            await kingRepository.create({
                position_x: kingPosition[0],
                position_y: kingPosition[1],
                player_id: playerCreated.id,
                game_id: game.id,
            })

            for (const [x,y] of teamPawns) {
                await pawnRepository.create({
                    position_x: x,
                    position_y: y,
                    skin: 'default',  // team.pawnSkin
                    player_id: playerCreated.id,
                    game_id: game.id,
                })
            }
        }
    }

    return game.id;
}