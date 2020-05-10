import numpy
from numpy import pi, sin, cos, sqrt
from collections import namedtuple
import conversion as conv
from matplotlib import pyplot
from mpl_toolkits.mplot3d import Axes3D

Patch = namedtuple('Patch', ['width', 'height', 'length', 'effectiveLength', 'waveNumber'])
Material = namedtuple('Material', ['relativePermittivity', 'height'])

class RadiationPlotter:
    def __init__(self, patchRadiation):
        self.radiation = patchRadiation

    def plotHPlane(self, fileName = None):
        hPlane = self.radiation.hPlane()
        figure = pyplot.figure(figsize=(4,3))
        axes = figure.add_subplot(111, projection='polar')
        axes.plot(hPlane.pitch, hPlane.r)
        axes.set_thetamax(180)
        axes.set_xlabel(r'$\theta$')
        figure.tight_layout()
        self.showOrSave(fileName)

    def plotEPlane(self, fileName = None):
        ePlane = self.radiation.ePlane()
        figure = pyplot.figure(figsize=(4,3))
        axes = figure.add_subplot(111, projection='polar')
        axes.plot(ePlane.yaw, ePlane.r)
        axes.set_thetamin(-90)
        axes.set_thetamax(90)
        axes.set_xlabel(r'$\phi$')        
        figure.tight_layout()
        self.showOrSave(fileName)

    def plotTotal(self, fileName = None):
        total = self.radiation.totalAsCartesian()
        figure = pyplot.figure(figsize=(5,4))
        axes = figure.add_subplot(111, projection='3d')        
        axes.plot_surface(total.z, total.y, total.x)
        axes.set_xlabel('z (along width)')
        axes.set_ylabel('y (along length)')
        axes.set_zlabel('x (along height)')
        figure.tight_layout()
        self.showOrSave(fileName)
        
    def showOrSave(self, fileName):
        if fileName:
            pyplot.savefig(fileName)
            pyplot.clf()
        else:
            pyplot.show()        
        
        
class PatchRadiation:
    def __init__(self, patch, resolution):
        self.patch = patch
        self.resolution = resolution        
        self.pitch = numpy.linspace(0, pi, resolution)
        self.yaw = numpy.linspace(-pi/2, pi/2, resolution)
 
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
        radiation = ePlane * hPlane * self.rolloff(self.yaw, 0.5)
        return conv.SphericalCoordinates(
            r = numpy.nan_to_num(radiation),
            yaw = yaw,
            pitch = pitch)

    def totalAsCartesian(self):
        total = self.totalAsSpherical()
        x, y, z = conv.sphericalToCartesian(
            r = total.r,
            yaw = total.yaw,
            pitch = total.pitch)
        return conv.CartesianCoordinates(x, y, z)
        
    def rolloff(self, radians, factor):
        degrees = numpy.rad2deg(radians)
        F1 = 1 / (((factor*(abs(degrees) - 90))**2) + 0.001)
        return 1 / (F1 + 1)
       


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
