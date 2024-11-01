import { useNavigate } from "react-router-dom";
import { useState } from "react";
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

const AddCategories = () => {
  

  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

   const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate only the title, as desc and file are optional
    const errors = AddCategoryValidator({ title: formData.title });

    if (errors.title) {
      setFormError(errors);
    }

    try {
      setLoading(true);

      const response = await axios.post('/category', formData)
      
      const data = response.data;
      toast.success(data.message);
      setFormData(initialFormData); // Reset form data on success
      setFormError(initialFormError); // Reset form errors on success
      setLoading(false);
      navigate("/categories")
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

        {/* <div className="flex items-center justify-center w-full mt-10">
          <label htmlFor="file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
            </div>
            <input id="file" type="file" name="file" className="hidden" value={formData.file} onChange={handleChange} />
          </label>
        </div> */}

        <input
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-16 mt-10"
          value={loading ? 'Uploading....' : 'Upload'}
        />
      </form>
    </div>
  );
};

export default AddCategories;
