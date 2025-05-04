export const localStorageService = {

    saveGameId(uuid: string) {
        localStorage.setItem('game-id', uuid)
    },

    
    saveTeam(teamName: string) {
        localStorage.setItem('team-name', teamName)
    },

    clearTeamName () {
        localStorage.removeItem('team-name')
    },

    clear (){
        localStorage.clear();
    },

    get gameId () {
        return localStorage.getItem('game-id')
    },
    get teamName () {
        return localStorage.getItem('team-name')
    },
    get info () {
        return {
            gameId: localStorage.getItem('game-id'),
            teamName: localStorage.getItem('team-name'),
        }
    }
}
