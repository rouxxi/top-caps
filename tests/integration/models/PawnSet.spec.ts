import Pawn from '../../../src/models/Pawn';
import { PawnSet } from './../../../src/models/PawnSet';
import {beforeEach, describe, expect, test, vi } from 'vitest';

describe('PawnSet', () => {
    let pawnSet;
    beforeEach(()=> {
        pawnSet = new PawnSet();
    })
    describe('#init', ()=> {

        test('should create a dynamic grid', () => {
            pawnSet.init({ 
                grid: [[1,1], [1,2], [2,1], [2,2]],
                teams: [
                    {name: 'first team', kingPosition:[1,1], teamPawns: [new Pawn([1,2],'first team')] },
                    {name: 'Second team', kingPosition:[2,2], teamPawns: [new Pawn([2,1],'Second team')] }
        ]})

            expect(pawnSet.allPawns).toStrictEqual([new Pawn([1,2],'first team'),new Pawn([2,1],'Second team')])
        })
            
    })
})