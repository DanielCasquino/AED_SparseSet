#include "api.h"

void sanityTest()
{
    static_sparse_set set(10);
    std::cout << std::boolalpha << set.insert(10) << std::endl;
    std::cout << std::boolalpha << set.insert(5) << std::endl;
    std::cout << std::boolalpha << set.insert(5) << std::endl;
    set.displayItems();
    set.displayIndexes();
}

int main()
{
    // sanityTest();
    // return 0;
    Api api(18080);
    api.start();
    return 0;
}