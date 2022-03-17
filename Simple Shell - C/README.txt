Project Name: smallsh (Portfolio Assignment)
Author: Casey Cheek
Date: 5/3/2021
Class: CS344 - Operating Systems


Project Requirements:
In this assignment you will write smallsh your own shell in C. smallsh will implement a subset of features of well-known shells, such as bash. Your program will

    1. Provide a prompt for running commands
    2. Handle blank lines and comments, which are lines beginning with the # character
    3. Provide expansion for the variable $$ into the PID
    4. Execute 3 commands exit, cd, and status via code built into the shell
    5. Execute other commands by creating new processes using a function from the exec family of functions
    6. Support input and output redirection
    7. Support running commands in foreground and background processes
    8. Implement custom handlers for 2 signals, SIGINT and SIGTSTP


How to run this program -
Compile the smallsh.c file with the following command:
$gcc --std=gnu99 -o smallsh smallsh.c

Then run the compiled program by typing:
$smallsh

Run the testing script (not written by me) with these commands:
$chmod +x ./p3testscript
$./p3testscript 2>&1