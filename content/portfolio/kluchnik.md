---
title: "TRNG-PassGen: A Hardware-Based Cryptographically Secure Password Generator"
date: 2025-08-06
draft: false
category: "Project"
image: "kluchnik.png" # Optional: path relative to static folder e.g. /images/trng_project_image.jpg
summary: "A full-stack, end-to-end system for generating cryptographically secure passwords based on true physical randomness, designed to be resilient against quantum computing threats."
tags: ["C++", "Rust", "ESP32", "Cryptography", "TRNG", "Embedded Systems", "Networking", "Desktop App", "UI/UX", "Security", "AES"]
---

Developed as a final team project for the 'Digital Electronics' track of an international educational exchange at the AIEO “Phystech-Lyceum” of Natural Sciences and Mathematics named after P.L. Kapitza, this project is a complete system for generating secure passwords. It's built on **true physical randomness** to address the vulnerabilities of software-based pseudo-random number generators (PRNGs), particularly in the face of emerging quantum computing threats.

The system demonstrates a full-stack approach to a real-world security problem, spanning from low-level hardware interaction and embedded C++ programming to high-level, secure network communication and modern desktop application development in Rust.

---

### System Architecture

The project consists of two primary components that work together to create a seamless and secure user experience.

#### 1. Embedded TRNG Device (C++ / ESP32)

The core of the system is a custom-built hardware device that generates truly random data.

* **🌪️ Entropy Harvesting:** Gathers true entropy from unpredictable physical sources, including motion data from an **MPU-6050** accelerometer/gyroscope and electronic noise from oscillator jitter.
* **⚙️ Random Number Generation:** Utilizes a motion-controlled 'gated counter' on an **ESP32** microcontroller to process the raw entropy into random bytes.
* **🔒 On-Device Encryption:** Secures the generated 128-bit random key on the device itself using **AES-128-CBC** encryption via the `mbedtls` library.
* **📡 Secure Communication:** Hosts its own Wi-Fi Access Point and a TCP server for secure data transmission to the client application. It also features a small OLED screen for a user interface.

---

#### 2. Desktop Client Application (Rust)

A cross-platform desktop application provides the user interface and final password generation.

* **🦀 Modern & Asynchronous:** Developed in **Rust** with an asynchronous graphical user interface (GUI) using the **Iced** and **Tokio** frameworks.
* **🔗 Secure Connection & Decryption:** Connects directly to the hardware device's TCP server, receives the encrypted data, and decrypts the AES key.
* **📱 Password Generation & Display:** Uses the decrypted random key to generate a final, secure password. It displays the password along with a scannable **QR code** for easy use on mobile devices.
* **🎨 Custom UI & Remote Control:** Features a full remote control for the hardware device and a custom user interface with switchable light and dark themes.

---

### Technologies & Skills

* **Languages:** C++, Rust, C
* **Hardware & Embedded:** ESP32 Microcontrollers, Digital Circuit Design, Soldering, 3D Printing, EasyEDA
* **Security & Networking:** Cryptography, Encryption (AES), TCP/IP Networking
* **Software & Design:** UI/UX Design
* **Professional:** Teamwork, Communication, Leadership

### Links

[GitHub - Kibalchish47/kluchnik: C++ firmware for a hardware TRNG that generates random bytes from physical motion, encrypts them with AES-CBC, and transmits them via a Wi-Fi TCP server.](https://github.com/Kibalchish47/kluchnik)

[GitHub - Kibalchish47/kluchnik-rs: A cross-platform Rust GUI client (Iced) for the Kluchnik hardware TRNG, featuring TCP data reception, AES-CBC decryption, password generation, and remote device control.](https://github.com/Kibalchish47/kluchnik-rs)

[The Project's Final Presentation](https://github.com/Kibalchish47/Kibalchish47.github.io/tree/main/static/Kluchnik_Final_Presentation.pdf)
