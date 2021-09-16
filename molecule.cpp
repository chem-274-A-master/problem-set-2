#include <iostream>
#include <vector>

struct Atom
{
    int element; //!< Atomic Z-number
    double x;    //!< X-coordinate
    double y;    //!< Y-coordinate
    double z;    //!< Z-coordinate
};


class Molecule
{
    private:
        std::vector<Atom> atoms_;

    public:
        /* Write the default (zero argument) constructor */

        /* Write constructor that takes in a const std::vector<Atom> */

        /* Write a function to get an atom by index (get_atom) */

        /* Write function to add/append an atom (add_atom) */

        /* Write a function that returns the size (number of atoms) */

        /* Write a function to print all the info for all the atoms (print) */

        /* A destructor that prints to std::cout that is is destructing, and 
           how many atoms are being destructed */
};



int main(void)
{
    /* Some testing code below */
    Molecule m;

    m.add_atom(Atom{1, 0.0, 0.0, 0.0});
    m.add_atom(Atom{2, 1.0, 0.0, 0.0});
    m.get_atom(1);

    m.print();

    std::vector<Atom> atoms;
    atoms.push_back(Atom{1, 1.1, 2.2, 3.3});
    atoms.push_back(Atom{2, 1.2, 2.3, 3.4});

    const Molecule m2(atoms);
    m2.print();

    /* Feel free to add more! */

    return 0;
}
