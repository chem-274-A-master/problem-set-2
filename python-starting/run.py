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
velocity_verlet.run(1000)

# Get the analytical velocities for comparison
positions = diatomic_1.analytical_position(np.array(velocity_verlet.times))
velocities = diatomic_1.analytical_velocity(np.array(velocity_verlet.times))

# Create plots comparing analytical positions/velocities
# and positions/velocities calculated
# using velocity verlet method.
fig, ax = plt.subplots()
ax.plot(
    velocity_verlet.times,
    velocity_verlet.trajectory,
    marker="o",
    label="Velocity Verlet Positions",
    color="#00B0DA",
)
ax.plot(velocity_verlet.times, positions, label="Analytical positions")
ax.legend()

fig2, ax2 = plt.subplots()
ax2.plot(
    velocity_verlet.times,
    velocity_verlet.velocities,
    marker="o",
    label="Velocity Verlet Velocities",
    color="#e30202",
)
ax2.plot(velocity_verlet.times, velocities, label="Analytical velocities", color="#6f0202")
ax.legend()
ax2.legend()

fig.savefig("velocity_verlet_positions.png", dpi=300)
fig2.savefig("velocity_verlet_velocities.png", dpi=300)