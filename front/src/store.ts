import { createStore } from 'vuex';
import { STATUSES } from './models/GameService.ts';
import { httpService } from './services/http-service.ts';

export const store = createStore({
    state: {
        gameInformation: {},
        teams: [],
        pawns: {},
        kings: {},
        isLoading: false,
    },
    mutations: {
        setKings: (state, kings) => {
            state.kings = kings;
        },
        setPawns: (state, pawns) => {
            state.pawns = pawns;
        },
        setTeams: (state, teams) => {
            state.teams = teams;
        },
        setGameInformation: (state, gameInformation) => {
            state.gameInformation = gameInformation;
        },
        isLoading: (state, arg) => {
            state.isLoading = arg;
        },
        updateGameInfo: (state, payload) => {
             state.currentGame = payload ;
        },
        selectMod: (state, payload ) => {
            state.currentGame.gameMod = payload.gameMod;
            state.currentGame.status = payload.status;
        },
        updateStatus: (state, status: string) => {
            state.currentGame.status = status;
        },
        updateTeams: (state, teams) => {
            state.currentGame.teams = teams;
        }
    },
    actions: {
        selectMod: async ( {commit, state} , paylod)  => {
            commit('selectMod',{...paylod, status: STATUSES.MOD_SELECTED});
            await httpService.put('/games', {...paylod, status: STATUSES.MOD_SELECTED});
        },
        createGame: async ( {commit, state} , payload)  => {
            try {
               const gameId =  await httpService.post('/games', payload)
               return gameId;
            } catch (err) {
                console.log(err)
            } finally {
                commit('isLoading', false)
            }

        },
        selectTeam: async ( {commit, state} , payload)  => {

            let numberTeamSelected = 0;
            const teams = state.currentGame.teams.map((team)=> {
                if (team.name === payload.teamName) {
                    team.selected = true;
                }
                if (team.selected) numberTeamSelected += 1;
                return team
            })

            commit('updateTeams',teams)

            if(numberTeamSelected === state.currentGame.teams.length) {
                commit('updateStatus', STATUSES.TEAM_SELECTED);
                await httpService.put('/games', {id:payload, status: STATUSES.TEAM_SELECTED})
            }
        },
        
    },
    getters: {
        getCurrentGame: (state) => {
            return state.currentGame;
        },
        getFirsteamName: (state) => {
            if (state.teams.length === 2) {
                return state.teams[0].name;
            }
        },
      }
}) 