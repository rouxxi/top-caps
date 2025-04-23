
import {beforeEach, describe, expect, test, vi } from 'vitest';
import Pawn from '../../../src/models/Pawn';

describe('UNIT | Pawn', () => {
    let pawn;
    beforeEach(()=> {
        pawn = new Pawn([1,1],  'player 1');
    })
    test('#position', ()=> {
        expect(pawn.position).toStrictEqual([1,1])
    })
})