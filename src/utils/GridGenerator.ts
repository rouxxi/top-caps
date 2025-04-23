function GridGenerator (rowNumber: number, columnNumber: number) {
    let grid = [];
    
    for (let ligne = 1; ligne <= rowNumber; ligne++ ) {
        for (let column = 1; column <= columnNumber; column++ ) {
            grid.push([ligne, column])
        }
    }
    return grid;    
}

export {GridGenerator}