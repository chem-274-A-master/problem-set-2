"""
A class to represent a diatomic molecule.
"""

import math

import numpy as np

from typing import Union


class DiatomicMassError(ValueError):
    pass


class Diatomic:
    def __init__(
        self,
        reduced_mass: Union[int, float],
        force_constant: Union[int, float],
        initial_separation: Union[int, float],
        initial_velocity: Union[int, float],
    ):

        if reduced_mass <= 0:
            raise DiatomicMassError("Invalid mass for diatomic.")

        # Input quantities (constants)
        self.reduced_mass = reduced_mass
        self.force_constant = force_constant
        self.separation = initial_separation
        self.velocity = initial_velocity
        self.total_energy = self.potential_energy() + self.kinetic_energy()

        # Calculated quantities (constants)
        self.omega = math.sqrt(self.force_constant / self.reduced_mass)
        self.amplitude = math.sqrt(2 * self.total_energy / self.force_constant)

        # use atan2 to calculate phi
        self.phi = math.atan2(-initial_velocity, self.omega * initial_separation)
        
    def potential_energy(self):
        # Provided - Problem Set 1
        return 0.5 * self.force_constant * self.separation**2

    def kinetic_energy(self):
        # Provided - Problem Set 1
        return 0.5 * self.reduced_mass * self.velocity**2

    def analytical_position(self, t: Union[ float, np.ndarray ] ):
        # Provided - Problem Set 1
        return self.amplitude * np.cos(self.omega * t + self.phi)

    def analytical_velocity(self, t: Union[ float, np.ndarray ] ):
        # Provided - Problem Set 1
        return -self.amplitude * self.omega * np.sin(self.omega * t + self.phi)

