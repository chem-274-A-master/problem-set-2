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
        /* code here */

    public:
        /* code here */
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
