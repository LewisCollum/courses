from matplotlib import pyplot
from mpl_toolkits.mplot3d import Axes3D
import numpy
from numpy import pi

from . import conversion as conv

class RadiationPlotter:
    def __init__(self, patchRadiation):
        self.radiation = patchRadiation

    def plotHPlane(self, fileName = None):
        hPlane = self.radiation.hPlane()
        radius = self.dB(hPlane.r)
        nanMask = ~numpy.isnan(radius)
        figure = pyplot.figure(figsize=(4,3))
        axes = figure.add_subplot(111, projection='polar')
        axes.plot(hPlane.pitch[nanMask], radius[nanMask])
        axes.set_thetamax(180)
        axes.set_xticks([0, pi/2, pi])
        axes.set_yticks(numpy.linspace(numpy.round(numpy.min(radius[nanMask])), 0, 3))
        axes.set_xlabel(r'$\theta$')
        axes.set_ylabel('dB')
        figure.tight_layout()
        self.showOrSave(fileName)

    def plotEPlane(self, fileName = None):
        ePlane = self.radiation.ePlane()
        figure = pyplot.figure(figsize=(4,3))
        axes = figure.add_subplot(111, projection='polar')
        axes.plot(ePlane.yaw, self.dB(ePlane.r))
        axes.set_thetamin(-90)
        axes.set_thetamax(90)
        axes.set_xlabel(r'$\phi$')
        axes.set_ylabel('dB')        
        figure.tight_layout()
        self.showOrSave(fileName)

    def plotTotal(self, fileName = None):
        total = self.radiation.totalAsSpherical()
        normalized = total.r/total.r.max()
        x, y, z = conv.sphericalToCartesian(
            r = normalized,
            yaw = total.yaw,
            pitch = total.pitch)        
        figure = pyplot.figure(figsize=(5,4))
        axes = figure.add_subplot(111, projection='3d')        
        axes.plot_surface(z, y, x, rcount=100, ccount=100)
        axes.set_xlabel('z (along width)')
        axes.set_ylabel('y (along length)')
        axes.set_zlabel('x (along height)')
        axes.set_zlim(0, 1)
        axes.set_ylim(-0.5, 0.5)
        axes.set_xlim(-0.5, 0.5)

        figure.tight_layout()
        self.showOrSave(fileName)

    def dB(self, value):
        return 10 * numpy.log10(value)
        
    def showOrSave(self, fileName):
        if fileName:
            pyplot.savefig(fileName)
            pyplot.clf()
        else:
            pyplot.show()
