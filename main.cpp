#include "sparse_set.h"
#include "crow.h"

int main()
{
    auto set = new static_sparse_set(10);
    set->insert({0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10});
    set->displayItems();
    set->remove(5);
    auto copy = new static_sparse_set(set);
    copy->insert(0); // Repeated value, doesn't insert
    copy->displayItems();
    return 0;
}
