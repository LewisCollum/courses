import unittest
from . import patch as pt
import numpy
from numpy import pi, sqrt
from . import conversion as conv

class TestPatchBuilder(unittest.TestCase):
    def setUp(self):
        rtDuroid5880 = pt.Material(
            relativePermittivity = 2.2,
            height = 0.1588E-2)
        patchBuilder = pt.PatchBuilder(rtDuroid5880)
        
        self.frequency = 10E9
        self.patch = patchBuilder.buildForFrequency(self.frequency)
        self.radiation = pt.PatchRadiation(self.patch, resolution = 501)
        self.plotter = pt.RadiationPlotter(self.radiation)
        
    def test_rtDuroid5880Build_matchesBalanisTextbook(self):
        actual = self.patch
        expected = pt.Patch(
            width = 1.186E-2,
            height = 0.1588E-2,
            length = 0.906E-2,
            effectiveLength = 1.068E-2,
            waveNumber = conv.waveNumber(conv.frequencyToWavelength(10E9)))

        # print(f"Patch = {actual}")
        # print(f"wavelength = {conv.frequencyToWavelength(self.frequency)}")
        numpy.testing.assert_array_almost_equal(actual, expected, 3)

    def test_plotHPlane(self):
        self.plotter.plotHPlane()#'figure/patch_hPlane.png')

    def test_plotEPlane(self):
        self.plotter.plotEPlane()#'figure/patch_ePlane.png')

    def test_plotTotal(self):
        self.plotter.plotTotal()#'figure/patch_total.png')

if __name__ == '__main__':
    unittest.main()
