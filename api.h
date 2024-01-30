#pragma once

#include "crow.h"
#include "sparse_set_service.h"
#include "shellapi.h"
#include <iostream>
#include "crow/middlewares/cors.h"

/// @brief App starting point. Receives a port as a parameter.
struct Api
{
    const float version = 0.1;
    crow::App<crow::CORSHandler> app;

    int _port = 18080;
    sparse_set_service *service = nullptr;

    Api(int port = 18080) : _port(port)
    {
        // Customize CORS
        auto &cors = app.get_middleware<crow::CORSHandler>();

        cors
            .global()
            .headers("X-Custom-Header", "Upgrade-Insecure-Requests")
            .methods("POST"_method, "GET"_method, "DELETE"_method, "PUT"_method)
            .prefix("/cors")
            .origin("*")
            .prefix("/nocors")
            .ignore();

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
        CROW_ROUTE(app, "/check").methods(crow::HTTPMethod::GET)([&]()
                                                                 { return crow::response(200); });
    }

    /// @brief Starts server.
    /// @param openBrowser Defines if browser is opened on app start.
    void start(bool openBrowser = false)
    {
        if (openBrowser)
            ShellExecuteA(0, NULL, "http://localhost:18080", NULL, NULL, SW_SHOWDEFAULT);
        welcome();
        app.port(_port).multithreaded().run();
    }

    /// @brief Displays welcome message.
    void welcome()
    {
        std::cout << " ___ ___ ___                      \n";
        std::cout << "/ __/ __/ __| ___ _ ___ _____ _ _ \n";
        std::cout << "\\__ \\__ \\__ \\/ -_) '_\\ V / -_) '_|\n";
        std::cout << "|___/___/___/\\___|_|  \\_/\\___|_|  \n";
        std::cout << "Sparse Set Server - ver" << version << std::endl
                  << std::endl;
        std::cout << "Read DOCS.md to get started." << std::endl
                  << std::endl;
    }
};