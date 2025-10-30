---
title: "DynamiXplore: A High-Performance Framework for Dynamical Systems"
date: 2025-06-29
draft: false
category: "Project"
image: "lorenz_attractor.jpg"
link: "https://github.com/Kibalchish47/dynamixplore"
summary: "A Python-first toolkit with a high-performance Rust core for the advanced simulation and analysis of complex dynamical systems, including nonsmooth and chaotic phenomena."
tags: ["Dynamical Systems", "FOSS", "Research Software", "Scientific Computing", "Python", "Rust", "PyO3", "Numerical Methods", "In Progress"]
---

### Project Vision

[**DynamiXplore** is a modern, high-performance Python framework](https://github.com/Kibalchish47/dynamixplore) designed to provide a cohesive, end-to-end environment for the study of complex dynamical systems. Its mission is to streamline the entire research pipeline—from model definition to simulation, analysis, and visualization—allowing scientists and engineers to focus on their results rather than wrestling with fragmented software tools.

Developed in collaboration with [**Dr. Theresa Honein**](https://thh00.github.io/) of the AUB Mechanical Engineering department, the project pairs an intuitive, "Pythonic" API with a powerful Rust computational core, delivering elite performance without sacrificing ease of use.

### The Problem: A Fragmented & Inefficient Workflow

Scientists across disciplines—from physics and engineering to economics and biology — rely on numerical simulation to understand complex phenomena. Traditionally in Python, this requires piecing together disparate tools: `SciPy` for ODE solving, specialized libraries for chaos analysis, and `Matplotlib` or `Plotly` for visualization. This workflow is not only cumbersome but also creates significant performance bottlenecks, making the analysis of long, high-dimensional trajectories prohibitively slow.

**DynamiXplore** solves this by offering a single, unified toolkit built for performance from the ground up.

---

### Key Features & Architecture

The framework is built on a hybrid Python-Rust model to offer the best of both worlds: a user-friendly frontend and a computationally formidable backend.

#### 🐍 1. Unified & Pythonic API
All the power of the Rust core is exposed through a clean, intuitive Python API designed to feel familiar to users of NumPy, SciPy, and Pandas. The connection is managed by **PyO3**, which enables zero-copy data transfer between Python's NumPy arrays and Rust's `ndarray`, eliminating data conversion overhead. Users define their system with a simple Python function and use high-level objects like `dx.Simulation` and `dx.Analysis` to orchestrate complex simulations and analyses with just a few lines of code.

#### 🚀 2. High-Performance Rust Core
The computational engine is written entirely in Rust. Initial benchmarks show that for standard ODE solving, the core is **2-3x faster than SciPy's established solvers**, and for complex analyses like Lyapunov exponents, it achieves a **speedup of over 10x** compared to existing Python libraries like `nolds`.

-   **Numerical Integrators:** A suite of robust Ordinary Differential Equation (ODE) solvers forms the simulation backbone. This includes:
    -   **Explicit/Implicit Euler Methods:** Foundational for simple systems or as a baseline.
    -   **Runge-Kutta 4 (RK4):** A classic workhorse providing an excellent balance of accuracy and computational cost for a wide range of problems.
    -   **Adaptive Runge-Kutta-Fehlberg (RK45):** A powerful adaptive-step solver that automatically adjusts its step size to maintain a specified error tolerance, making it highly efficient for systems with both slow and rapidly changing dynamics.

-   **Advanced Analysis Suite:** The framework provides native, highly optimized functions for characterizing system dynamics from the generated time-series data:
    -   **Full Lyapunov Spectrum:** Implements a robust version of **Benettin's algorithm**, which uses continuous Gram-Schmidt orthonormalization to track the divergence of nearby trajectories. This yields the full spectrum of Lyapunov exponents, rigorously quantifying the system's chaotic nature and its rate of information generation.
    -   **Entropy Measures:** Includes tools like **Permutation Entropy** to measure the complexity and predictability of a time series based on ordinal patterns, and **Approximate Entropy** to quantify regularity and determinism.
    -   **Invariant Measure Estimation:** Estimates the long-term statistical behavior of the system by computing its **invariant measure**. This is achieved using highly optimized, parallelized multi-dimensional histogramming, revealing the regions of the phase space the attractor is most likely to occupy.

#### 🌐 3. Publication-Ready Interactive Visualizations
Generate insightful, interactive plots with a single line of code using the built-in Plotly backend. Effortlessly create 2D and 3D phase portraits, recurrence plots, and bifurcation diagrams that allow for deep, interactive exploration of complex, fractal attractor structures.

---

### Why Rust? The Technical Advantage
The choice of Rust for the computational core was deliberate, based on three key pillars that are critical for scientific software:

-   **Performance:** Rust is blazingly fast and memory-efficient. With no runtime or garbage collector, it provides predictable, C-like speed essential for performance-critical tasks. This allows `DynamiXplore` to power long-running simulations on high-dimensional systems, run on resource-constrained embedded devices, and easily integrate with other languages.

-   **Reliability:** Rust’s rich type system and revolutionary **ownership model** guarantee memory-safety and thread-safety at compile-time. For scientific computing, this is a game-changer. It eliminates entire classes of subtle, hard-to-debug errors—like data races in parallel code or dangling pointers—that can corrupt results and undermine scientific validity. This compile-time verification ensures that the numerical core is robust and trustworthy.

-   **Productivity:** Rust combines high performance with a modern developer experience. It features excellent documentation, a friendly compiler with uniquely helpful error messages, and top-notch tooling. **Cargo**, its integrated package manager and build tool, simplifies dependency management, while `PyO3` provides a seamless and low-overhead bridge to Python. This allows `DynamiXplore` to have the best of both worlds: Python's rapid prototyping and ease of use in the frontend, backed by Rust's unmatched performance and safety in the backend.

---

### Example Workflow: Analyzing the Lorenz Attractor

The following example demonstrates the end-to-end workflow for simulating the classic Lorenz system and computing its key chaotic indicators.

```python
import numpy as np
import dynamixplore as dx

# --- 1. Define the dynamical system ---
# The user provides a standard Python function representing the ODEs.
def lorenz_system(t: float, state: np.ndarray) -> np.ndarray:
    """The classic Lorenz chaotic attractor."""
    sigma, rho, beta = 10.0, 28.0, 8.0 / 3.0
    x, y, z = state
    dx_dt = sigma * (y - x)
    dy_dt = x * (rho - z) - y
    dz_dt = x * y - beta * z
    return np.array([dx_dt, dy_dt, dz_dt])

# --- 2. Configure and run the simulation ---
print("="*50)
print("SYSTEM: Lorenz Attractor")
print("="*50)

sim = dx.Simulation(
    dynamics_func=lorenz_system,
    initial_state=[1.0, 1.0, 1.0],
    t_span=(0.0, 50.0),
    dt=0.01
)

print("Running adaptive RK45 simulation...")
# This call executes the high-performance Rust core
trajectory, times = sim.run(solver='RK45', mode='Adaptive', abstol=1e-8, reltol=1e-8)
print(f"Simulation complete. Generated {len(times)} points.")


# --- 3. Analyze the results ---
analysis_obj = dx.Analysis(trajectory=trajectory, t=times)

# Compute the full Lyapunov spectrum to confirm chaotic behavior
print("\nComputing Lyapunov spectrum...")
spectrum, history = analysis_obj.lyapunov_spectrum(
    dynamics=lorenz_system,
    t_transient=10.0,  # Time to let trajectory settle onto the attractor
    t_total=1000.0,    # Total simulation time for convergence
    t_reorth=1.0       # Re-orthonormalization interval
)
print(f"Lyapunov spectrum computed: {np.round(spectrum, 4)}")

# Estimate the Kolmogorov-Sinai (KS) entropy from the positive exponents
ks_entropy_est = np.sum([le for le in spectrum if le > 0])
print(f"Estimated KS-Entropy from spectrum: {ks_entropy_est:.4f}")

# Compute other statistical measures
print("\nComputing entropy and statistical measures...")
perm_entropy = analysis_obj.permutation_entropy(dim=0, m=3, tau=1)
print(f"Permutation Entropy (x-dimension, m=3, tau=1): {perm_entropy:.4f}")

hist, x_bins, y_bins = analysis_obj.invariant_measure(epsilon=0.5, dims=(0, 1))
print(f"Invariant measure computed. Found {np.count_nonzero(hist)} populated bins.")

# --- 4. Visualize ---
# fig = dx.visualize.plot_phase_portrait(trajectory, dims=['x', 'y', 'z'])
# fig.show()
```
