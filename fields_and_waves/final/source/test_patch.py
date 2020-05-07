import unittest
import patch as pt
import numpy
from numpy import pi, sqrt

class TestPatchBuilder(unittest.TestCase):
    def test_buildPatch(self):
        material = pt.Material(
            relativePermittivity = 3.4,
            height = 0.11E-3)
        patchBuilder = pt.PatchBuilder(material)

        patch = patchBuilder.buildForFrequency(14E9)
        print(patch)

if __name__ == '__main__':
    unittest.main()
