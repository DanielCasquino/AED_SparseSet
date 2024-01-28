#pragma once

#include "crow.h"
#include "sparse_set_service.h"

/// @brief App starting point. Receives a port as a parameter.
struct Api
{
    crow::SimpleApp app;
    int _port = 18080;
    sparse_set_service *service = nullptr;

    Api(int port = 18080) : _port(port)
    {
        service = new sparse_set_service();
        CROW_ROUTE(app, "/create/<int>").methods(crow::HTTPMethod::PUT)([&](int size)
                                                                        { return service->Create(size); });
        CROW_ROUTE(app, "/read").methods(crow::HTTPMethod::GET)([&]()
                                                                { return service->Read(); });
        CROW_ROUTE(app, "/remove/<int>").methods(crow::HTTPMethod::POST)([&](int value)
                                                                         { return service->Remove(value); });
        CROW_ROUTE(app, "/insert/<int>").methods(crow::HTTPMethod::POST)([&](int value)
                                                                         { return service->Insert(value); });
        CROW_ROUTE(app, "/clear").methods(crow::HTTPMethod::PATCH)([&]()
                                                                   { return service->Clear(); });
        CROW_ROUTE(app, "/delete").methods(crow::HTTPMethod::Delete)([&]()
                                                                     { return service->Destroy(); });
    }

    /// @brief Starts server.
    void start()
    {
        app.port(_port).multithreaded().run();
    }
};