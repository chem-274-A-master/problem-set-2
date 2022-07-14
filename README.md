Week 4 Problem Set
==================


Writing class member functions
------------------------------

The file `molecule.cpp` contains the beginning of a molecule class. Add the following
member functions to the class.

Remember const correctness! Some functions should be const.

* Default constructor (takes no arguments)
* Constructor that takes in an existing std::vector of atoms
* A function to get an `Atom` from the class by index
* A function to add/append an `Atom` instance.
* A function that prints out the size (number of atoms) of the molecule (called `size()`, returning a `size_t`)
* A function that prints out the contents of the molecule (each atom being on its own line)
* A destructor that simply prints that it is destructing and how many atoms it is destructing.
