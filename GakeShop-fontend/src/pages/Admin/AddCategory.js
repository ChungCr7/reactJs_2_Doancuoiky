import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    status: true,
  });

  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const fetchCategories = async () => {
    const { data } = await axios.get("http://localhost:5000/api/categories");
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/categories/${editingId}`, form);
        setMessage("Category updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/categories", form);
        setMessage("Category added successfully");
      }
      setForm({ name: "", status: true });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      setMessage("Error saving category");
    }
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, status: cat.status });
    setEditingId(cat._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/categories/${id}`);
    fetchCategories();
  };

  return (
    <div className="max-w-[1200px] mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      {/* Nút quay lại */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-black underline hover:text-blue-600 transition duration-200"
        >
          <FaArrowLeft className="mr-2" />
          Quay Lại
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold text-center mb-4">
            {editingId ? "Edit Category" : "Add Category"}
          </h2>

          {message && <p className="text-green-600 mb-4">{message}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Category Name</label>
              <input
                name="name"
                placeholder="Category name"
                className="w-full border px-4 py-2 rounded"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block mb-1">Status</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="status"
                    checked={form.status === true}
                    onChange={() => setForm({ ...form, status: true })}
                  /> Active
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="status"
                    checked={form.status === false}
                    onChange={() => setForm({ ...form, status: false })}
                  /> Inactive
                </label>
              </div>
            </div>

            <button type="submit" className="w-full bg-[#d89c4c] text-white py-2 rounded">
              {editingId ? "Update" : "Save"}
            </button>
          </form>
        </div>

        <div>
          <h3 className="text-2xl text-center font-semibold mb-4">Category Details</h3>
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">Sl No</th>
                <th className="p-2">Category</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, i) => (
                <tr key={cat._id} className="border-t">
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2">{cat.name}</td>
                  <td className="p-2">{cat.status ? "Active" : "Inactive"}</td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="bg-[#d89c4c] px-3 py-1 rounded text-white flex items-center gap-1"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="bg-red-500 px-3 py-1 rounded text-white flex items-center gap-1"
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-sm text-gray-500 mt-2">
            Total Categories: {categories.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
