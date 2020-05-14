import numpy
from numpy import pi, sin, cos, arccos, arctan2, sqrt
from collections import namedtuple

c = 2.99792458E8

def frequencyToWavelength(frequency):
    return c/frequency

def wavelengthToFrequency(wavelength):
    return c/wavelength

def waveNumber(wavelength):
    return 2*pi / wavelength

SphericalCoordinates = namedtuple('SphericalCoordinates', ['r', 'pitch', 'yaw'])
CartesianCoordinates = namedtuple('CartesianCoordinates', ['x', 'y', 'z'])

def sphericalToCartesian(r, yaw, pitch):
    x = r * cos(yaw) * sin(pitch)
    y = r * sin(yaw) * sin(pitch)
    z = r * cos(pitch)
    return CartesianCoordinates(x, y, z)

def sphericalVectorToCartesian(r, yaw, pitch):
    x = r[0] * cos(yaw) * sin(pitch)
    y = r[1] * sin(yaw) * sin(pitch)
    z = r[2] * cos(pitch)
    return CartesianCoordinates(x, y, z)

def cartesianToSpherical(x, y, z):
    r = sqrt(x**2 + y**2 + z**2)
    pitch = arccos(z / r)
    yaw = arctan2(y, x)
    return SphericalCoordinates(r, pitch, yaw)
