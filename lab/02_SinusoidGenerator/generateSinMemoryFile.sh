#!/usr/bin/env bash
python -c "from numpy import arange, sin; [print(f'{x},') for x in sin(arange(255))]" > sin.mif
