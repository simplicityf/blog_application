import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../../utils/axiosConnect";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AddCategoryValidator from "../Validators/AddCategoryValidator";

const initialFormData = {
  title: '',
  desc: '',
};

const initialFormError = {
  title: '',
};

const UpdateCategories = () => {
  

  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const categoryId = params.id;

  console.log("Category Id", categoryId);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  console.log(formData);

  useEffect(() => {
    const getCategory = async () => {
      try {
        const response = await axios.get(`/category/${categoryId}`);
        const data = response.data.data;
        console.log('Category:', response.data);

        // Corrected the path to access title and desc
        if (data) {
          setFormData({ title: data.title, desc: data.desc });
        } else {
          toast.error("Category not found");
        }
      } catch (error) {
        const data = error.response ? error.response.data : { message: "An error occurred." };
        toast.error(data.message);
        console.error('Get category error:', error); // Log the error for debugging
      }
    };
    getCategory();
  }, [categoryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate only the title, as desc and file are optional
    const errors = AddCategoryValidator({ title: formData.title });

    if (errors.title) {
      setFormError(errors);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.put(`/category/${categoryId}`, formData);

      const data = response.data;
      toast.success(data.message);
      setFormData(initialFormData); // Reset form data on success
      setFormError(initialFormError); // Reset form errors on success
      setLoading(false);
      navigate("/categories");
    } catch (error) {
      setLoading(false);
      const data = error.response ? error.response.data : { message: "An error occurred." };
      toast.error(data.message);
      console.error('Upload error:', error); // Log the error for debugging
    }
  };

  return (
    <div className="pt-16">
      <div className="text-left">
        <button
          type="button"
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>

      <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
        <div className="mb-5">
          <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
          />
          {formError.title && <p className="text-red-500 text-xs">{formError.title}</p>}
        </div>

        <label htmlFor="desc" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description (optional)</label>
        <textarea
          id="desc"
          name="desc"
          rows="4"
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Write your thoughts here..."
          value={formData.desc}
          onChange={handleChange}
        ></textarea>

        <input
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-16 mt-10"
          value={loading ? 'Uploading....' : 'Upload'}
        />
      </form>
    </div>
  );
};

export default UpdateCategories;
