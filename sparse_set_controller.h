#pragma once

#include "sparse_set.h"
#include "crow.h"

/// @brief HTTP Controller for the static_sparse_set class.
class sparse_set_controller
{
private:
    static_sparse_set *_data;

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
    sparse_set_controller(static_sparse_set *set) : _data(set)
    {
    }

    crow::response Remove(int value)
    {
        bool response = _data->remove(value);
        crow::json::wvalue wv;
        wv = std::move(response);
        return crow::response(std::move(wv));
    }

    crow::response Insert(int value)
    {
        bool response = _data->insert(value);
        crow::json::wvalue wv;
        wv = std::move(response);
        return crow::response(std::move(wv));
    }

    crow::response Clear()
    {
        _data->clear();
        return crow::response("Sparse Set Cleared.");
    }

    crow::response GetJSON()
    {
        crow::json::wvalue response;
        response["Dense"] = GetDense();
        response["Sparse"] = GetSparse();
        response["itemCount"] = _data->_itemCount;
        response["maxValue"] = _data->_maxValue;
        response["size"] = _data->_size;
        return crow::response(response);
    }

    ~sparse_set_controller() { delete _data; }
};