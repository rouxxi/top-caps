import {DatabaseService} from '../services/database.ts';

interface CurrentGame {
    id: string;
    status: string;
    mode: string;
    grid: [number, number][];
    active_player: number | null;
    created_at: Date | null;
}

interface CurrentGameUpdateProps {
    id?: string;
    status?: string;
    mode?: string;
    grid?: [number, number][];
    active_player?: number | null;
}

async function getById (id: string) {
    const db = await DatabaseService.connect();
    let { data, error } = await db
        .from('current_games')
        .select('*')
        .eq('id', id)

    if( error) {
        console.log('error ',error)
        return null;
    }

    return data;
}

async function update (fieds: CurrentGameUpdateProps ) {
    const {id, ...others} = fieds
    const db = await DatabaseService.connect();
    const { data, error } = await db
        .from('current_games')
        .update({ ...others })
        .eq('id', id)
        .select('*');

    if( error) {
        console.log('error ',error)
        return null;
    }

    return data;
}

async function create (fieds: CurrentGameUpdateProps ) {
    const db = await DatabaseService.connect();
    const { data, error } = await db
        .from('current_games')
        .insert({...fieds})
        .select()

    if( error) {
        console.log('error ',error)
        return null;
    }

    return data;
}

async function deleteFromId (id: string ) {
    const db = await DatabaseService.connect();
    const { data, error } = await db
        .from('current_games')
        .delete()
        .eq('id', id);

    if( error) {
        console.log('error ',error)
        return null;
    }

    return data;
}

export default { getById, update, create, deleteFromId }