
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemTable from './components/itemTable';
import ItemDialog from './components/itemDialog';
import SearchBar from './components/searchBar';
import FlashMessage from './components/flashMessage';
import Pagination from './components/pagination';
import Swal from 'sweetalert2';
import "./App.css";

// require('dotenv').config();

//import {} from 'dotenv'
//dotenv.config({path: ".env"})

let baseUrl = `http://${process.env.BACKEND_ADD}:${process.env.BACKEND_PORT}`;

const App = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentItem, setCurrentItem] = useState({ item_id: '', item_name: '', category: '', quantity: '', price: '' });
  const [flashMessage, setFlashMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // You can change the number of items per page

  // Fetch items from the backend
  useEffect(() => {
    fetchItems();
    console.log(items);
  }, [searchQuery]);

  const fetchItems = async () => {
    try {
      let url = searchQuery ? `${baseUrl}/items/search?query=${searchQuery}` : `${baseUrl}/items`;
      const response = await axios.get(url);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items', error);
      setFlashMessage({ message: 'Error fetching items', type: 'error' });
    }
  };

  const handleSave = async () => {
    try {
      if (isEdit) {
        await axios.put(`${baseUrl}/items/${currentItem.item_id}`, currentItem);
        setFlashMessage({ message: 'Item updated successfully', type: 'success' });
      } else {
        await axios.post(`${baseUrl}/items`, currentItem);
        setFlashMessage({ message: 'Item added successfully', type: 'success' });
      }
      fetchItems();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving item', error);
      setFlashMessage({ message: `Error saving item: ${error.response.data.error}`, type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    try {
      
      
      Swal.fire({
        title: 'Are you sure you want to delete this item?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete(`${baseUrl}/items/${id}`);
          setFlashMessage({ message: 'Item deleted successfully', type: 'success' });
          fetchItems();
        }
      })
      
    } catch (error) {
      console.error('Error deleting item', error);
      setFlashMessage({ message: 'Error deleting item: ' + error.response?.data.error, type: 'error' });
    }
  };

  const resetForm = () => {
    setCurrentItem({ item_id: '', item_name: '', category: '', quantity: '', price: '' });
    setIsEdit(false);
  };

  const openEditDialog = (item) => {
    setCurrentItem(item);
    setIsEdit(true);
    setIsDialogOpen(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  return (
    <div className="container mx-auto min-h-screen  p-6">
      <h1 className="title font-bold mb-4 text-center">Inventory Management System</h1>
      {flashMessage && (
        <FlashMessage message={flashMessage.message} type={flashMessage.type} setFlashMessage={setFlashMessage} />
      )}
      <div className="flex flex-col items-center gap-y-4 min-[450px]:flex-row min-[450px]:justify-between mb-4">
        <SearchBar setSearchQuery={setSearchQuery} />

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
        >
          Add Item
        </button>
      </div>
      <div>

      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <ItemTable items={currentItems} onEdit={openEditDialog} onDelete={handleDelete} />
      

      <ItemDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        currentItem={currentItem}
        setCurrentItem={setCurrentItem}
        isEdit={isEdit}
      />
    </div>
  );
};

export default App;
