Project Name: BlackBoxGame
Author: Casey Cheek
Date: 08/06/2020
Class: CS162 - Introduction to Computer Science II

Requirement Summary:
	Implement the Black Box abstract board game as described in Project_Requirements.md.

Project Description:
	BlackBoxGame represents the game Black Box, an abstract board game that simulates shooting rays into a black box to deduce the locations of "atoms" hidden inside. The game board is represented as a 10x10 grid, wherein atoms may exist at specified locations within the inner 8x8 grid. The guessing player starts with 25 points. One point is deducted each time a ray crosses a novel entry or exit square. An incorrect atom location guess results in a five point deduction. Rays may hit an atom, be deflected 90 degrees by a near miss of an atom, be reflected back to the entry point by the near miss of an atom near the border, and/or may exit the game board.
	
How To Run:
	This game is run through a command line interface. Ensure that you have python v3 installed, then run the following command:
$ python3 BlackBoxGame.py

Commands:
board -- Display the game board (caution: this reveals the atom locations!).
score -- Display the current score.
atoms -- Display the number of atoms that haven't been guessed yet.
shoot -- Shoot a ray into the box.
guess -- Guess an atom's location.
help -- Display the command instructions.
exit -- Exit the game.
