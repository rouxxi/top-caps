import Pawn from '../../../src/models/Pawn';
import { GridGenerator } from '../../../src/utils/GridGenerator';
import { PawnSet } from '../../../src/models/PawnSet';
import {beforeEach, describe, expect, test, vi } from 'vitest';

describe('UNIT | PawnSet', () => {
    let pawnSet;
    beforeEach(()=> {
        pawnSet = new PawnSet();
    })
    describe('#init', ()=> {
        test('should create a dynamic grid', () => {
            pawnSet.init({ 
                grid: GridGenerator(2,2),
                teams: [
                    {name: 'first team', kingPosition:[1,1], teamPawns: [[1,2]] },
                    {name: 'Second team', kingPosition:[2,2], teamPawns: [[2,1]] }
            ]})

            expect(pawnSet.allPawns).toStrictEqual([new Pawn([1,2],'first team'),new Pawn([2,1],'Second team')])
        })

        test('should create entity from positions', () => {
            pawnSet.init({ 
                grid: GridGenerator(2,2),
                teams: [
                    {name: 'first team', kingPosition:[1,1], teamPawns: [[1,2]] },
                    {name: 'Second team', kingPosition:[2,2], teamPawns: [[2,1]] }
            ]})

            expect(pawnSet.allPawns).toStrictEqual([new Pawn([1,2],'first team'),new Pawn([2,1],'Second team')])
        })
        test('should inject teamName during pawns creation', () => {
            pawnSet.init({ 
                grid: GridGenerator(2,2),
                teams: [
                    {name: 'first team', kingPosition:[1,1], teamPawns: [[1,2]] },
                    {name: 'Second team', kingPosition:[2,2], teamPawns: [[2,1]] }
            ]})

            expect(pawnSet.allPawns).toStrictEqual([new Pawn([1,2],'first team'),new Pawn([2,1],'Second team')])
        })
    })
    describe('#nearPawnNumber', ()=> {
        test('should return 2 if there is 2 pawns of his team next to him', () => {
            pawnSet.init({ 
                grid: GridGenerator(3,3),
                teams: [
                    {name: 'first team', kingPosition:[1,1], teamPawns: [[1,2],[2,2],[2,3]] },
            ]})

            const pawn = pawnSet.allPawns[1];

            expect(pawnSet.nearPawnNumber(pawn)).toStrictEqual(2)
        })

        test('should return 1 if there is 1 pawns of his team next to him', () => {
            pawnSet.init({ 
                grid: GridGenerator(3,3),
                teams: [
                    {name: 'first team', kingPosition:[1,1], teamPawns: [[1,2], [2,2], [3,3]] },
            ]})
            
            const pawn = pawnSet.allPawns[0];

            expect(pawnSet.nearPawnNumber(pawn)).toStrictEqual(1)
        })

        test('should return 0 if there is 0 pawns next to him', () => {
            pawnSet.init({ 
                grid: GridGenerator(3,3),
                teams: [
                    {name: 'first team', kingPosition:[1,1], teamPawns: [[1,2], [3,3], [3,2]] },
            ]})
            
            const pawn = pawnSet.allPawns[0];

            expect(pawnSet.nearPawnNumber(pawn)).toStrictEqual(0)
        })
        test('should return 2 if there are 2 pawns of 2 the teams next to him', () => {
            pawnSet.init({ 
                grid: GridGenerator(3,3),
                teams: [
                    {name: 'first team', kingPosition:[1,1], teamPawns: [[1,2], [2,2],[3,2]] },
                    {name: 'Second team', kingPosition:[3,3], teamPawns: [[1,3]] }
            ]})
            
            const pawn = pawnSet.allPawns[0];

            expect(pawnSet.nearPawnNumber(pawn)).toStrictEqual(2)
        })

    })
    describe('#generateEntitiesFromTeamConfig', ()=> {
        test('should read a config and generate entities in teams', () => {

            const config = {
                grid: GridGenerator(6,6), 
                teams: [
                    {name: 'first team', kingPosition:[1,1], teamPawns:[[1,2], [2,2], [3,2]]},
                    {name: 'Second team', kingPosition:[6,6], teamPawns:[[4,5], [5,5], [6,5]]},
                ]}
            pawnSet.init(config)

            const pawns = pawnSet.allPawns;

            expect(pawns).toStrictEqual(
                [new Pawn([1,2],'first team'),
                new Pawn([2,2],'first team'),
                new Pawn([3,2],'first team'),
                new Pawn([4,5],'Second team'),
                new Pawn([5,5],'Second team'),
                new Pawn([6,5],'Second team'),
            ])
        })
    })
    describe('#isPositionEmpty', ()=> {

        [[1,3], [2,3], [2,1]].forEach((position)=> {
            test('should return true', () => {
                pawnSet.init({ 
                    grid: GridGenerator(4,4),
                    teams: [
                        {name: 'first team', kingPosition:[1,1], teamPawns: [[1,2], [2,2]] },
                        {name: 'Second team', kingPosition:[4,4], teamPawns: [[4,3], [3,3]] }
                ]})
    
                const result = pawnSet.isPositionEmpty(position);
    
                expect(result).to.be.true;
            })
        })


            test('should return true', () => {
                pawnSet.init({ 
                    grid: GridGenerator(4,4),
                    teams: [
                        {name: 'first team', kingPosition:[1,1], teamPawns: [[1,2],[2,2]] },
                        {name: 'Second team', kingPosition:[4,4], teamPawns: [[4,3], [3,3]] }
                ]})
    
                const result = pawnSet.isPositionEmpty([2,2]);
    
                expect(result).to.be.false;
            })


    })

    describe('#isGridCaseExists',()=> {

        [[-1,1],[0,2],[2,0],[1,-1],[6,2],[2,6],[6,6] ].forEach((position)=> {
            test(`should return false if the case doesn't exists`, ()=> {
                pawnSet.init({
                    grid: GridGenerator(3,3),
                    teams: []
                })
    
                const result = pawnSet.isGridCaseExists(position);
                expect(result).to.be.false;
            });
        });

        [[1,1],[2,2],[3,3] ].forEach((position)=> {
            test(`should return true if the case exists`, ()=> {
                pawnSet.init({
                    grid: GridGenerator(3,3),
                    teams: []
                })
    
                const result = pawnSet.isGridCaseExists(position);
                expect(result).to.be.true;
            });
        })
    })

    describe('#availableMoves', ()=> {
        test('should return empty array for pawn where alone', ()=> {
            pawnSet.init({ 
                grid: GridGenerator(4,4),
                teams: [
                    {name: 'first team', kingPosition:[1,1], teamPawns: [[1,2]]},
                    {name: 'Second team', kingPosition:[4,4], teamPawns: [[4,3], [3,3]] }
            ]})

            const result = pawnSet.availableMoves(pawnSet.allPawns[0]);

            expect(result.length).toStrictEqual(0)
        });

        test('should detect if a pawn destination is already taken', ()=> {
            pawnSet.init({ 
                grid: GridGenerator(5,5),
                teams: [
                    {name: 'first team', kingPosition:[1,1], teamPawns: [[3,3],[3,4]] },
            ]})

            const result = pawnSet.availableMoves(pawnSet.allPawns[0]);
            expect(result.length).toStrictEqual(7)
            expect(result.some(([x,y])=> (x === 3 && y === 4))).to.be.false
        });

        test('should detect when a pawn move if there are pawns in the way', ()=> {
            pawnSet.init({ 
                grid: GridGenerator(4,4),
                teams: [
                    {name: 'first team', kingPosition:[1,1], teamPawns: [[1,2], [2,2]] },
                    {name: 'Second team', kingPosition:[4,4], teamPawns: [[4,3], [3,3]] }
            ]})
        
            const result = pawnSet.availableMoves(pawnSet.allPawns[1]);

            expect(result.length).toStrictEqual(2)
            expect(result.some(([x,y])=> (x === 2 && y === 4))).to.be.true
            expect(result.some(([x,y])=> (x === 4 && y === 2))).to.be.true
            expect(result.some(([x,y])=> (x === 4 && y === 4))).to.be.false
        });
        test('should detect if the grid case exist', ()=> {
            
        })
    })
})