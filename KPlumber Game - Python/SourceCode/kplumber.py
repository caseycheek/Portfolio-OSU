# Author: Casey Cheek
# Date: 3/7/21
# Description: CS325 - Portfolio Project - KPlumber.
# See README.txt for details.

import sys


class KPlumber:
    """Represents the game KPlumber. Takes an input file as a parameter, which
    becomes the initial state of the game board. Responsibilities include:
    A) holding data for the board and the number of rows and columns.
    B) rotating a tile
    C) verifying if the game board is currently in a solved state
    D) returning the board
    E) returning a specific game tile
    F) returning the number of rows and columns in the board
    G) validating user input
    H) printing command instructions to the terminal"""

    def __init__(self, board_input):
        """Holds data for the board, the number of rows, and the number of
        columns. Receives the name of the input file (str) and uses
        process_input to build a nested set of lists for the game board."""
        self._board = self.process_input(board_input)
        self._n_rows = len(self._board)
        self._n_col = len(self._board[0])

    def process_input(self, file_name):
        """Receives an input file name (str) and returns a nested set of lists
        for the game board in the form: board[row][column][side]."""
        board = []
        file_input = list(open(file_name, "r"))
        for i in file_input:
            row = []
            lst = i.split('\n')
            r = lst[0].split(',')
            for j in r:
                c = j.split(' ')
                col = []
                for side in c:
                    col.append(int(side))
                row.append(col)
            board.append(row)
        return board

    def rotate_tile(self, row, col):
        """Receives the row and column indices (int) of the tile to be rotated,
        then rotates that tile 90 degrees clockwise. Returns a confirmation
        message (str)."""
        temp1 = self._board[row][col][0]
        temp2 = self._board[row][col][1]
        for i in range(1, 4):
            temp2 = self._board[row][col][i]
            self._board[row][col][i] = temp1
            temp1 = temp2
        self._board[row][col][0] = temp2
        return ("Tile at row "+str(row)+", column "+str(col)+
                " rotated 90 degrees clockwise.")

    def verify(self):
        """Returns true if the board is currently in a 'safe state' where all
        open tile sides adjoin an open side of the adjacent tile. Otherwise,
        returns false. Uses check_adj as a helper function"""
        game_status = "Solved!"
        ri = 0
        for row in self._board:
            ci = 0
            for col in row:
                si = 0
                for side in col:
                    if side == 1:
                        # Not solved if a tile is open to the edge of the board
                        if (si == 0 and ri == 0) or \
                                (si == 1 and ci == self._n_col - 1) or \
                                (si == 2 and ri == self._n_rows - 1) or \
                                (si == 3 and ci == 0):
                            game_status = "Not solved. Try again."
                            return game_status
                        # Not solved if adjacent tile openings don't match up
                        elif self.check_adj(ri, ci, si) is False:
                            game_status = "Not solved. Try again."
                            return game_status
                    si += 1
                ci += 1
            ri += 1
        return game_status

    def check_adj(self, row, col, side):
        """Receives the row, column, and open side indices (int) of the target
        tile. Determines which adjacent tile to check based on which side of the
        target tile is open. It then checks if this adjacent tile is open on
        the side that is touching the target tile. Returns True if this
        condition is true, otherwise returns false. Helper function for verify."""
        # Upward side is open
        if side == 0:
            # Check downward side of tile above
            return self._board[row - 1][col][2] == 1
        # Right side is open
        elif side == 1:
            # Check left side of tile to the right
            return self._board[row][col + 1][3] == 1
        # Downward side is open
        elif side == 2:
            # Check upward side of tile below
            return self._board[row + 1][col][0] == 1
        # Left side is open
        elif side == 3:
            # Check right side of tile to the left
            return self._board[row][col - 1][1] == 1

    def get_board(self):
        """Returns the board"""
        return self._board

    def get_tile(self, row, col):
        """Receives a row (int) and column (int) index, then returns the tile
        at that position on the board (str)."""
        return str(self._board[row][col])

    def get_n_rows(self):
        """Returns the number of rows on the board."""
        return self._n_rows

    def get_n_cols(self):
        """Returns the number of columns on the board."""
        return self._n_col

    def validate_row_col(self, u_input, row_or_col):
        """Receives input (str) from the user and a string describing the input
        (either "row" or "col"), then checks to see if the input is valid. If
        row is an integer and 0 <= row < total number of rows, then it returns
        True. Otherwise returns False."""
        validate = True
        try:
            int(u_input)
        except ValueError:
            validate = False
        if validate is True:
            if row_or_col == "row":
                if (0 <= int(row) < self.get_n_rows()) is False:
                    validate = False
            if row_or_col == "col":
                if (0 <= int(col) < self.get_n_cols()) is False:
                    validate = False
        return validate

    def print_help(self):
        """Prints the available commands and instructions for how to use them."""
        print("The game board is represented by rows and columns of tiles. \n",
              "Each tile is represented by a set of 4 sides - up, right, \n",
              "down, left (in that order). A 1 or a 0 in these side \n",
              "positions indicates whether the tile is open or closed on \n",
              "that side. For example, a tile with a 1 in the up position \n",
              "means that the tile is open on its upper side. A tile with a \n",
              "0 in the up position means that the tile is closed on its \n",
              "upper side.")
        print()
        print("To display the game board, type:")
        print("board")
        print()
        print("To display a specific tile, type:")
        print("tile")
        print("Then enter the row and column number when prompted (where \n",
              "row is an integer between 0 and the number of rows - 1, and \n",
              "column is an integer between 0 and the number of columns - 1)")
        print()
        print("To display the number of rows on the game board, type:")
        print("rows")
        print()
        print("To display the number of columns on the game board, type:")
        print("columns")
        print()
        print("To rotate a tile 90 degrees clockwise, type:")
        print("rotate")
        print("Then enter the row and column number when prompted (where \n",
              "row is an integer between 0 and the number of rows - 1, and \n",
              "column is an integer between 0 and the number of columns - 1)")
        print()
        print("To check if the game board is currently in a solved state,",
              "type:")
        print("verify")
        print()
        print("To exit KPlumber, type:")
        print("exit")
        print()
        print("To display these instructions again, type:")
        print("help")
        print()


if __name__ == '__main__':
    # Sets up KPlumber such that the user can interact with the game using
    # custom commands on the command line
    input_file = sys.argv[1]
    kp = KPlumber(input_file)
    print("Let's play KPlumber!")
    print("--------------------")
    kp.print_help()
    running = True
    while running is True:
        user_input = input("Please enter a command:")
        if user_input == "board":
            board = kp.get_board()
            for row in board:
                print(row)
        elif user_input == "tile":
            row = input("Enter the row number of the tile:")
            if kp.validate_row_col(row, "row") is True:
                col = input("Enter the column number of the tile:")
                if kp.validate_row_col(col, "col") is True:
                    print("Tile(" + row + ", " + col + ") = " + kp.get_tile(int(row), int(col)))
                else:
                    print("Column number c must be an integer in the range, \n",
                          "0 <= c < total number of columns")
            else:
                print("Row number r must be an integer in the range, \n",
                      "0 <= r < total number of rows")
        elif user_input == "rows":
            print("There are "+str(kp.get_n_rows())+" rows on the board.")
        elif user_input == "columns":
            print("There are "+str(kp.get_n_cols())+" columns on the board.")
        elif user_input == "rotate":
            row = input("Enter the row number of the tile:")
            if kp.validate_row_col(row, "row") is True:
                col = input("Enter the column number of the tile:")
                if kp.validate_row_col(col, "col") is True:
                    print(kp.rotate_tile(int(row), int(col)))
                else:
                    print("Column number c must be an integer in the range, \n",
                          "0 <= c < total number of columns")
            else:
                print("Row number r must be an integer in the range, \n",
                      "0 <= r < total number of rows")
        elif user_input == "verify":
            print(kp.verify())
        elif user_input == "help":
            kp.print_help()
        elif user_input == "exit":
            running = False
        else:
            print("Please enter one of the following commands:")
            print("board")
            print("tile")
            print("rows")
            print("columns")
            print("rotate")
            print("verify")
            print("help")
            print("exit")
