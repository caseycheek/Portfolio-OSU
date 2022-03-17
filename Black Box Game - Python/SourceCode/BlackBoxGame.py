# Author: Casey Cheek
# Date: 8/6/2020
# Description: BlackBoxGame represents the game Black Box; an abstract board game that simulates shooting rays into a
# black box to deduce the locations of "atoms" hidden inside. The game board is represented as a 10x10 grid, wherein
# atoms may exist at specified locations within the inner 8x8 grid. The guessing player starts with 25 points. One point
# is deducted each time a ray crosses a novel entry or exit square. An incorrect atom location guess results in a five
# point deduction. Rays may hit an atom, be deflected 90 degrees by a near miss of an atom, be reflected back to the
# entry point by the near miss of an atom near the border, and/or may exit the game board.


class BlackBoxGame:
    """Represents the game Black Box played on a 10x10 grid. Takes a list of atom locations as a parameter, with each
    location represented by a tuple in the form (row, column). Responsibilities include:
    A) holding data for atom, board, score, and entry/exit attributes
    B) making "shoot ray" moves that obey the rules of the game
    C) guessing atom locations
    D) returning the current score
    E) returning the number of undiscovered atoms
    F) printing the game board"""
    def __init__(self, atom_locations):
        """Holds data for atom, board, score, and entry/exit attributes. Takes a list of atom locations as a parameter,
        with each location represented by a tuple in the form (row, column)."""
        self._atom_locations = atom_locations

        # Initializes the board
        board_lists = []
        for row in range(0, 10):
            board_lists.append(['_'] * 10)
        self._board_lists = board_lists

        # Adds atom locations to the board
        for atom in self._atom_locations:
            self._board_lists[atom[0]][atom[1]] = 'A'

        # Initializes the score
        self._score = 25

        # Keeps track of previous entries and exits
        self._entries_exits = []

        # Keeps track of the number of undiscovered atoms
        self._undiscovered_atoms = len(self._atom_locations)

        # Keeps track of atom guesses
        self._guesses = []

    def shoot_ray(self, row, column):
        """Shoots a ray into the box from the edge of the box at the specified square. Takes as parameters the row and
        column of the border square where the ray originates. Returns False if the chosen row and column designate a
        corner square or a non-border square. Otherwise, it calls the appropriate directional shooting function which
        returns a tuple of the row and column of the exit border square or returns None if there is a hit. Then the
        guessing player's score is adjusted accordingly."""
        # Shoot down from the top at row 0
        if row == 0 and (0 < column < 9):
            if (row, column) not in self._entries_exits:
                self._score -= 1
                self._entries_exits.append((row, column))
            return self.shoot_down(row, column)

        # Shoot up from the bottom at row 9
        elif row == 9 and (0 < column < 9):
            if (row, column) not in self._entries_exits:
                self._score -= 1
                self._entries_exits.append((row, column))
            return self.shoot_up(row, column)

        # Shoot right from the left at column 0
        elif column == 0 and (0 < row < 9):
            if (row, column) not in self._entries_exits:
                self._score -= 1
                self._entries_exits.append((row, column))
            return self.shoot_right(row, column)

        # Shoot left from the right at column 9
        elif column == 9 and (0 < row < 9):
            if (row, column) not in self._entries_exits:
                self._score -= 1
                self._entries_exits.append((row, column))
            return self.shoot_left(row, column)

        else:
            return False

    def shoot_down(self, row, column):
        """Shoots a ray in a downward/southward direction from the specified square. Takes as parameters the row and
        column of the square where the ray originates. Called only by shoot_ray (and directional shooting
        functions if ray is deflected inside the box). Returns a tuple of the row and column of the exit border square,
        returns None if there is a hit, or calls the appropriate directional shooting function if deflected by an atom's
        corner square. Then the guessing player's score is adjusted accordingly."""
        sq_row = row
        sq_col = column
        board = self._board_lists

        while (sq_row + 1) < 9:
            # If the ray hits an atom, return None
            if board[sq_row + 1][sq_col] == 'A':
                return None
            # If ray hits the squares adjacent to an atom on the border, reflect back
            elif (sq_row + 1) == 1 and (board[sq_row + 1][sq_col + 1] == 'A' or board[sq_row + 1][sq_col - 1] == 'A'):
                exit_square = (sq_row, sq_col)
                return exit_square
            # If ray enters atom's NW square, deflect left
            elif board[sq_row + 1][sq_col + 1] == 'A':
                return self.shoot_left(sq_row, sq_col)
            # If ray enters atom's NE square, deflect right
            elif board[sq_row + 1][sq_col - 1] == 'A':
                return self.shoot_right(sq_row, sq_col)
            # Next row
            sq_row += 1

        # Ray has reached end of the board
        exit_square = (sq_row + 1, sq_col)
        if exit_square not in self._entries_exits:
            self._score -= 1
            self._entries_exits.append(exit_square)
        return exit_square

    def shoot_up(self, row, column):
        """Shoots a ray in an upward/northward direction from the specified square. Takes as parameters the row and
        column of the square where the ray originates. Called only by shoot_ray (and directional shooting
        functions if ray is deflected inside the box). Returns a tuple of the row and column of the exit border square,
        returns None if there is a hit, or calls the appropriate directional shooting function if deflected by an atom's
        corner square. Then the guessing player's score is adjusted accordingly."""
        sq_row = row
        sq_col = column
        board = self._board_lists

        while (sq_row - 1) > 0:
            # If the ray hits an atom, return None
            if board[sq_row - 1][sq_col] == 'A':
                return None
            # If ray hits the squares adjacent to an atom on the border, reflect back
            elif (sq_row - 1) == 8 and (board[sq_row - 1][sq_col + 1] == 'A' or board[sq_row - 1][sq_col - 1] == 'A'):
                exit_square = (sq_row, sq_col)
                return exit_square
            # If ray enters atom's SW square, deflect left
            elif board[sq_row - 1][sq_col + 1] == 'A':
                return self.shoot_left(sq_row, sq_col)
            # If ray enters atom's SE square, deflect right
            elif board[sq_row - 1][sq_col - 1] == 'A':
                return self.shoot_right(sq_row, sq_col)
            # Next row
            sq_row -= 1

        # Ray has reached end of the board
        exit_square = (sq_row - 1, sq_col)
        if exit_square not in self._entries_exits:
            self._score -= 1
            self._entries_exits.append(exit_square)
        return exit_square

    def shoot_right(self, row, column):
        """Shoots a ray in an rightward/westward direction from the specified square. Takes as parameters the row and
        column of the square where the ray originates. Called only by shoot_ray (and directional shooting
        functions if ray is deflected inside the box). Returns a tuple of the row and column of the exit border square,
        returns None if there is a hit, or calls the appropriate directional shooting function if deflected by an atom's
        corner square. Then the guessing player's score is adjusted accordingly."""
        sq_row = row
        sq_col = column
        board = self._board_lists

        while (sq_col + 1) < 9:
            # If the ray hits an atom, return None
            if board[sq_row][sq_col + 1] == 'A':
                return None
            # If ray hits the squares adjacent to an atom on the border, reflect back
            elif (sq_col + 1) == 1 and (board[sq_row - 1][sq_col + 1] == 'A' or board[sq_row + 1][sq_col + 1] == 'A'):
                exit_square = (sq_row, sq_col)
                return exit_square
            # If ray enters atom's NW square, deflect up
            elif board[sq_row + 1][sq_col + 1] == 'A':
                return self.shoot_up(sq_row, sq_col)
            # If ray enters atom's SW square, deflect down
            elif board[sq_row - 1][sq_col + 1] == 'A':
                return self.shoot_down(sq_row, sq_col)
            # Next column
            sq_col += 1

        # Ray has reached end of the board
        exit_square = (sq_row, sq_col + 1)
        if exit_square not in self._entries_exits:
            self._score -= 1
            self._entries_exits.append(exit_square)
        return exit_square

    def shoot_left(self, row, column):
        """Shoots a ray in an leftward/eastward direction from the specified square. Takes as parameters the row and
        column of the square where the ray originates. Called only by shoot_ray (and directional shooting
        functions if ray is deflected inside the box). Returns a tuple of the row and column of the exit border square,
        returns None if there is a hit, or calls the appropriate directional shooting function if deflected by an atom's
        corner square. Then the guessing player's score is adjusted accordingly."""
        sq_row = row
        sq_col = column
        board = self._board_lists

        while (sq_col - 1) > 0:
            # If the ray hits an atom, return None
            if board[sq_row][sq_col - 1] == 'A':
                return None
            # If ray hits the squares adjacent to an atom on the border, reflect back
            elif (sq_col - 1) == 8 and (board[sq_row - 1][sq_col - 1] == 'A' or board[sq_row + 1][sq_col - 1] == 'A'):
                exit_square = (sq_row, sq_col)
                return exit_square
            # If ray enters atom's NE square, deflect up
            elif board[sq_row + 1][sq_col - 1] == 'A':
                return self.shoot_up(sq_row, sq_col)
            # If ray enters atom's SE square, deflect down
            elif board[sq_row - 1][sq_col - 1] == 'A':
                return self.shoot_down(sq_row, sq_col)
            # Next column
            sq_col -= 1

        # Ray has reached end of the board
        exit_square = (sq_row, sq_col - 1)
        if exit_square not in self._entries_exits:
            self._score -= 1
            self._entries_exits.append(exit_square)
        return exit_square

    def guess_atom(self, row, column):
        """Guesses an atom's location. Takes a row and column as parameters. Returns True if there is an atom at the
        specified location, otherwise returns False. The guessing player's score is adjusted accordingly"""
        # Correct guess
        if (row, column) in self._atom_locations:
            if (row, column) not in self._guesses:
                self._guesses.append((row, column))
                self._undiscovered_atoms -= 1
                return True
            return True
        # Incorrect guess
        else:
            if (row, column) not in self._guesses:
                self._guesses.append((row, column))
                self._score -= 5
                return False
            return False

    def get_score(self):
        """Returns the current score"""
        return self._score

    def atoms_left(self):
        """Returns the number of atoms that haven't been guessed yet"""
        return self._undiscovered_atoms

    def print_board(self):
        """Prints the game board"""
        for row in self._board_lists:
            print(row)

    def print_help(self):
        """Prints the available commands and instructions for how to use them."""
        print("To display the game board (caution: this reveals the atom locations!), type: \nboard")
        print("To display the current score, type: \nscore")
        print("To display the number of atoms that haven't been guessed yet,",
              "type: \natoms")
        print("To shoot a ray into the box, type: \nshoot")
        print("To guess an atom's location, type: \nguess")
        print("To display these instructions again, type: \nhelp")
        print("To exit the game, type: \nexit")


if __name__ == '__main__':

    print("Let's play Black Box Game!")
    print("--------------------------")
    print("BlackBoxGame represents the game Black Box; an abstract board game that simulates shooting rays into a",
          "black box to deduce the locations of \"atoms\" hidden inside. The game board is represented as a 10x10",
          "grid, wherein atoms may exist at specified locations within the inner 8x8 grid. The guessing player",
          "starts with 25 points. One point is deducted each time a ray crosses a novel entry or exit tile. An",
          "incorrect atom location guess results in a five point deduction. Rays may hit an atom, be deflected 90",
          "degrees by a near miss of an atom, be reflected back to the entry point by the near miss of an atom",
          "near the border, and/or may exit the game board.")
    print()
    bbg = BlackBoxGame([(3,2),(1,7),(4,6),(8,8)])
    bbg.print_help()
    running = True
    while running is True:
        user_input = input("Please enter a command: ")
        if user_input == "board":
            bbg.print_board()
        elif user_input == "score":
            print("Score: "+str(bbg.get_score()))
        elif user_input == "atoms":
            print(bbg.atoms_left())
        elif user_input == "shoot":
            row = input("Enter the row (0 - 9): ")
            col = input("Enter the col (0 - 9): ")
            result = bbg.shoot_ray(int(row), int(col))
            if result is None:
                print("Hit!")
            elif result is False:
                print("The entry point must not be a corner or non-border tile. Try Again.")
            else:
                print("Ray exited at " + str(result))
                print("Score: " + str(bbg.get_score()))
        elif user_input == "guess":
            row = input("Enter the row (0 - 9): ")
            col = input("Enter the col (0 - 9): ")
            result = bbg.guess_atom(int(row), int(col))
            if result is True:
                print("Correct!")
            else:
                print("Incorrect. 5 point deduction.")
                print("Score: " + str(bbg.get_score()))
        elif user_input == "help":
            bbg.print_help()
        elif user_input == "exit":
            running = False
        else:
            print("Please enter one of the following commands:")
            print("board")
            print("score")
            print("atoms")
            print("shoot")
            print("help")
            print("exit")