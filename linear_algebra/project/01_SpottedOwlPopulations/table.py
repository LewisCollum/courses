import numpy

table = {}

R = numpy.arange(0.18, 0.31, 0.02)

for r in R:
    X = numpy.empty((31, 3))
    X[0] = numpy.asarray([100, 100, 100])

    for i in range(1, len(X)):
        A = numpy.asarray([
            [0, 0, 0.33],
            [r, 0, 0],
            [0, 0.71, 0.94]])
        
        X[i] = A.dot(X[i-1])
    table[round(r, 2)] = X
