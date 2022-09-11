"""
Use the integrators to run a simulation.
"""

import numpy as np
import matplotlib.pyplot as plt

from diatomic import Diatomic

from integrator import VelocityVerlet

# Create a diatomic.
diatomic_1 = Diatomic(2, 1, 1, -1)

# Create a simulation
velocity_verlet = VelocityVerlet(system=diatomic_1, time_step=0.1)

# Run the simulation for 100 steps.
velocity_verlet.run(100)

# Get the analytical velocities for comparison
positions = diatomic_1.analytical_position(np.array(velocity_verlet.times))

# Create a plot comparing analytical positions and positions calculated
# using velocity verlet method.
fig, ax = plt.subplots()
ax.plot(
    velocity_verlet.times,
    velocity_verlet.trajectory,
    marker="o",
    label="Velocity Verlet",
    color="#00B0DA",
)
ax.plot(velocity_verlet.times, positions, label="Analytical positions")
ax.legend()

fig.savefig("velocity_verlet.png", dpi=300)
