#include <iostream>
#include <cassert>

#include <vector>
#include <array>

struct Atom
{
    int atomic_number; //!< Atomic Z-number
    double mass; //!< Atomic mass
    double x;    //!< X-coordinate
    double y;    //!< Y-coordinate
    double z;    //!< Z-coordinate
};


class Molecule
{
};



int main(void)
{
    /* Some testing code below */
    Molecule h2;

    // 2 Hydrogen atoms
    h2.add_atom(Atom{1, 1.0, 0.0, 0.0, 0.0});
    h2.add_atom(Atom{1, 1.0, 0.0, 0.0, 1.0});

    h2.print();

    // Changing via reference from get_atom
    Atom & a2 = h2.get_atom(0);
    a2.x = 4.0;

    a = h2.get_atom(0);
    assert(a.x == 4.0);

    // Testing copy constructor and const correctness
    const Molecule h2c(h2);
    h2c.print();
    
    ///////////////////////////////////////////////
    // Constructing with vector & moment of inertia
    std::vector<Atom> atoms;
    atoms.push_back(Atom{8, 15.99491462, 1.0000,  1.0000,  0.2404});
    atoms.push_back(Atom{1, 1.007825032, 1.0000,  2.4326, -0.9611});
    atoms.push_back(Atom{1, 1.007825032, 1.0000, -2.4326, -0.9611});

    Molecule h2o(atoms);
    h2o.print();
    std::array<std::array<double, 3>, 3> I = h2o.inertia_tensor();

    // print the moment of inertia tensor
    for(int i = 0; i < 3; i++)
    {
        for(int j = 0; j < 3; j++)
        {
            std::cout << I[i][j] << " ";
        }
        std::cout << std::endl;
    }

    /* You must add more! */

    return 0;
}
