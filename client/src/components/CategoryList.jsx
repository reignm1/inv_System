import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';
import AddEditCategoryModal from './AddEditCategoryModal';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    const res = await axios.get('http://localhost:5000/api/categories');
    setCategories(res.data);
  };

  const handleSave = async (category) => {
    if (editCategory) {
      await axios.put(`http://localhost:5000/api/categories/${editCategory.category_ID}`, category);
    } else {
      await axios.post('http://localhost:5000/api/categories', category);
    }
    fetchCategories();
    setShowModal(false);
    setEditCategory(null);
  };

  const handleEdit = (cat) => {
    setEditCategory(cat);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/categories/${id}`);
    fetchCategories();
  };

  return (
    <div className="card shadow-sm border-0 rounded-4 mb-4">
      <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-bold">Category List</h5>
        <Button variant="primary" size="sm" onClick={() => { setEditCategory(null); setShowModal(true); }}>Add Category</Button>
      </div>
      <div className="card-body">
        <Table hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center text-muted">No categories found.</td>
              </tr>
            ) : (
              categories.map(cat => (
                <tr key={cat.category_ID}>
                  <td>{cat.category_ID}</td>
                  <td>{cat.category_Name}</td>
                  <td>
                    <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleEdit(cat)}>Edit</Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(cat.category_ID)}>Delete</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
      <AddEditCategoryModal
        show={showModal}
        handleClose={() => { setShowModal(false); setEditCategory(null); }}
        handleSave={handleSave}
        initial={editCategory}
      />
    </div>
  );
};

export default CategoryList;