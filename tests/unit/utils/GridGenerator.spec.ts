
import {beforeEach, describe, expect, test, vi } from 'vitest';
import Pawn from '../../../src/models/Pawn';
import { GridGenerator } from '../../../src/utils/GridGenerator';

describe('UNIT | GridGenerator', () => {

    test('Should Create an array of array', ()=> {
        const grid = GridGenerator(2,2);

        expect(grid).toStrictEqual([[1,1], [1,2],[2,1],[2,2]]);
        expect(grid.length).toStrictEqual(4);
        expect(Array.isArray(grid)).to.be.true;
    })

    test('Can create asymetrique grid', ()=> {
        const grid = GridGenerator(1,3)

        expect(grid).toStrictEqual([[1,1], [1,2],[1,3]]);
    })
})