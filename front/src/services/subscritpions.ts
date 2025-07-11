import {createClient} from "@supabase/supabase-js";

export class Subscritpions  {
    static subGame(id : string) {
        const databaseConnexion = createClient(import.meta.env.VITE_DATABASE_URL, import.meta.env.VITE_DATABASE_KEY)
        databaseConnexion
            .channel(`public:pawns:game_id=${id}`)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'countries' }, payload => {
                    console.log('Change received!', payload)
                })
            .subscribe()
    }

    static subPawns(id : string) {
        const databaseConnexion = createClient(import.meta.env.VITE_DATABASE_URL, import.meta.env.VITE_DATABASE_KEY)
        databaseConnexion
            .channel(`public:games:id=${id}`)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'countries' }, payload => {
                console.log('Change received!', payload)
            })
            .subscribe()
    }
}
