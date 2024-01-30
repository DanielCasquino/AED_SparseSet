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
    crow::response Read()
    {
        if (_controller->_data)
        {
            return _controller->GetJSON();
        }
        else
        {
            return crow::response(404, "undefined");
        }
    }

    crow::response Create(int size)
    {
        if (size > 0)
        {
            return _controller->Create(size);
        }
        else
        {
            return crow::response(400, "undefined");
        }
    }

    crow::response Destroy()
    {
        if (_controller->_data)
        {
            delete _controller->_data;
            _controller->_data = nullptr;
            return crow::response(200, "Sparse set deleted.");
        }
        else
        {
            return crow::response(404, "undefined");
        }
    }

    crow::response Insert(int value)
    {
        if (_controller->_data && value < _controller->GetSize())
        {
            return _controller->Insert(value);
        }
        else
        {
            return crow::response(400, "undefined");
        }
    }

    crow::response Remove(int value)
    {
        if (_controller->_data && value < _controller->GetSize())
        {
            return _controller->Remove(value);
        }
        else
        {
            return crow::response(404, "undefined");
        }
    }

    crow::response Clear()
    {
        if (_controller->_data)
        {
            return _controller->Clear();
        }
        else
        {
            return crow::response(404, "undefined");
        }
    }
};