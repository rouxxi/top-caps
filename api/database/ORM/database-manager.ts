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

        const duplicate = await this.findById(id);
        if (duplicate) {
            throw new Error('Already exists');
        }
        await database.set(id , payload);
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
            return await database.get(id);
        } catch (error) {
            console.log(error)
            return;
        }
    }

    async createGame (payload: PawnSet) {

    }
}
const database = new Jsoning('./database/database.json')

export const db = new DatabaseManager(database);