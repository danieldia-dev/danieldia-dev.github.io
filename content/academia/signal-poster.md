---
title: "Poster: Mathematically Proving the Security of the Signal Messaging Protocol"
date: 2025-12-12
draft: false
category: "Talk"
summary: "A poster presentation at AUB's Applied Cryptography course exploring how formal methods and tools like F* are used to mathematically prove the security properties of Signal's cryptographic protocols."
link: "https://doubleratchetsignal.netlify.app/" # Interactive demo
---

As part of the CMPS297AD/396AI Applied Cryptography poster session at AUB, I presented a critical question in modern secure communication: How can we *mathematically prove* that the cryptographic protocols protecting billions of messages are actually secure?

My poster, "_Mathematically Proving the Security of the Signal Messaging Protocol,_" explored how formal verification methods—the same techniques I've been studying through Project Everest and F*—are applied to prove the correctness of real-world cryptographic systems that protect our most sensitive communications.

The poster covered several interconnected ideas:

- **The Signal Protocol Architecture**: I explained how Signal's security relies on two key components working together: X3DH (Extended Triple Diffie-Hellman) for the initial asynchronous key agreement, and the Double Ratchet algorithm for ongoing message encryption. The Double Ratchet provides both Forward Secrecy (past messages remain safe if keys are later compromised) and Post-Compromise Security (future messages are safe even after a key compromise).

- **The Verification Challenge**: The Double Ratchet's stateful, asynchronous nature creates an enormous state space—messages can be lost, duplicated, or arrive out of order. Simple testing cannot provide security guarantees against an active attacker who can manipulate the network. A single logic error in handling edge cases could lead to catastrophic key reuse and complete loss of confidentiality.

- **From Types to Theorems**: Building on the F* formal methods approach, I showed how dependent types allow us to encode security invariants directly into the type system. Through the Curry-Howard Correspondence, a program that successfully type-checks against a complex dependent type is a *formal proof* that the code behaves as specified—the same foundation underlying verified cryptographic implementations like HACL*.

- **Verification in Practice**: I provided concrete examples of what verification looks like at the code level, from proving memory safety (ensuring cryptographic keys are always the correct size at compile-time) to preventing timing attacks (proving that execution time doesn't depend on secret data, eliminating side-channel vulnerabilities).

- **Automated Proof Tools**: The poster detailed the methodology used by cryptographers to verify Signal using tools like ProVerif and Tamarin. These tools symbolically explore every possible protocol state, searching for any violation of defined security properties against a powerful adversary model (Dolev-Yao) with complete control over the network.

- **Real Security Guarantees**: The seminal work by Cohn-Gordon et al. used the Tamarin prover to produce a machine-checked proof that Signal achieves its advertised security goals—strong authentication, confidentiality (IND-CCA), forward secrecy, and post-compromise security. Importantly, this formal analysis caught a subtle "Unknown Key-Share" attack in Signal's predecessor TextSecure that was missed by informal analysis.

- **The Post-Quantum Future**: I explored how Signal is evolving to defend against quantum computers through PQXDH (post-quantum X3DH) using ML-KEM, and the upcoming Triple Ratchet with its Sparse Post-Quantum Ratchet (SPQR). Most exciting from a verification perspective: the new protocol was co-designed with formal verification using ProVerif, and the implementation is continuously verified in CI by translating Rust code to F* using `hax`—the same toolchain I've been using in my own cryptographic verification work.

To make these concepts more tangible, I built an **interactive web visualization** of the Double Ratchet protocol that demonstrates how messages flow through the symmetric and Diffie-Hellman ratchets. The demo is mobile-responsive and includes all academic references.

[Explore the interactive Double Ratchet demo here!](https://doubleratchetsignal.netlify.app/)

[View the full poster (PDF)](https://github.com/danieldia-dev/danieldia-dev.github.io/blob/main/static/academia/CMPS297AD_poster_dark.pdf)

This work represents the convergence of several themes I'm passionate about: formal verification, cryptographic systems, and making complex theoretical concepts accessible to practitioners. It's particularly exciting to see how the same verification techniques I've been studying—dependent types, F*, and automated provers—are being applied to secure the communications of billions of people in the real world.