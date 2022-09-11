"""
Classes for molecular dynamics integrators.
"""

from diatomic import Diatomic


class IntegratorBaseClass:
    """A Base class for molecular dynamics integrators."""

    def __init__(self, system: Diatomic, time_step: float):
        """
        Base class for molecular dynamics integrator.

        Parameters
        ----------
        diatomic : Diatomic
            The diatomic object.
        time_step: float
            The time step for the integrator.
        """
        self.system = system
        self.time_step = time_step

        # trackers
        self.num_steps: int = 0
        self.trajectory: list = []
        self.kinetic_energy: list = []
        self.potential_energy: list = []
        self.times: list = []
        self.update_trackers()

    def run(self, run_steps: int):
        """
        Run a simulation.

        Parameters
        ----------
        run_steps : int
            The number of steps to run.
        """

        for _ in range(run_steps):
            self.step()
            self.update_trackers()

    def update_trackers(self):
        # Update simulation trackers.
        self.trajectory.append(self.system.separation)
        self.kinetic_energy.append(self.system.kinetic_energy())
        self.potential_energy.append(self.system.potential_energy())
        self.times.append(self.num_steps * self.time_step)
        self.num_steps += 1

    def step(self):
        """Implement MD integration algorithm in step method of child classes."""
        raise NotImplementedError("This method is not yet implemented.")
