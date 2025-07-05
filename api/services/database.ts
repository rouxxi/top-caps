import {createClient} from "@supabase/supabase-js";


export class DatabaseService {

    static async connect() {
        try {
            const databaseConnexion = createClient(process.env.DADABASE_URL, process.env.DADABASE_KEY)
            return databaseConnexion;
        } catch (error) {
            console.log(error)
        }
    }
}