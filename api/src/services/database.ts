import {createClient} from "@supabase/supabase-js";

export class DatabaseService {
    static async connect() {
        try {
            const databaseConnexion = createClient(process.env.DATABASE_URL, process.env.DATABASE_KEY)
            return databaseConnexion;
        } catch (error) {
            console.log(error)
        }
    }
}