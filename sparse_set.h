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
    int *_sparse, *_dense;
    std::size_t _itemCount, _maxValue;

public:
#pragma region methods
    /// @brief Creates a sparse set with a given maximum value to be stored.
    /// @param maxValue The MAXIMUM VALUE that will be able to be inserted.
    static_sparse_set(std::size_t maxValue)
    {
        assert(maxValue > 0);
        _sparse = new int[maxValue + 1];
        _dense = new int[maxValue + 1];
        _itemCount = 0;
        _maxValue = maxValue + 1;
    }

    /// @brief Copy constructor.
    /// @param other Source set.
    static_sparse_set(const static_sparse_set &other)
    {
        _maxValue = other._maxValue;
        _itemCount = other._itemCount;

        _sparse = new int[_maxValue];
        _dense = new int[_maxValue];

        for (int i = 0; i < _maxValue; ++i)
        {
            _sparse[i] = other._sparse[i];
            _dense[i] = other._dense[i];
        }
    }

    /// @brief Copy constructor for copying a set allocated in dynamic memory.
    /// @param other Pointer to source set.
    static_sparse_set(const static_sparse_set *other)
    {
        _maxValue = other->_maxValue;
        _itemCount = other->_itemCount;

        _sparse = new int[_maxValue];
        _dense = new int[_maxValue];

        for (int i = 0; i < _maxValue; ++i)
        {
            _sparse[i] = other->_sparse[i];
            _dense[i] = other->_dense[i];
        }
    }

    /// @brief Clears sparse and dense arrays' memory.
    ~static_sparse_set()
    {
        delete[] _sparse;
        delete[] _dense;
        _itemCount = 0;
        _maxValue = 0;
    }

    /// @brief Inserts a given value if it does not exceed _maxValue. Repeated values will not be inserted.
    /// @param value Value to be inserted.
    void insert(const int value)
    {
        assert(value < _maxValue);
        if (!find(value))
        {
            _dense[_itemCount] = value;
            _sparse[value] = _itemCount;
            ++_itemCount;
        }
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
    /// @return Boolean representing the values' existence.
    bool find(const int value)
    {
        assert(value < _maxValue);

        // Check if the value is within bounds before accessing _sparse
        if (value < _maxValue && _sparse[value] < _itemCount)
        {
            int found = _dense[_sparse[value]]; // Retrieves found value corresponding to the found array in _sparse
            return found == value;
        }

        return false;
    }

    /// @brief Finds and deletes a given value.
    /// @param value Value to be deleted.
    void remove(const int value)
    {
        if (find(value))
        {
            --_itemCount;
            int valueIndexInDense = _sparse[value];                 // Retrieves item position in dense
            _dense[valueIndexInDense] = _dense[_itemCount];         // Replaces the item in dense with the last element of dense
            _sparse[_dense[valueIndexInDense]] = valueIndexInDense; // Updates the corresponding index in sparse to point to the correct element
        }
    }

    /// @brief Iterates through and displays all items in the set.
    void displayItems()
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

    /// @brief Deletes all items in the set.
    void clear()
    {
        _itemCount = 0;
    }

    /// @brief Returns the emptiness state of the set.
    /// @return True if empty, false otherwise.
    bool empty()
    {
        return !_itemCount;
    }

    /// @brief Returns the size of the underlying arrays.
    /// @return Size of arrays.
    std::size_t size()
    {
        return _maxValue;
    }
#pragma endregion

#pragma region overloads
// TODO
#pragma endregion
};
