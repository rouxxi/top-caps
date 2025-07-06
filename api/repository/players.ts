import {DatabaseService} from '../services/database.ts';

interface Player {
    id?: number;
    name: string;
    created_at?: Date | null;
}

async function getById (id: number) {
    const db = await DatabaseService.connect();
    let { data, error } = await db
        .from('players')
        .select('*')
        .eq('id', id)

    if( error) {
        console.log('error ',error)
        return null;
    }

    return data;
}

async function update (fieds: Player ) {
    const {id, ...others} = fieds
    const db = await DatabaseService.connect();
    const { data, error } = await db
        .from('players')
        .update({ ...others })
        .eq('id', id)
        .select('*');

    if( error) {
        console.log('error ',error)
        return null;
    }

    return data;
}

async function create (fieds: Player ) {
    const db = await DatabaseService.connect();
    const { data, error } = await db
        .from('players')
        .insert({...fieds})
        .select()

    if( error) {
        console.log('error ',error)
        return null;
    }

    return data;
}

async function deleteFromId (id: number ) {
    const db = await DatabaseService.connect();
    const { data, error } = await db
        .from('players')
        .delete()
        .eq('id', id);

    if( error) {
        console.log('error ',error)
        return null;
    }

    return data;
}

export default { getById, update, create, deleteFromId }