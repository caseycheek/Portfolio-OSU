/*
CS344 Assignment 3: smallsh (Portfolio Assignment)
Author: Casey Cheek
Date: 5/3/2021
*/
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <fcntl.h>
#include <signal.h>

/*
Global variable to indicate whether child processes can be run in the background (0) or if the shell is running in 
foreground-only mode (1).
*/
int foregroundOnly = 0;

/*
Structure for command line input
*/
struct commandLine {
	char *argv[512];  // Array of pointers to argument strings (command stored at argv[0])
	int argc;  // Count of arguments in argv
	char *input;  // Stores the name of the input
	char *output;  // Stores the name of the output
	int background;  // Will be 1 if this is a background process or 0 if run in the foreground
};

/*
Structure for a linked list pid node.
*/
struct pidNode {
	int pid;
	struct pidNode *prev;
	struct pidNode *next;
};

/*
Signal handler for SIGINT
Receives: A signal number
*/
void handle_SIGINT(int signo) {
	char *message = "Caught SIGINT\n";
	write(1, message, 14);
	fflush(stdout);
	exit(0);
}

/*
Signal handler for SIGTSTP that allows the shell to toggle foreground-only mode.
Receives: A signal number
*/
void handle_SIGTSTP(int signo) {
	char *enteringFOM = "\nEntering foreground-only mode (& is now ignored)\n";
	char *exitingFOM = "\nExiting foreground-only mode\n";
	if (foregroundOnly == 0) {
		write(1, enteringFOM, 51);
		foregroundOnly = 1;
	}
	else {
		write(1, exitingFOM, 31);
		foregroundOnly = 0;
	}
	fflush(stdout);
}

/*
Replaces all instances of '$$' in a string with the current process id.
Receives: A string from command line input
Returns: A new string with expanded variable
*/
char *insertPid(char cmdLineStr[2048]) {
	char newString[2048];
	int cmdLength = strlen(cmdLineStr);
	int pid = getpid();
	char strPid[7]; // Max pid value is 327680 (found by entering "cat /proc/sys/kernel/pid_max") which is 6 digits long
	int j = 0; // j is index for the new string, while i is the index for the old string
	
	sprintf(strPid, "%d", pid);
	int pidLength = strlen(strPid);
	memset(newString, '\0', 2048);
	for (int i = 0; i <= cmdLength; i++) {
		if (cmdLineStr[i] == '$' && cmdLineStr[i + 1] == '$') {
			strncat(newString, strPid, pidLength); // Add the pid to the end of the new string being built
			j = j + pidLength - 1;
			i++;
		}
		else {
			newString[j] = cmdLineStr[i];
		}
		j++;
	}
	cmdLineStr = newString;
	return cmdLineStr;
}

/*
Parses the command line string input into a struct with the command, argument array, and argument count.
The characters '<', '<', and '&' are interpreted but not included in argv.
Receives: Command line string input
Returns: CommandLine struct built with pointers to the string input
*/
struct commandLine *createCmdStruct(char cmdLineStr[2048]) {
	int length = strlen(cmdLineStr);  // Length of the input string (excluding trailing null)
	struct commandLine *currCommandLine = malloc(sizeof(struct commandLine));
	
	// Removes newline character from the end of the input line (helps with parsing)
	if (cmdLineStr[length - 1] == '\n') {
		cmdLineStr[length - 1] = '\0';
		length--; 
	}
	
	// Build struct
	currCommandLine->argc = 0;
	currCommandLine->background = 0; // Command is set as a foreground process by default
	for (int i = 0; i <= length; i++) {
		// Replace spaces with null characters in the full input string
		if (cmdLineStr[i] == ' ') {
			cmdLineStr[i] = '\0';
			// If the next character is not a space or null character, then we have encountered a new word
			if (cmdLineStr[i + 1] != ' ' && cmdLineStr[i + 1] != '\0') {
				// The word after '< ' is the input
				if (cmdLineStr[i + 1] == '<') {
					currCommandLine->input = malloc(sizeof(char *)); // sizeof(char*) = size of character pointer
					currCommandLine->input = cmdLineStr + i + 3; // copies a pointer to the input word
					cmdLineStr[i + 2] = '\0';  // Replaces the space after '<' with a null pointer
					i = i + 2;
					while (cmdLineStr[i + 1] != ' ' && cmdLineStr[i + 1] != '\0') {  // Moves index up to the end of the input word
						i++;
					}
				}
				// The word after '> ' is the output
				else if (cmdLineStr[i + 1] == '>') {
					currCommandLine->output = malloc(sizeof(char *));
					currCommandLine->output = cmdLineStr + i + 3; // copies a pointer to the output word
					cmdLineStr[i + 2] = '\0';  // Replaces the space after '<' with a null pointer
					i = i + 2;
					while (cmdLineStr[i + 1] != ' ' && cmdLineStr[i + 1] != '\0') {  // Moves index up to the end of the output word
						i++;
					}
				}
				// An '&' word at the very end of the line indicates a background process
				else if (cmdLineStr[i + 1] == '&' && i == length - 2) {
					if (foregroundOnly == 0) {
						currCommandLine->background = 1;
					}
				}
				// All else are arguments that get added to the argv array
				else {
					currCommandLine->argv[currCommandLine->argc] = malloc(sizeof(char *));
					currCommandLine->argv[currCommandLine->argc] = cmdLineStr + i + 1;
					currCommandLine->argc++; // increments the argument count
				}
			}
		}
		// Here, the first character of the command line input is also the first character of the command
		else if (i == 0) {
			currCommandLine->argv[currCommandLine->argc] = malloc(sizeof(char *));
			currCommandLine->argv[currCommandLine->argc] = cmdLineStr;
			currCommandLine->argc++;
		}
	}
	// Add null pointer to the end of argv
	currCommandLine->argv[currCommandLine->argc] = NULL;
	currCommandLine->argc++;

	return currCommandLine;
}

/*
Redirects input and output according to the input, output, and background information in the commandLine struct.
Receives: A struct of the command line input
References: Uses code from Exploration: Processes and I/O - Using dup2 for Redirection
*/
void redirectIO(struct commandLine *currCommandLine) {
	int sourceFD;
	int targetFD;
	int sourceResult;
	int targetResult;

	// If this is a background process...
	if (currCommandLine->background == 1) {
		// And no input is specified, redirect input to /dev/null
		if (currCommandLine->input == NULL) {
			sourceFD = open("/dev/null", O_RDONLY);
			if (sourceFD == -1) {
				perror("Background process input open() failed!");
				exit(1);
			}
			sourceResult = dup2(sourceFD, STDIN_FILENO);
			if (sourceResult == -1) {
				perror("Background process input dup2() failed!");
				exit(2);
			}
		}
		// And no output is specified, redirect output to /dev/null
		if (currCommandLine->output == NULL) {
			targetFD = open("/dev/null", O_WRONLY);
			if (targetFD == -1) {
				perror("Background process output open() failed!");
				exit(1);
			}
			targetResult = dup2(targetFD, STDOUT_FILENO);
			if (targetResult == -1) {
				perror("Background process output dup2() failed!");
				exit(2);
			}
		}
	}
	// Redirect specified input for both foreground and background processes
	if (currCommandLine->input != NULL) {
		sourceFD = open(currCommandLine->input, O_RDONLY);
		if (sourceFD == -1) {
			printf("Cannot open %s for input\n", currCommandLine->input);
			exit(1);
		}
		sourceResult = dup2(sourceFD, STDIN_FILENO);
		if (sourceResult == -1) {
			perror("Foreground process input dup2() failed!");
			exit(2);
		}
	}
	// Redirect specified output for both foreground and background processes
	if (currCommandLine->output != NULL) {
		targetFD = open(currCommandLine->output, O_WRONLY | O_CREAT | O_TRUNC, 0644);
		if (targetFD == -1) {
			printf("Cannot open %s for output\n", currCommandLine->output);
			exit(1);
		}
		targetResult = dup2(targetFD, STDOUT_FILENO);
		if (targetResult == -1) {
			perror("Foreground process output dup2() failed!");
			exit(2);
		}
		close(targetFD);
	}
}

/*
Creates a linked list to store background child pids.
Returns: A pointer to the head of the list
*/
struct pidNode *createLL() {
	struct pidNode *head = malloc(sizeof(struct pidNode));
	struct pidNode *tail = malloc(sizeof(struct pidNode));
	head->next = tail;
	head->prev = NULL;
	tail->next = NULL;
	tail->prev = head;
	return head;
}

/*
Adds a new pid node to the end of the linked list.
Receives: The linked list head, the pid to be added.
*/
void addPidToLL(struct pidNode *currNode, int newPid) {
	// Create a new node with the new pid
	struct pidNode *newNode = malloc(sizeof(struct pidNode));
	newNode->pid = newPid;
	// Traverse the list until next node is NULL
	while (currNode->next->pid) {
		currNode = currNode->next;
	}
	currNode->next->prev = newNode;
	newNode->next = currNode->next;
	newNode->prev = currNode;
	currNode->next = newNode;
}

/*
Traverses the linked list of child background processes. If a completed process is found, that process is cleaned up 
with waitpid() and the exit status is printed.
Receives: The linked list head pointer
*/
void clearZombies(struct pidNode *currNode) {
	int childStatus;

	while (currNode != NULL) {
		if (currNode->pid) {
			// Non-zero values indicate that the child process has completed
			if (waitpid(currNode->pid, &childStatus, WNOHANG) != 0) {
				// Print child pid, then print exit status or termination signal
				printf("Background pid %d is done: ", currNode->pid);
				if (WIFEXITED(childStatus)) {
					printf("Exit value %d\n", WEXITSTATUS(childStatus));
				}
				else {
					printf("Terminated by signal %d\n", WTERMSIG(childStatus));
				}
				// Remove pid from linked list
				(currNode->prev)->next = currNode->next;
				(currNode->next)->prev = currNode->prev;
			}
		}
		currNode = currNode->next;
	}
	fflush(stdout);
}

/*
Terminates all background child processes.
Receives: The linked list head pointer
*/
void clearAllBG(struct pidNode *currNode) {
	while (currNode != NULL) {
		if (currNode->pid) {
			kill(currNode->pid, SIGTERM);
		}
		currNode = currNode->next;
	}
}

/*
Compile the program as follows:
	gcc --std=gnu99 -o smallsh smallsh.c
*/
int main()
{
	char cmdLineStr[2048]; // maximum command line length = 2048 characters
	char *home;  // Home directory
	int childStatus;
	pid_t spawnpid;

	// Creates a linked list to keep track of background child pids
	struct pidNode *head = malloc(sizeof(struct pidNode));
	head = createLL();

	// Set actions for signals
	struct sigaction SIGINT_action = { {0} }, SIGTSTP_action = { {0} }, ignore_action = { {0} };
	// IGNORE action instructions
	memset(&ignore_action, 0, sizeof(struct sigaction));
	ignore_action.sa_handler = SIG_IGN; // The ignore_action struct as SIG_IGN as its signal handler
	// SIGINT instructions
	memset(&SIGINT_action, 0, sizeof(struct sigaction));
	SIGINT_action.sa_handler = handle_SIGINT; // Register handle_SIGINT as the signal handler
	sigfillset(&SIGINT_action.sa_mask); // Block all catchable signals while handle_SIGINT is running
	SIGINT_action.sa_flags = 0; // No flags set
	sigaction(SIGINT, &ignore_action, NULL);  // SIGINT is ignored for parent and background child processes
	// SIGTSTP instructions
	memset(&SIGTSTP_action, 0, sizeof(struct sigaction));
	SIGTSTP_action.sa_handler = handle_SIGTSTP;
	sigfillset(&SIGTSTP_action.sa_mask);
	SIGTSTP_action.sa_flags = SA_RESTART;  // The SA_RESTART flag causes an automatic restart of the interrupted system call or library function after the signal handler finishes
	sigaction(SIGTSTP, &SIGTSTP_action, NULL);
	
	while (1) {
		// Get command line string, expand pid variables, and create a struct
		printf(": ");
		memset(cmdLineStr, '\0', sizeof(cmdLineStr)); // fill with null characters
		fgets(cmdLineStr, 2048, stdin);
		strcpy(cmdLineStr, insertPid(cmdLineStr)); // Expands occurences of the $$ variable into the shell pid
		struct commandLine *currCommandLine = createCmdStruct(cmdLineStr);

		// Lines that begin with the '#' character (comments) and blank lines are ignored
		if (cmdLineStr[0] == '#' || strlen(cmdLineStr) <= 1) {
			clearZombies(head);
		}

		// The exit command exits the shell. It kills any other processes or jobs that the shell had started before it terminates itself.
		else if (strcmp(currCommandLine->argv[0], "exit") == 0) {
			clearAllBG(head); // Terminate background processes
			clearZombies(head); // Clear out zombie processes
			return 0;
		}

		// The cd command changes the working directory of smallsh.
		else if (strcmp(currCommandLine->argv[0], "cd") == 0) {
			// If no arguments given, change to the directory specified in the HOME environment table
			if (currCommandLine->argc == 2) {
				home = getenv("HOME");
				chdir(home);
			}
			// Takes a path as a single argument, then changes the directory to that path
			else {
				chdir(currCommandLine->argv[1]);
			}
		}

		// The status command prints out either the exit status or the terminating signal of the last foreground process ran by the shell
		else if (strcmp(currCommandLine->argv[0], "status") == 0) {
			// No foreground commands have been run yet
			if (!childStatus) {
				printf("Exit value 0\n");
			}
			// Child process exited normally
			else if (WIFEXITED(childStatus)) { // evaluates to true if childStatus is not 0
				printf("Exit value %d\n", WEXITSTATUS(childStatus));
			}
			// Child process exited abnormally
			else {
				printf("Terminated by signal %d\n", WTERMSIG(childStatus));
			}
		}

		// else, execute all other commands by using fork(), exec(), and waitpid()
		// Uses code from Exploration: Processes - Interpreting the Termination Status
		else {
			spawnpid = fork();
			switch (spawnpid) {

			case -1:
				perror("fork() failed!");
				exit(1);
				break;

			// This is the child process
			case 0:
				sigaction(SIGINT, &ignore_action, NULL);  // SIGINT is ignored for parent and background child processes
				sigaction(SIGTSTP, &ignore_action, NULL);  // SIGTSTP is ignored for child processes
				// Redirects input/output
				redirectIO(currCommandLine);
				// A foreground child process must terminate itself when it receives SIGINT
				if (currCommandLine->background == 0) {
					sigaction(SIGINT, &SIGINT_action, NULL); // SIGINT exits foreground child processes
				}
				// Executes command
				execvp(currCommandLine->argv[0], currCommandLine->argv);
				perror(currCommandLine->argv[0]);
				fflush(stdout);
				exit(2);
				break;

			// This is the parent process. Spawnpid is the pid of the child.
			default:
				// Child process running in the background
				if (currCommandLine->background == 1) {
					printf("Background child pid is %d\n", spawnpid);
					addPidToLL(head, spawnpid); // Add pid of background child to the linked list
				}
				// Child process running in the foreground
				else {
					waitpid(spawnpid, &childStatus, 0);
					// If foreground child is killed by a signal, the parent immediately prints out the number of the signal
					if (!WIFEXITED(childStatus)) {
						printf("Terminated by signal %d\n", WTERMSIG(childStatus));
					}
				}
				clearZombies(head);
				sigaction(SIGTSTP, &SIGTSTP_action, NULL);
				break;
			}
		}
		fflush(stdout);
	}
	free(cmdLineStr);
	return EXIT_SUCCESS;
}