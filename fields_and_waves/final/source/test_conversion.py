import unittest
import conversion as conv
import numpy
from numpy import pi, sqrt

class TestConversion(unittest.TestCase):
    def test_cartesianToSpherical_xOnly(self):
        actual = conv.cartesianToSpherical(1, 0, 0)
        expected = conv.SphericalCoordinates(r = 1, pitch = pi/2, yaw = 0)

        numpy.testing.assert_array_almost_equal(actual, expected)


    def test_cartesianToSpherical_yOnly(self):
        actual = conv.cartesianToSpherical(0, 1, 0)
        expected = conv.SphericalCoordinates(r = 1, pitch = pi/2, yaw = pi/2)

        numpy.testing.assert_array_almost_equal(actual, expected)


    def test_cartesianToSpherical_zOnly(self):
        actual = conv.cartesianToSpherical(0, 0, 1)
        expected = conv.SphericalCoordinates(r = 1, pitch = 0, yaw = 0)

        numpy.testing.assert_array_almost_equal(actual, expected)

        
    def test_cartesianToSpherical_each(self):
        actual = conv.cartesianToSpherical(sqrt(2)/2, -sqrt(2)/2, 0)
        expected = conv.SphericalCoordinates(r = 1, pitch = pi/2, yaw = -pi/4)

        numpy.testing.assert_array_almost_equal(actual, expected)
       

    def test_waveNumber_14Ghz(self):
        frequency = 14E9
        wavelength = conv.frequencyToWavelength(frequency)

        actual = conv.waveNumber(wavelength)
        expected = 2*pi / (conv.c/frequency)

        numpy.testing.assert_almost_equal(actual, expected)
         

if __name__ == '__main__':
    unittest.main()
