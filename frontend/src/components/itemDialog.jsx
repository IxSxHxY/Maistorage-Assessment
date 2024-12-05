// export default ItemDialog;

import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';

const ItemDialog = ({ isOpen, onClose, onSave, currentItem, setCurrentItem, isEdit }) => {
  // const [item, setItem] = useState(currentItem);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // setItem(currentItem);
    setErrors({});
  }, [currentItem]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // console.log(name, value)
    // console.log("handleChange")
    // setItem({ ...item, [name]: value });
    setCurrentItem({ ...currentItem, [name]: value })
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!currentItem.item_name.trim()) newErrors.item_name = 'Name is required';
    if (!currentItem.category.trim()) newErrors.category = 'Category is required';
    if (!currentItem.quantity || currentItem.quantity <= 0) newErrors.quantity = 'Quantity must be a positive number';
    if (!currentItem.price || currentItem.price <= 0) newErrors.price = 'Price must be a positive number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log(currentItem)
      onSave(currentItem);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-10 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" aria-hidden="true" />
      <div className="fixed inset-0 flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
          <Dialog.Title className="mb-4 text-lg font-bold">{isEdit ? 'Edit Item' : 'Add Item'}</Dialog.Title>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="item_name"
                className={`w-full p-2 border rounded ${errors.item_name ? 'border-red-500' : 'border-gray-300'}`}
                value={currentItem.item_name}
                onChange={handleInputChange}
              />
              {errors.item_name && <p className="mt-1 text-sm text-red-500">{errors.item_name}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Category</label>
              <input
                type="text"
                name="category"
                className={`w-full p-2 border rounded ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                value={currentItem.category}
                onChange={handleInputChange}
              />
              {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Quantity</label>
              <input
                type="number"
                name="quantity"
                className={`w-full p-2 border rounded ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`}
                value={currentItem.quantity}
                onChange={handleInputChange}
              />
              {errors.quantity && <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Price</label>
              <input
                type="number"
                name="price"
                step="0.01"
                className={`w-full p-2 border rounded ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                value={currentItem.price}
                onChange={handleInputChange}
              />
              {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
            </div>
          </form>
          <div className="mt-4 flex justify-end">
            <button className="mr-2 rounded bg-gray-300 px-4 py-2 text-gray-700" onClick={onClose}>
              Cancel
            </button>
            <button className="rounded bg-blue-500 px-4 py-2 text-white" onClick={handleSubmit}>
              Save
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ItemDialog;
