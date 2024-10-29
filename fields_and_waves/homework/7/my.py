import matplotlib.pyplot as pyplot
import numpy

def makeGrid():
    fieldLength = 10
    arrowSpacing = 1
    
    return numpy.meshgrid(
        numpy.arange(-fieldLength, fieldLength+1, arrowSpacing),
        numpy.arange(-fieldLength, fieldLength+1, arrowSpacing))

def makePolarGrid(start, stop):
    fieldLength = 5
    arrowSpacing = 1
    radii = numpy.linspace(start,stop,10)
    thetas = numpy.linspace(0,2*numpy.pi,20)
    
    return numpy.meshgrid(thetas, radii)

def plotField(x, y, xComponent, yComponent):
    fig, ax = pyplot.subplots()
    ax.set_aspect('equal')
    q = ax.quiver(x, y, xComponent, yComponent)
    ax.quiverkey(q, X=0.3, Y=1.1, U=10,
                 label='Quiver key, length = 10', labelpos='E')

def plotPolarField(theta, r, thetaComponent, rComponent):
    fig = pyplot.figure()
    ax = fig.add_subplot(111, polar=True)
    ax.set_aspect('equal')
    q = ax.quiver(
        theta,
        r,
        rComponent * numpy.cos(theta) - thetaComponent * numpy.sin(theta),
        rComponent * numpy.sin(theta) + thetaComponent * numpy.cos(theta))
    # ax.quiverkey(q, X=0.3, Y=1.1, U=1,label='Quiver key, length = 1', labelpos='E')
