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

    auto GetDense()
    {
        std::vector<int> vec;
        vec.reserve(_data->_size);
        for (int i = 0; i < _data->_itemCount; ++i)
        {
            vec.push_back(_data->_dense[i]);
        }
        return vec;
    }

    int GetSize()
    {
        return _data->_size;
    }

    auto GetSparse()
    {
        std::vector<int> vec;
        vec.reserve(_data->_size);
        for (int i = 0; i < _data->_itemCount; ++i)
        {
            vec.push_back(_data->_sparse[i]);
        }
        return vec;
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
        if (_data)
        {
            delete _data;
        }
        _data = new static_sparse_set(size);
        return crow::response(201, "New set created.");
    }

    crow::response Remove(int value)
    {
        bool response = _data->remove(value);
        crow::json::wvalue wv;
        wv = std::move(response);
        return crow::response(200, std::move(wv));
    }

    crow::response Insert(int value)
    {
        bool response = _data->insert(value);
        crow::json::wvalue wv;
        wv = std::move(response);
        return crow::response(201, std::move(wv));
    }

    crow::response Clear()
    {
        _data->clear();
        return crow::response(200, "Sparse Set cleared.");
    }

    crow::response GetJSON()
    {
        crow::json::wvalue response;
        response["Dense"] = GetDense();
        response["Sparse"] = GetSparse();
        response["itemCount"] = _data->_itemCount;
        response["maxValue"] = _data->_maxValue;
        response["size"] = _data->_size;
        return crow::response(200, response);
    }

    ~sparse_set_controller() { delete _data; }
};