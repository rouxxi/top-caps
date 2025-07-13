import {createClient} from "@supabase/supabase-js";

export class Subscritpions {
    static async subPawns(id: string, callbackFunction) {
        const databaseConnexion = createClient(import.meta.env.VITE_DATABASE_URL, import.meta.env.VITE_DATABASE_KEY)
        databaseConnexion
            .channel(`public:pawns`)
            .on('postgres_changes', {event: 'UPDATE', schema: 'public',filter:`game_id=eq.${id}`, table: 'pawns'}, payload => {
                callbackFunction(payload.new)
            })
            .subscribe()
    }

    static subGame(id: string, callbackFunction) {
        const databaseConnexion = createClient(import.meta.env.VITE_DATABASE_URL, import.meta.env.VITE_DATABASE_KEY)

        databaseConnexion
            .channel(`public:games`)
            .on('postgres_changes', {event: 'UPDATE', schema: 'public', filter:`id=eq.${id}`, table: 'games'}, payload => {
                callbackFunction(payload.new)
            })
            .subscribe()
    }

    static subTeams(id: string, callbackFunction) {
        const databaseConnexion = createClient(import.meta.env.VITE_DATABASE_URL, import.meta.env.VITE_DATABASE_KEY)

        databaseConnexion
            .channel(`public:teams`)
            .on('postgres_changes', {event: 'UPDATE', schema: 'public', filter:`game_id=eq.${id}`, table: 'teams'}, payload => {
                callbackFunction(payload.new)
            })
            .subscribe()
    }


}
