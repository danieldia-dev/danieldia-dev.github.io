---
title: "Project 1 – A Modular Framework for Numerical Exploration of Dynamical Systems (DynamiXplore)"
date: 2025-06-29
draft: false
category: "Project"
image: "lorenz_attractor.jpg" # Optional: path relative to static folder e.g. static/images/project-placeholder.jpg
summary: "DynamiXplore brings the power of Rust to the simplicity of Python for complex systems analysis."
tags: ["Dynamical Systems", "FOSS", "Research Software", "Python", "Rust", "Simulation", "In Progress"]
---

A modern, high-performance Python framework designed to provide a cohesive, end-to-end environment for the study of dynamical systems.

Features:

- High-Performance Core 🚀: Backend written in Rust for C-level speed on intensive calculations.

- Comprehensive Analysis Suite 📈: Includes Lyapunov exponents, permutation entropy, fractal dimensions, and more.

- Pythonic API 🐍: Designed to be intuitive and easy to integrate into the existing Python data science ecosystem.

- Interactive Visualizations 🌐: Built-in plotting functions using Plotly for easy exploration of results.

### Introduction

Scientists and engineers across disciplines — from epidemiology and physics to economics and biology — rely on the numerical exploration of dynamical systems to understand complex phenomena. This exploration typically involves a recurring workflow: defining a model's equations, simulating its behavior over time, and analyzing the resulting trajectory to uncover its fundamental properties, such as stability, periodicity, or the presence of chaos.

In the Python ecosystem, this process has traditionally been fragmented and inefficient. A researcher must often act as a software integrator, manually piecing together disparate tools: `SciPy`'s powerful but general-purpose ODE solvers for simulation, specialized time-series libraries or custom-written scripts for computing metrics like Lyapunov exponents, and plotting libraries like `Matplotlib` to visualize the results. This not only complicates the research workflow but also introduces performance bottlenecks, as numerically intensive analysis in pure Python can be prohibitively slow for long simulations or high-dimensional systems.

`DynamiXplore` was created to address these challenges directly. It is a modern, high-performance Python framework designed to provide a cohesive, end-to-end environment for the study of dynamical systems. Its mission is to streamline the entire research pipeline, allowing scientists to focus on their models and results rather than on the underlying software implementation.

The framework is built on three core pillars:

- **A Unified Interface:** It integrates simulation, advanced ergodic analysis, and interactive visualization into a single, intuitive API.

- **Performance by Design:** It leverages a powerful Rust backend for all computationally intensive tasks, delivering the speed of compiled code without sacrificing the ease-of-use of Python.

- **Accessibility:** The API is intentionally designed to be "Pythonic" and familiar to users of the SciPy stack, lowering the barrier to entry for sophisticated dynamical analysis.

The following overview demonstrates how these principles come together in practice, walking through a typical user's journey from defining a system to analyzing its chaotic nature.

### **1. High-Level Overview: The User's Journey**

The central philosophy of `DynamiXplore` is to separate the _definition_ of a system from its _simulation_ and _analysis_. This modularity allows researchers to focus on their specific problem without reinventing the numerical backend.

A typical user workflow would look like this in Python:

```python
import dynamixplore as dx
import numpy as np

# 1. DEFINE the dynamical system (e.g., Lorenz Attractor)
# The user provides a standard Python function.
def lorenz_system(t, state, sigma=10.0, rho=28.0, beta=8/3):
    x, y, z = state
    dx_dt = sigma * (y - x)
    dy_dt = x * (rho - z) - y
    dz_dt = x * y - beta * z
    return np.array([dx_dt, dy_dt, dz_dt])

# 2. CONFIGURE the simulation
# Set initial conditions, time span, and select a solver.
initial_state = [1.0, 1.0, 1.0]
t_span = (0, 200)
dt = 0.01

# The `Simulation` object orchestrates the call to the Rust backend.
sim = dx.Simulation(
    system_dynamics=lorenz_system,
    initial_state=initial_state,
    t_span=t_span,
    dt=dt,
    solver='RK45' # Choose a high-performance adaptive solver
)

# 3. SIMULATE the system
# This call executes the high-performance Rust core.
trajectory = sim.run()
# `trajectory` is a standard NumPy array for immediate use.

# 4. ANALYZE the results
# Create an analysis object from the trajectory data.
analysis = dx.Analysis(trajectory, dt=dt)

# Compute various ergodic and information-theoretic properties.
# Each of these methods calls a specialized, parallelized Rust function.
lyapunov_spectrum = analysis.lyapunov_spectrum()
invariant_measure_hist, bins = analysis.invariant_measure(dims=[0, 2], bins=100)
perm_entropy = analysis.permutation_entropy(dim=3, delay=1)
ks_entropy_est = np.sum([le for le in lyapunov_spectrum if le > 0]) # Kaplan-Yorke conjecture

# 5. VISUALIZE
# Use built-in, high-level plotting functions.
fig1 = dx.visualize.plot_phase_portrait(trajectory, dims=['x', 'y', 'z'])
fig2 = dx.visualize.plot_lyapunov_convergence(analysis.lyapunov_history)
fig3 = dx.visualize.plot_invariant_measure(invariant_measure_hist, bins)

print(f"Lyapunov Spectrum: {lyapunov_spectrum}")
print(f"Estimated KS-Entropy: {ks_entropy_est}")
print(f"Permutation Entropy: {perm_entropy}")

# fig1.show()
```

This workflow is intuitive for anyone familiar with the SciPy ecosystem but provides a significant performance boost and advanced analysis features not available in standard libraries.

---

### **2. Application Architecture: The Python-Rust Hybrid Model**

The architecture is designed to maximize the user-friendliness of Python and the computational performance of Rust.

#### **Layer 1: Python User-Facing Layer**

- **Role:** High-level API, orchestration, data handling, and visualization.

- **Components:**
    - **`dynamixplore` (Main Package):**
        - `Simulation`: A class to configure and run simulations. It takes user-defined Python functions and parameters.
        - `Analysis`: A class that takes simulation data (as NumPy arrays) and provides methods for analysis (e.g., `lyapunov_spectrum()`, `permutation_entropy()`).
        - `visualize`: A submodule built on **Matplotlib** and **Plotly** for publication-quality static and interactive plots.

    - **Data Structures:** Primarily **NumPy** arrays. This ensures zero-copy data transfer between Python and Rust.

    - **Symbolic Helper (Optional but powerful):** Integration with **SymPy** to allow users to define systems via strings, which are then JIT-compiled into fast numerical functions using `sympy.lambdify`.

#### **Layer 2: The Bridge (PyO3)**

- **Role:** To create seamless, low-overhead bindings between Python and Rust.

- **Technology: PyO3**.

- **Implementation:** A `lib.rs` file in the Rust crate will define `#[pyfunction]` wrappers. These functions will be compiled into a native Python extension module (`.so`, `.pyd`). PyO3 handles all the type conversions (e.g., Python lists/NumPy arrays to Rust `Vec<f64>` or `ndarray::Array`).

#### **Layer 3: Rust Core Engine (`dx_core`)**

- **Role:** The computational powerhouse. This is a compiled Rust library (`crate`) that contains all the numerically intensive algorithms.

- **Components/Modules:**
    - **`integrators`:**
        - Implements various ODE solvers (e.g., Forward Euler, RK4, RK45 Dormand-Prince). These operate on a generic trait `DynamicalSystem` so they can be reused.
        - Tools: **`ndarray`** for state vectors.

    - **`lyapunov`:**
        - Implements algorithms to compute the maximal Lyapunov exponent and the full Lyapunov spectrum (e.g., using continuous QR decomposition).
        - This module will repeatedly call the `integrators` to evolve multiple nearby trajectories.
        - Tools: **`nalgebra`** for linear algebra operations (QR decomposition).

    - **`entropy`:**
        - `permutation_entropy`: A fast implementation for analyzing time-series complexity.
        - `shannon_entropy`: Calculates entropy from a probability distribution (e.g., the invariant measure).

    - **`stats`:**
        - `invariant_measure`: A highly optimized, multi-dimensional histogramming function to estimate the invariant measure from a long trajectory.

    - **`parallel`:**
        - Leverages **Rayon** for easy, data-parallelism. For example, computing Lyapunov exponents for a range of parameters or analyzing independent trajectories can be done in parallel with a single line of code change in Rust (`.iter()` -> `.par_iter()`).
