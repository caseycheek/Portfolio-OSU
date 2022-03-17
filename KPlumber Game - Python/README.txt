Project Name: KPlumber Game
Author: Casey Cheek
Date: 03/07/2021
Class: CS325 - Analysis of Algorithms

Requirement Summary:
	Pick one of the 24 NP-Complete puzzles in Kendall, Parkes, and Spoerer (2008) and implement a program that allows the user to solve the puzzle. Include an algorithm that verifies the user's solution to the puzzle.

Project Description:
	For this project, I have implemented the KPlumber puzzle in Python, which is run with a command line interface. The rules of the game, as well as instructions for how to run the program can be found below. A more in-depth analysis of my verification algorithm can be found in CS325_Project_Report.pdf.

How to run:
	This game is run with a command line interface. Ensure that you have python v3 installed, then run the following command:
$ python3 kplumber.py [your input file .txt]
where [your input file .txt] is the name of your input.
The program will process the input data with the KPlumber class, and print instructions to the console that explain how to interact with the game.

**Recommendation: Use kp1.txt as the input file and try to solve the game by rotating the tiles. Skip to the solved state of the game by exiting, then restarting the game with kp1_solved.txt as input. There is no solving algorithm here, but kp_solved is included as an easy way to check the verify function. To be clear, kp1_solved is the same instance as kp1. The solved version just has all of its tiles rotated into a "safe state".

Input:
Three sample input files have been included in the portfolio project folder:
	kp1.txt - An unsolved instance of the game from Van der Lee (2009).
	kp1_solved.txt - A solved version of kp1 from Van der Lee (2009).
	kp_empty.txt - An empty template for creating additional game instances.
The data for input files must be organized as such:
	Each row of data is separated by a new line.
	Within a row, the tiles of each column are separated by a ','.
	Within a tile, each of its four sides is represented by a '1' (meaning open) or a '0' (meaning closed) in the order up, right, down, left. The sides are separated by spaces. So for example, a tile that is open on its upper and leftmost side but closed on its lower and rightmost side is represented as:
		1 0 0 1

Rules:
	The rules of KPlumber, as described by Kendall, Parkes, and Spoerer (2008), are as follows:
	KPlumber is a computer puzzle game played on an m × n grid of tiles. Each tile in the interior of the grid has four adjoining tiles, the corner tiles have two adjoining tiles, and the edge tiles have three adjoining tiles. At the centre of each tile is an intersection of up to four pipes, each of which runs directly to one of the four sides of the tile. Some tiles have no pipes. Water runs through the pipes and leaks from any that are left open. An open pipe at the edge of a tile that touches an open pipe at the edge of the adjacent tile closes both of the pipes. An action rotates one tile, and the pipes on it, by 90◦. The goal is to arrive at a situation in which all pipes are closed so that there is no leaking water. This is known as a safe state.

Commands:
board -- Displays the game board.
tile -- Displays a specific tile. User must enter the row and column number when prompted (where row is an integer between 0 and the number of rows - 1, and column is an integer between 0 and the number of columns - 1).
rows -- Displays the number of rows on the game board.
columns -- Displays the number of columns on the game board.
rotate -- Rotates a specific tile 90 degrees clockwise. User must enter the row and column number when prompted (where row is an integer between 0 and the number of rows - 1, and column is an integer between 0 and the number of columns - 1).
verify -- Checks if the game board is currently in a solved state.
help -- Displays the available commands and instructions on how to use them.
exit -- Stops the KPlumber program.

Citations:
	Kendall, G., Parkes, A., & Spoerer, K. (2008). A survey of NP-Complete puzzles. ICGA Journal, 31(1), 13–34. https://doi.org/10.3233/icg-2008-31103

	Van der Lee, Martijn (2009). Linkz. VanDerLee.com. http://www.vanderlee.com/linkz/index.html 