def sliceByUniquesInColumn(dataframe, sliceColumn, onEachSlice):
    slices = {}
    for unique in dataframe[sliceColumn].unique():
        matchingRowIndices = dataframe[sliceColumn] == unique
        slices[unique] = onEachSlice(dataframe[matchingRowIndices])
    return slices
