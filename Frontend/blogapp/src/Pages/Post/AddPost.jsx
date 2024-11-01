import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../../utils/axiosConnect";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AddPostValidator from '../Validators/AddPostValidator'

const initialFormData = {
    title: '',
    desc: '',
    category: '',
};

const initialFormError = {
    desc: '',
    category: '',
};
const AddPost = () => {


    const [formData, setFormData] = useState(initialFormData);
    const [formError, setFormError] = useState(initialFormError);
    const [loading, setLoading] = useState(false);
   
    const [categories, setCategories] = useState([])
    const [fileId, setFileId] = useState([]);
    const [extensionError, setExtensionError] = useState(null)
    const [isDisable, setIsDisable] = useState(false)
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };


    useEffect(() => {
        const getCategories = async () => {
            try {

                const response = await axios.get('/category?size=1000');
                const data = response.data.data;
                console.log('Categories:', response.data);

                setCategories(data);

            } catch (error) {
                const data = error.response
                toast.error(data)

            }
        };

   
            getCategories();
       
    }, []);

    console.log("FormData", formData)


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate only the title, as desc and file are optional
        const errors = AddPostValidator({ desc: formData.desc, category: formData.category });

        if (errors.desc || errors.category) {
            setFormError(errors);
        }

        try {
            setLoading(true);

            let input = formData;
            console.log("FormData before sending:", formData)
            console.log("Submitting post data:", input);

            if (fileId) {
                input = { ...input, file: fileId };
            }

            const response = await axios.post('/post/add-post', input);

            const data = response.data;
            toast.success(data.message);
            setFormData(initialFormData); // Reset form data on success
            setFormError(initialFormError); // Reset form errors on success
            setLoading(false);
            navigate("/post")
        } catch (error) {
            setLoading(false);
            console.log('Upload error:', error);
            const data = error.response ? error.response.data : { message: "An error occurred." };
            toast.error(data.message);
            console.error('Upload error:', error); // Log the error for debugging
        }
    };


    const handleFileChange = async (e) => {
        // const file = e.target.files[0];
        console.log("e target file", e.target.files)
        // if (!file) return; // Exit if no file is selected

        // console.log("Selected file:", file);
        const formInput = new FormData();
        formInput.append('file', e.target.files[0]);

        const type = (e.target.files[0].type).toLowerCase();
        if (type === 'image/png' || type === 'image/jpg' || type === 'image/jpeg' || type === 'video/mp4') {
            setExtensionError(null);
            try {
                setLoading(true)
                setIsDisable(true)

                const response = await axios.post('/file/upload', formInput)
                const data = response.data;
                setFileId(data.data._id)

                console.log("data for file", data)

                toast.success(data.message)
                
                setIsDisable(false)
                setLoading(false)
            } catch (error) {
                setLoading(false)
                setIsDisable(false)
                setFormError(initialFormError)
                const data = error.response
                toast.error(data.message);

            }
        } else {
            setExtensionError("Invalid file type. Only PNG, JPG, JPEG, and MP4 are allowed.")
            console.error('File upload error:'); // Log the error for debugging
        }

    }

    return (
        <div>

            <div className="text-left">
                <button
                    type="button"
                    className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    onClick={() => navigate(-1)}
                >
                    Go Back
                </button>
            </div>

            <section className="bg-white dark:bg-gray-900">
                <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Upload a post</h2>


                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                            <div className="sm:col-span-2">
                                <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                                <input type="text" name="title" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder=" product title" value={formData.title}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="desc" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                <textarea id="desc" name="desc" rows="8" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Your description here" value={formData.desc}
                                    onChange={handleChange}
                                ></textarea>
                                {formError.desc && <p className="text-red-500 text-xs">{formError.desc}</p>}

                            </div>

                            <div>
                                <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                                <select id="category" name="category" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" value={formData.category}
                                    onChange={handleChange}>
                                    {categories.map((category) => (
                                        <option key={category._id} value={category._id}>{category.title}</option>
                                    ))}

                                </select>
                                {formError.category && <p className="text-red-500 text-xs">{formError.category}</p>}
                            </div>
                        </div>

                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file">Upload File</label>
                        <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file" type="file" name="file" onChange={handleFileChange} />
                        {extensionError && <p className="text-red-500 text-xs"> {extensionError} </p>}
                        <input
                            type="submit"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-16 mt-10"
                            disabled={isDisable} value={`${loading ? 'Uploading....' : 'Upload'}`} 
                        />

                    </form>
                </div>
            </section>
        </div>
    )
}

export default AddPost