#pragma once

#include "sparse_set.h"
#include "crow.h"
#include <iostream>

/// @brief HTTP Controller for the static_sparse_set class.
class sparse_set_controller
{
private:
    static_sparse_set *_data = nullptr;
    friend class sparse_set_service;

    auto DenseToVector()
    {
        std::vector<int> vec(_data->_size, -1);
        for (int i = 0; i <= _data->_maxValue; ++i)
        {
            int search = _data->find(i);
            if (search != -1)
            {
                vec[search] = i;
            }
        }
        return vec;
    }

    auto SparseToVector()
    {
        std::vector<int> vec(_data->_size, -1);
        for (int i = 0; i <= _data->_maxValue; ++i)
        {
            int index = _data->find(i);
            if (index != -1)
            {
                vec[_data->_dense[index]] = index;
            }
        }
        return vec;
    }

    int GetSize()
    {
        return _data->_size;
    }

public:
    sparse_set_controller() : _data(nullptr)
    {
    }

    sparse_set_controller(static_sparse_set *set) : _data(set)
    {
    }

    crow::response Create(int size)
    {
        if (size > 0)
        {
            if (_data)
            {
                delete _data;
            }
            crow::json::wvalue wv = std::move("New set created.");
            _data = new static_sparse_set(size);
            return crow::response(201, std::move(wv));
        }
        else
        {
            return crow::response(400);
        }
    }

    crow::response Read()
    {
        if (_data)
        {
            crow::json::wvalue response;
            response["Sparse"] = SparseToVector();
            response["Dense"] = DenseToVector();
            response["itemCount"] = _data->_itemCount;
            response["maxValue"] = _data->_maxValue;
            response["size"] = _data->_size;
            return crow::response(200, response);
        }
        else
        {
            return crow::response(404);
        }
    }

    crow::response Insert(int value)
    {
        if (_data && value < this->GetSize())
        {
            bool response = _data->insert(value);
            crow::json::wvalue wv;
            wv = std::move(response);
            return crow::response(response ? 201 : 400, std::move(wv));
        }
        else
        {
            return crow::response(404);
        }
    }

    crow::response Remove(int value)
    {
        if (_data && value < this->GetSize())
        {
            bool response = _data->remove(value);
            crow::json::wvalue wv;
            wv = std::move(response);
            return crow::response(response ? 200 : 404, std::move(wv));
        }
        else
        {
            return crow::response(404);
        }
    }

    crow::response Delete()
    {
        if (_data)
        {
            delete _data;
            _data = nullptr;
            return crow::response(200, std::move("Sparse set deleted"));
        }
        else
        {
            return crow::response(404);
        }
    }

    crow::response Clear()
    {
        if (_data)
        {
            _data->clear();
            return crow::response(200, "Sparse Set cleared.");
        }
        else
        {
            return crow::response(404);
        }
    }

    ~sparse_set_controller() { delete _data; }
};