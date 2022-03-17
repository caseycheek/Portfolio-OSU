# Course: CS261 - Data Structures
# Assignment: Homework 5 - Min Heap
# Student: Casey Cheek
# Description: Implementation of a Minimum Heap using a dynamic array as the underlying data storage. Includes the
# following methods: add(), get_min(), remove_min(), and build_heap().


# Import pre-written DynamicArray and LinkedList classes
from a5_include import *


class MinHeapException(Exception):
    """
    Custom exception to be used by MinHeap class
    DO NOT CHANGE THIS CLASS IN ANY WAY
    """
    pass


class MinHeap:
    def __init__(self, start_heap=None):
        """
        Initializes a new MinHeap
        DO NOT CHANGE THIS METHOD IN ANY WAY
        """
        self.heap = DynamicArray()

        # populate MH with initial values (if provided)
        # before using this feature, implement add() method
        if start_heap:
            for node in start_heap:
                self.add(node)

    def __str__(self) -> str:
        """
        Return MH content in human-readable form
        DO NOT CHANGE THIS METHOD IN ANY WAY
        """
        return 'HEAP ' + str(self.heap)

    def is_empty(self) -> bool:
        """
        Return True if no elements in the heap, False otherwise
        DO NOT CHANGE THIS METHOD IN ANY WAY
        """
        return self.heap.length() == 0

    def add(self, node: object) -> None:
        """
        Receives a node (obj) and adds it to the MinHeap while maintaining heap property.
        """
        index = self.heap.length()
        self.heap.append(node)
        parent_index = (index - 1) // 2
        while self.heap.get_at_index(parent_index) > self.heap.get_at_index(index) and index > 0:
            self.heap.swap(parent_index, index)
            index = parent_index
            parent_index = (index - 1) // 2

    def get_min(self) -> object:
        """
        Returns the object with the minimum key without removing it from the heap. If the heap is empty, the method
        raises a MinHeapException.
        """
        if self.heap.length() == 0:
            raise MinHeapException
        else:
            return self.heap.get_at_index(0)

    def remove_min(self) -> object:
        """
        Returns an object with a minimum key and removes it from the heap. If the heap is empty, the method raises a
        MinHeapException.
        """
        if self.heap.length() == 0:
            raise MinHeapException
        else:
            # Remember the current minimum node, swap it with the last element in the array, then remove it
            min = self.get_min()
            self.heap.swap(0, (self.heap.length() - 1))
            self.heap.pop()

            # Find the indices of the new root and its new children
            i = 0
            left_i = 2 * i + 1
            right_i = 2 * i + 2
            # Find the minimum child out of the root's 2 children
            if right_i < self.heap.length():
                if self.heap.get_at_index(right_i) < self.heap.get_at_index(left_i):
                    min_child_i = right_i
                else:
                    min_child_i = left_i
            # Set the root's only child as its minimum child
            elif left_i < self.heap.length():
                min_child_i = left_i
            # Node at index i is the root and it has no children
            else:
                return min

            # While the value at index i is greater than the value of its minimum child
            while self.heap.get_at_index(i) > self.heap.get_at_index(min_child_i):
                # Swap these nodes
                self.heap.swap(i, min_child_i)
                # Then set up new values of i an its minimum child for the next comparison
                i = min_child_i
                left_i = 2 * i + 1
                right_i = 2 * i + 2
                # Here, the node at index i has 2 children
                if right_i < self.heap.length():
                    if self.heap.get_at_index(right_i) < self.heap.get_at_index(left_i):
                        min_child_i = right_i
                    else:
                        min_child_i = left_i
                # Here, the node at index i has 1 child
                elif left_i < self.heap.length():
                    min_child_i = left_i
        return min

    def build_heap(self, da: DynamicArray) -> None:
        """
        Receives a dynamic array with objects in any order and builds a proper MinHeap from them. Current content of
        the MinHeap is lost.
        """
        # Clear the current heap, then copy over each element of the supplied array
        for _ in range(self.heap.length()):
            self.heap.pop()
        for element in da:
            self.heap.append(element)

        # Examine each subtree
        n = self.heap.length()
        subtree = (n // 2) - 1
        while subtree >= 0:

            # Percolate down
            i = subtree
            left_i = 2 * i + 1
            right_i = 2 * i + 2
            while left_i < self.heap.length():
                # Node i has 2 children
                if right_i < self.heap.length():
                    # Find i's minimum child
                    if self.heap.get_at_index(right_i) < self.heap.get_at_index(left_i):
                        min_child_i = right_i
                    else:
                        min_child_i = left_i
                # Node i has 1 child
                else:
                    min_child_i = left_i
                # Swap the nodes if the value at i is > the value of i's minimum child
                if self.heap.get_at_index(i) > self.heap.get_at_index(min_child_i):
                    self.heap.swap(i, min_child_i)
                i = min_child_i
                left_i = 2 * i + 1
                right_i = 2 * i + 2

            # Move on to the next subtree
            if (n % 2) == 0:
                n -= 1
            else:
                n -= 2
            subtree = (n // 2) - 1


# BASIC TESTING
if __name__ == '__main__':

    print("\nPDF - add example 1")
    print("-------------------")
    h = MinHeap()
    print(h, h.is_empty())
    for value in range(300, 200, -15):
        h.add(value)
        print(h)

    print("\nPDF - add example 2")
    print("-------------------")
    h = MinHeap(['fish', 'bird'])
    print(h)
    for value in ['monkey', 'zebra', 'elephant', 'horse', 'bear']:
        h.add(value)
        print(h)


    print("\nPDF - get_min example 1")
    print("-----------------------")
    h = MinHeap(['fish', 'bird'])
    print(h)
    print(h.get_min(), h.get_min())


    print("\nPDF - remove_min example 1")
    print("--------------------------")
    h = MinHeap([1, 10, 2, 9, 3, 8, 4, 7, 5, 6])
    while not h.is_empty():
        print(h, end=' ')
        print(h.remove_min())


    print("\nPDF - build_heap example 1")
    print("--------------------------")
    da = DynamicArray([100, 20, 6, 200, 90, 150, 300])
    h = MinHeap(['zebra', 'apple'])
    print(h)
    h.build_heap(da)
    print(h)
    da.set_at_index(0, 500)
    print(da)
    print(h)
