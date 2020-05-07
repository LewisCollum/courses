import numpy
from numpy import pi, sqrt
from collections import namedtuple
import conversion as conv

Patch = namedtuple('Patch', ['effective', 'actual'])
Dimensions = namedtuple('Dimensions', ['width', 'length', 'height'])
Material = namedtuple('Material', ['relativePermittivity', 'height'])

class PatchBuilder:
    def __init__(self, material):
        self.eR = material.relativePermittivity
        self.height = material.height

    def buildForFrequency(self, frequency):
        self.setDimensionsFromFrequency(frequency)
        return Patch(
            effective = Dimensions(
                width = self.width,
                length = self.lengthWithFringe,
                height = self.heightEffective),
            actual = Dimensions(
                width = self.width,
                length = self.lengthWithoutFringe,
                height = self.height))

    
    def setDimensionsFromFrequency(self, frequency):
        self.wavelength = conv.frequencyToWavelength(frequency)
        self.width = self.widthFromWavelength(self.wavelength)
        widthToThicknessRatio = self.width/self.height
        
        eEff = self.effectiveRelativePermittivity(widthToThicknessRatio)
        self.lengthWithFringe = self.lengthEffective(self.wavelength, eEff)

        fringeExtension = self.fringeExtension(eEff, widthToThicknessRatio)
        self.lengthWithoutFringe = self.lengthWithFringe - 2*fringeExtension

        
    def widthFromWavelength(self, wavelength):
        return wavelength/2 * sqrt(2/(self.eR + 1))

    
    def effectiveRelativePermittivity(self, widthToThicknessRatio):
        linear = (self.eR + 1)/2
        coefficient = (self.eR - 1)/2
        nonlinear = (1 + 12/widthToThicknessRatio)**(-1/2)        
        return linear + coefficient*nonlinear

    
    def lengthEffective(self, wavelength, eEff):
        return wavelength/2/sqrt(eEff)

    
    def fringeExtension(self, eEff, widthToThicknessRatio):
        numerator = (eEff + 0.3)*(widthToThicknessRatio + 0.264)
        denominator = (eEff - 0.258)*(widthToThicknessRatio + 0.8)
        extension = 0.412 * self.height * numerator/denominator
        return extension

    @property
    def heightEffective(self):
        return self.height*sqrt(self.eR)
