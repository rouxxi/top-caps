import type {PawnSet} from "../../../front/src/models/PawnSet.ts";
import { Jsoning } from 'jsoning';

class DatabaseManager {
    database: any;
    constructor(database: any) {
        this.database = database;
    }

    async readDatabase() {
        try {
            return await database.all();
        } catch (error) {
            console.log(error)
        }
    }

    async createNewGame (id: string, payload: PawnSet) {

        const alreadyExists = await this.findById(id);
        if (alreadyExists) {
            throw new Error('Already exists');
        }
        const isCreatedGame = await this.database.set(id, payload);
        return isCreatedGame;
    }

    async updateGame (id: string, updateField) {
        try {
            const gameToUpdate = await this.findById(id);
            if (gameToUpdate) {
                const newPayload = {...gameToUpdate, ...updateField}
                await database.set(id , newPayload);
            }
        } catch (error) {
            console.log(error)
        }
    }

    async findById (id) {
        try {
            console.log('in findById', id);
            const data = await database.get(id);
            console.log(data)
            return data
        } catch (error) {
            console.log(error)
            return null;
        }
    }
}
const database = new Jsoning('./database/database.json')

export const db = new DatabaseManager(database);