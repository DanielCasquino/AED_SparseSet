cmake_minimum_required(VERSION 3.9)
project(AED_SparseSet VERSION 0.1.0 LANGUAGES C CXX)

set(CMAKE_CXX_STANDARD 23)

include_directories(include)
include_directories(lib/Crow)
include_directories(lib)

link_libraries(ws2_32 wsock32)


include(CTest)
enable_testing()

add_executable(AED_SparseSet main.cpp sparse_set.h)

set(CPACK_PROJECT_NAME ${PROJECT_NAME})
set(CPACK_PROJECT_VERSION ${PROJECT_VERSION})
include(CPack)
