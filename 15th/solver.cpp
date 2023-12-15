#include <iostream>
#include <fstream>
#include <string>
#include <array>
#include <unordered_map>
#include <utility>

using namespace std;

int solve1(char *filename);
pair<int, string> my_hash(istream &infile, int init, int len);
int solve2(char *filename);

int main( int argc, char* argv[] ) {
    cout << "15 Advent of Code" << endl;
    const char *filename = argc > 1 ? argv[1] : "input.txt";
        
    cout << "1: " << solve1((char *)filename) << endl;
    cout << "2: " << solve2((char *)filename) << endl;
    return 0;
}

int solve1(char *filename) {
    ifstream infile(filename);
    ifstream in(filename);
    int count = 0;
    int sum = 0;

    try {
        for (char c; infile >> c;) {
            if (c == ',') {
                sum += my_hash(in, 0, count).first;
                count = 0;
                in >> c;
            } else {
                count++;
            }
        }
        sum += my_hash(in, 0, count).first;

    } catch (const ifstream::failure& e) {
        cout << "Exception opening/reading file";
    }

    return sum;

}

pair<int, string> my_hash(istream &infile, int init, int len) {
    int hash = init;
    char* str = new char[len +1];
    for (int i = 0; i < len; i++) {
        char n;
        infile >> n;
        str[i] = n;
        hash += int(n);
        hash *= 17;
        hash %= 256;
    }
    str[len] = '\0';
    return make_pair(hash, string(str));
}

class LINK {
    public:
        LINK(LINK *link, string name, int strength) {
            this->link = link;
            this->name = name;
            this->strength = strength;
        }

        LINK *link;
        string name;
        int strength;

        void print() {
            cout << "[" << this->name << " " << this->strength << "]";
        }
};

class BOX {
    public:
        BOX() {
            this->link = NULL;
        }

        void add_link(string name, int strength) {
            LINK *link = find_link(name);
            if (link == NULL) {
                this->link = new LINK(this->link, name, strength);
            } else {
                link->strength = strength;
            }
        }

        LINK *find_link(string name) {
            LINK *link = this->link;
            while (link != NULL) {
                if (link->name == name) {
                    return link;
                }
                link = link->link;
            }
            return NULL;
        }

        LINK *find_link_before(string name) {
            LINK *link = this->link;
            LINK *prev = NULL;
            while (link != NULL) {
                if (link->name == name) {
                    return prev;
                }
                prev = link;
                link = link->link;
            }
            return NULL;
        }

        void remove_link(string name) {
            LINK *link = find_link_before(name);
            if (link != NULL) {
                link->link = link->link->link;
            } else if (this->link != NULL && this->link->name == name) {
                this->link = this->link->link;
            }
        }


        LINK *get_link() {
            return this->link;
        }

        void print() {
            LINK *link = this->link;
            while (link != NULL) {
                link->print();
                link = link->link;
            }
        }

        int get_link_count() {
            int count = 0;
            LINK *link = this->link;
            while (link != NULL) {
                count++;
                link = link->link;
            }
            return count;
        }

    private:
        LINK *link;

};

int solve2(char *filename){
    array<BOX, 256> hash_table = {};
    for (int i = 0; i < 256; i++) {
        hash_table[i] = BOX();
    }

    ifstream infile(filename);
    ifstream in(filename);

    int count = 0;

    try {
        for (char c; infile >> c;) {
            if (c == '=') {
                pair<int, string> hash = my_hash(in, 0, count);
                infile.ignore(1);
                in.ignore(1);
                in >> c;
                hash_table[hash.first].add_link(hash.second, c - '0');
                count = 0;
            } else if (c == '-') {
                pair<int, string> hash = my_hash(in, 0, count);
                in.ignore(1);
                hash_table[hash.first].remove_link(hash.second);
                count = 0;
            } else if (c == ',') {
                // skip ,
                in >> c;
            } else {
                count++;
            }
        }
    } catch (const ifstream::failure& e) {
        cout << "Exception opening/reading file";
    }

    int sum = 0;
    for (int i = 0; i < 256; i++) {
        BOX box = hash_table[i];
        int sloth_count = box.get_link_count();
        LINK *link = box.get_link();
        if (link == NULL) {
            continue;
        }

        /*cout << "BOX " << i << " ";
        box.print();
        cout << endl;*/
        
        while (link != NULL) {
            sum += (i + 1) * link->strength * sloth_count;
            link = link->link;
            sloth_count--;
        }
    }

    return sum;
}
        
// Honestly, this one was with a bit of help from Copilot. ifstream/istream still confuses me.