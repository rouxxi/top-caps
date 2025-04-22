let defaultGrid : Array<[number, number]> = []

for (let ligne = 1; ligne <= 6; ligne++ ) {
    for (let column = 1; column <= 6; column++ ) {
        defaultGrid.push([ligne, column])
    }
}

export { defaultGrid }