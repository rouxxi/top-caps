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

export async function createNewGame(bodyRequest: CreateGameBody) {
    const preset = getPreset(bodyRequest.preset);

    const [game] = await gameRepository.create({
        status: 'created',
        mode: bodyRequest.gameMod,
        grid: preset.grid
    })

    for (const team of bodyRequest.teams) {
        const index = bodyRequest.teams.indexOf(team);
        const [playerCreated] = await playersRepository.create({name: team.name})

        await kingRepository.create({
            position_x: preset.teams[index].kingPosition[0],
            position_y: preset.teams[index].kingPosition[0],
            player_id: playerCreated.id,
            game_id: game.id,
        })

        for (const {teamPawns } of preset.teams) {
            for (const [x,y] of teamPawns) {
                await pawnRepository.create({
                    position_x: x,
                    position_y: y,
                    skin: team.pawnSkin,
                    player_id: playerCreated.id,
                    game_id: game.id,
                })
            }
        }
    }

    return game.id;
}