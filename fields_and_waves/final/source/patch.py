import numpy
from numpy import pi, sin, cos, sqrt
from collections import namedtuple
from . import conversion as conv
from scipy.integrate import simps

Patch = namedtuple('Patch', ['width', 'height', 'length', 'effectiveLength', 'waveNumber'])
Material = namedtuple('Material', ['relativePermittivity', 'height'])
 
def rolloff(radians, factor):
    degrees = numpy.rad2deg(radians)
    F1 = 1 / (((factor*(abs(degrees) - 90))**2) + 0.001)
    return 1 / (F1 + 1)
    
class PatchRadiation:
    def __init__(self, patch, resolution):
        self.patch = patch
        self.resolution = resolution
        offset = pi/resolution
        self.pitch = numpy.linspace(offset, pi, resolution, endpoint=False)
        self.yaw = numpy.linspace(-pi/2, pi/2, resolution, endpoint=False)

    def hPlane(self):
        x = self.patch.waveNumber*self.patch.height/2 * sin(self.pitch)
        z = self.patch.waveNumber*self.patch.width/2 * cos(self.pitch)
        magnitudes = sin(self.pitch) * sin(x)/x * sin(z)/z
        return conv.SphericalCoordinates(
            r = magnitudes,
            yaw = 0,
            pitch = self.pitch)

    def ePlane(self):
        x = self.patch.waveNumber*self.patch.height/2 * cos(self.yaw)
        y = self.patch.waveNumber*self.patch.effectiveLength/2 * sin(self.yaw)
        magnitudes = cos(y) * sin(x)/x
        return conv.SphericalCoordinates(
            r = magnitudes,
            yaw = self.yaw,
            pitch = 90)
    
    def totalAsSpherical(self):
        ePlane, hPlane = numpy.meshgrid(self.ePlane().r, self.hPlane().r)
        yaw, pitch = numpy.meshgrid(self.yaw, self.pitch)
        radiation = ePlane * hPlane * rolloff(self.yaw, 0.3)
        return conv.SphericalCoordinates(
            r = numpy.nan_to_num(radiation),
            yaw = yaw,
            pitch = pitch)

    def directivity(self):
        total, pitch, yaw = self.totalAsSpherical()
        total = total/total.max()
        average = simps(simps(total, pitch[:, 0]), yaw[0])
        directivity = 4*numpy.pi/average
        return directivity


class PatchBuilder:
    def __init__(self, material):
        self.eR = material.relativePermittivity
        self.height = material.height

    def buildForFrequency(self, frequency):
        self.setDimensionsFromFrequency(frequency)
        return Patch(
            width = self.width,
            length = self.lengthWithoutFringe,
            height = self.height,
            effectiveLength = self.lengthWithFringe,            
            waveNumber = conv.waveNumber(self.wavelength))


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
