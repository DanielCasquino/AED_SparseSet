#pragma once

#include "sparse_set_controller.h"
#include "crow.h"

class sparse_set_service
{
private:
    sparse_set_controller *_controller = nullptr;

public:
    sparse_set_service()
    {
        _controller = new sparse_set_controller();
    }

    ~sparse_set_service()
    {
        delete _controller;
    }

    crow::response Create(int size)
    {
        crow::response res = _controller->Create(size);
        res.add_header("Access-Control-Allow-Origin", "*");
        return res;
    }

    crow::response Read()
    {
        crow::response res = _controller->Read();
        res.add_header("Access-Control-Allow-Origin", "*");
        return res;
    }

    crow::response Insert(int value)
    {
        crow::response res = _controller->Insert(value);
        res.add_header("Access-Control-Allow-Origin", "*");
        return res;
    }

    crow::response Remove(int value)
    {
        crow::response res = _controller->Remove(value);
        res.add_header("Access-Control-Allow-Origin", "*");
        return res;
    }

    crow::response Delete()
    {
        crow::response res = _controller->Delete();
        res.add_header("Access-Control-Allow-Origin", "*");
        return res;
    }

    crow::response Clear()
    {
        crow::response res = _controller->Clear();
        res.add_header("Access-Control-Allow-Origin", "*");
        return res;
    }

    crow::response Ping()
    {
        crow::response res(200);
        res.add_header("Access-Control-Allow-Origin", "*");
        return res;
    }

    crow::response Find(int value)
    {
        crow::response res = _controller->Find(value);
        res.add_header("Access-Control-Allow-Origin", "*");
        return res;
    }

    crow::response Random()
    {
        crow::response res = _controller->Random();
        res.add_header("Access-Control-Allow-Origin", "*");
        return res;
    }
};