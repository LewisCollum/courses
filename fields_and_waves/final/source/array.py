from collections import namedtuple
import numpy
from numpy import sin, cos
from scipy.integrate import simps

from . import conversion as conv
from . import patch as pt

class ArrayRadiation:
    def __init__(self, radiation, wavelength, elements):
        self.radiation, self.pitch, self.yaw = radiation
        self.elements = elements
        self.wavelength = wavelength
        self.waveNumber = conv.waveNumber(wavelength = self.wavelength)
        
    def totalAsSpherical(self):
        return conv.SphericalCoordinates(
            r = numpy.abs(self.arrayFactor()) * self.radiation,
            yaw = self.yaw,
            pitch = self.pitch)
        
    def arrayFactor(self):
        elementSum = 0
        for element in self.elements:
            relativePhase = self.relativePhase(element)
            elementSum += numpy.exp(1j*relativePhase)
        return elementSum.real
        
    def relativePhase(self, element):
        z, y, x = conv.sphericalVectorToCartesian(
            r = element,
            yaw = self.yaw,
            pitch = self.pitch)

        return self.waveNumber * (x + y + z)

    def directivity(self):
        total, pitch, yaw = self.totalAsSpherical()
        total = total/total.max()
        average = simps(simps(total, pitch[:, 0]), yaw[0])
        directivity = 4*numpy.pi/average
        return directivity

    
Element = namedtuple('Element', ['x', 'y', 'z'])
def spacedPositions(shape, spacing):
    offsets = -spacing*(numpy.asarray(shape)-1)/2
    positions = []
    for x in range(shape[0]):
        for y in range(shape[1]):
            for z in range(shape[2]):
                positions.append(Element(
                    x = x*spacing + offsets[0],
                    y = y*spacing + offsets[1],
                    z = z*spacing + offsets[2]))
    return positions
