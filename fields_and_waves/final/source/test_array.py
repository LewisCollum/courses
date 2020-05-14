import unittest
import numpy
from numpy import pi, sqrt

from . import patch as pt
from . import array as pa
from . import conversion as conv

class TestArray(unittest.TestCase):
    def setUp(self):
        rtDuroid5880 = pt.Material(
            relativePermittivity = 2.2,
            height = 0.1588E-2)
        patchBuilder = pt.PatchBuilder(rtDuroid5880)
        
        self.frequency = 10E9
        wavelength = conv.frequencyToWavelength(self.frequency)
        self.patch = patchBuilder.buildForFrequency(self.frequency)
        self.radiation = pt.PatchRadiation(self.patch, resolution = 500)
        print(self.radiation.totalAsSpherical().pitch)
        positions = pa.spacedPositions(
            shape = (1, 1, 5),
            spacing = wavelength*0.5)
        #print(positions)
        
        self.patchArray = pa.ArrayRadiation(
            radiation = self.radiation,
            wavelength = wavelength,
            elements = positions)

        #print(self.patchArray.arrayFactor())
        
        self.plotter = pt.RadiationPlotter(self.patchArray)
        self.plotter.plotTotal()
        print(self.patchArray.directivity())
        
        
    def test_hPlane(self):
        self.plotter.plotHPlane()
    # def test_elementDistance(self):
    #     actual = self.patchArray.elementDistance(pa.Element(0, 0, 0))[0, 0]
    #     expected = 1.0

    #     numpy.testing.assert_almost_equal(actual, expected)

if __name__ == '__main__':
    unittest.main()
