#pragma once

#pragma region includes
#include <iostream>
#include <cassert>
#include <initializer_list>
#pragma endregion

/// @brief A sparse set with immutable max size.
class static_sparse_set
{
private:
    int *_sparse = nullptr, *_dense = nullptr;
    std::size_t _itemCount = 0, _maxValue = 0, _size = 1;
    friend class sparse_set_controller;

public:
#pragma region methods
    /// @brief Creates a sparse set with a given maximum value to be stored.
    /// @param maxValue The MAXIMUM VALUE that will be able to be inserted.
    static_sparse_set(std::size_t maxValue)
    {
        _itemCount = 0;
        _maxValue = maxValue;
        _size = maxValue + 1;
        _sparse = new int[_size];
        _dense = new int[_size];
    }

    /// @brief Copy constructor.
    /// @param other Source set.
    static_sparse_set(const static_sparse_set &other)
    {
        _maxValue = other._maxValue;
        _itemCount = other._itemCount;
        _size = other._size;

        _sparse = new int[_size];
        _dense = new int[_size];

        for (int i = 0; i < _size; ++i)
        {
            _sparse[i] = other._sparse[i];
            _dense[i] = other._dense[i];
        }
    }

    /// @brief Clears _sparse and _dense arrays' memory.
    ~static_sparse_set()
    {
        delete[] _sparse;
        delete[] _dense;
        _sparse = nullptr;
        _dense = nullptr;
        _itemCount = 0;
        _maxValue = 0;
        _size = 0;
    }

    /// @brief Inserts a given value if it does not exceed _maxValue. Repeated values will not be inserted.
    /// @param value Value to be inserted.
    /// @return True if value was inserted, false otherwise.
    bool insert(const int value)
    {
        if (value > _maxValue || value < 0)
        {
            return false;
        }
        if (find(value) == -1)
        {
            _dense[_itemCount] = value;
            _sparse[value] = _itemCount;
            ++_itemCount;
            return true;
        }
        return false;
    }

    /// @brief Inserts a list of values if there is no value that exceeds _maxValue. Repeated values will not be inserted.
    /// @param list Initializer list of values.
    void insert(const std::initializer_list<int> list)
    {
        for (const auto e : list)
        {
            insert(e);
        }
    }

    /// @brief Returns a value's existence inside the set.
    /// @param value Value to look for.
    /// @return -1 if value was not found, else returns index of element in dense.
    int find(int value)
    {
        if (value > _maxValue || value < 0)
            return -1;

        if (_sparse[value] < _itemCount && _dense[_sparse[value]] == value) // Checks if found index is in range and value is found in dense
            return (_sparse[value]);

        return -1;
    }

    /// @brief Finds and deletes a given value.
    /// @param value Value to be deleted.
    /// @return -1 if item was not found, else returns value.
    int remove(const int value)
    {
        int search = find(value);
        if (search != -1)
        {
            --_itemCount;
            int valueIndexInDense = _sparse[value];                 // Retrieves item position in _dense
            _dense[valueIndexInDense] = _dense[_itemCount];         // Replaces the item in _dense with the last element of _dense
            _sparse[_dense[valueIndexInDense]] = valueIndexInDense; // Updates the corresponding index in _sparse to point to the correct element
            return search;
        }
        return -1;
    }

    /// @brief Iterates through and displays all items in _dense.
    void displayItems() const
    {
        if (empty())
        {
            std::cout << "[]\n";
            return;
        }
        std::cout << '[';
        for (int i = 0; i < _itemCount; ++i)
        {
            std::cout << _dense[i] << (i < _itemCount - 1 ? ", " : "]\n");
        }
    }

    /// @brief Displays indexes of elements in dense.
    void displayIndexes()
    {
        if (empty())
        {
            std::cout << "[]\n";
            return;
        }
        std::cout << '[';
        for (int i = 0; i < _size; ++i)
        {
            std::cout << find(i) << (i < _size - 1 ? ", " : "]\n");
        }
    }

    /// @brief Deletes all items in the set.
    void clear()
    {
        _itemCount = 0;
    }

    /// @brief Returns the emptiness state of the set.
    /// @return True if empty, false otherwise.
    bool empty() const
    {
        return !_itemCount;
    }

    /// @brief Returns the size of the underlying arrays.
    /// @return Size of arrays.
    std::size_t size() const
    {
        return _size;
    }
#pragma endregion

#pragma region overloads
// TODO
#pragma endregion
};
