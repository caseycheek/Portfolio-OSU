Project Name: Hash Map and Min Heap Implementation
Author: Casey Cheek
Date: 12/02/2020
Class: CS261 - Data Structures

Project Requirements:
	Implement hash map and min heap data structures given the provided skeleton code. No built-in Python data structures are allowed. For more detail, see Project_Requirements.pdf.

Project Description:
	Hash Map
	Uses a dynamic array to store the hash table and resolves collisions by chaining key/value paires in singly linked lists. Uses some pre-witten skeleton code, but the following functions are written by me:
		clear()
		get()
		resize_table()
		put()
		remove()
		contains_key()
		get_keys()
		empty_buckets()
		table_load()
		
	Min Heap
	Uses a dynamic array to implement the complete binary tree heap in which the value in each internal node is less than or equal to the values in the children of that node. Uses some pre-witten skeleton code, but the following functions are written by me:
		add()
		get_min()
		remove_min()
		build_heap()