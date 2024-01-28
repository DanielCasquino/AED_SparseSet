#pragma once

#include "crow.h"
#include "sparse_set_controller.h"

struct Api
{
    crow::SimpleApp app;
    int _port;

    Api(int port) : _port(port)
    {
    }

    void start()
    {
        static_sparse_set *set = new static_sparse_set(10);
        set->insert({5, 8, 9, 10, 0, 1, 3, 4, 6, 7, 2});
        sparse_set_controller controller(set);
        CROW_ROUTE(app, "/get").methods(crow::HTTPMethod::GET)([&]()
                                                               { return controller.GetJSON(); });
        CROW_ROUTE(app, "/remove/<int>").methods(crow::HTTPMethod::GET)([&](int value)
                                                                        { return controller.Remove(value); });
        CROW_ROUTE(app, "/insert/<int>").methods(crow::HTTPMethod::GET)([&](int value)
                                                                        { return controller.Insert(value); });
        CROW_ROUTE(app, "/clear").methods(crow::HTTPMethod::GET)([&]()
                                                                 { return controller.Clear(); });
        app.port(_port).multithreaded().run();
    }
};