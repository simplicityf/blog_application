import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import axios from "../../utils/axiosConnect";
import moment from 'moment';
import { Modal, Button } from 'react-bootstrap'

const AdminCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPage, setTotalPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const [toastShown, setToastShown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [category, setCategory] = useState(null);
    const navigate = useNavigate();

    const handleError = (error) => {
        const message = error.response?.data?.message || "An error occurred.";
        toast.error(message);
    };

    useEffect(() => {
        const getCategories = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/category?page=${currentPage}&q=${searchValue}`);
                const data = response.data.data;
                console.log('Categories:', response.data);

                setCategories(data);
                setTotalPage(response.data.pages); // Use 'pages' to set total pages

                toast.success(response.data.message);
                setToastShown(true); // Set the toast as shown

                setLoading(false)
                setToastShown(false)

            } catch (error) {
                handleError(error);
                setLoading(false)
            }
        };

            getCategories();
    }, [currentPage, searchValue, toastShown]);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
        setToastShown(false)
    };

    const handleNext = () => {
        if (currentPage < totalPage) setCurrentPage(prev => prev + 1);
        setToastShown(false)
    };

    const handleSearch = async (e) => {
        try {
            const input = e.target.value
            setSearchValue(input);
            const response = await axios.get(`/category?q=${input}&page=${currentPage}`)
            const data = response.data.data;
            setCategories(data);
            setTotalPage(response.data.pages);
        } catch (error) {
            const response = error.response;
            const data = response?.data || { message: "Invalid Credential, please try again." };
            toast.error(data.message);
        }
    }

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`/category/${category}`);
            const data = response.data;
            setShowModal(false)
            toast.success(data.message);
            const response2 = await axios.get(`/category?page=${currentPage}&q=${searchValue}`);
            const data2 = response2.data.data;
            console.log('Categories:', response2.data);
            
                setCategories(data2);
                setTotalPage(response2.data.pages); // Use 'pages' to set total pages
            
        } catch (error) {
            handleError(error);
            setShowModal(false)

        }
    }

    return (
        <div className="pt-10">
            <div className="text-left">
                <button
                    type="button"
                    className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    onClick={() => navigate("/categories/new-category")}
                >
                    Add Category
                </button>
                <form className="mb-3" onChange={handleSearch}>
                    <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="search categories..." required />
                        <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                    </div>
                </form>
            </div>
            <p className="text-zinc-950 text-center pt-10 mb-5">Categories</p>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">

                {loading ? (
                    <div className="spinner">Loading...</div>
                ) : (
                    categories.length > 0 ? (
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mb-8">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Title</th>
                                    <th scope="col" className="px-6 py-3">Description</th>
                                    <th scope="col" className="px-6 py-3">UpdatedBy</th>
                                    <th scope="col" className="px-6 py-3">CreatedAt</th>
                                    <th scope="col" className="px-6 py-3">UpdatedAt</th>
                                    <th scope="col" className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr key={category._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td className="px-6 py-4">{category.title}</td>
                                        <td className="px-6 py-4">{category.desc || 'No description provided'}</td>
                                        <td className="px-6 py-4">{category.updatedBy}</td>
                                        <td className="px-6 py-4">{moment(category.createdAt).format("YYYY-MM-DD HH:mm:ss")}</td>
                                        <td className="px-6 py-4">{moment(category.updatedAt).format("YYYY-MM-DD HH:mm:ss")}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                type="button"
                                                className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                                onClick={() => navigate(`/categories/update-category/${category._id}`)}
                                            >
                                                Update
                                            </button>
                                            <button
                                                type="button"
                                                className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                                onClick={() => { setShowModal(true); setCategory(category._id) }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No categories found.</p>
                    )
                )}
            </div>

            {/* Render Pagination Buttons */}
            {totalPage > 1 && ( // Only show if more than one page
                <div className="flex flex-col items-center mb-5 mt-5">
                    <div className="inline-flex mt-2 xs:mt-0">
                        <button
                            className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-sky-600 rounded-s hover:bg-gray-900"
                            onClick={handlePrev}
                            disabled={currentPage === 1} style={{ backgroundColor: currentPage > 1 ? 'rgb(2 132 199)' : 'rgb(163 163 163)' }}>
                            Prev
                        </button>
                        <button
                            className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-sky-600 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900"
                            onClick={handleNext}
                            disabled={currentPage === totalPage} style={{ backgroundColor: currentPage < totalPage ? 'rgb(2 132 199)' : 'rgb(163 163 163)' }}>
                            Next
                        </button>
                    </div>
                </div>
            )}


            <Modal
                show={showModal}
                onHide={() => { setShowModal(false); setCategory(null) }}
                dialogClassName="custom-modal"  // Custom class for the modal
                centered={false}  // Disable vertical centering for custom positioning
            >
                <Modal.Header closeButton className="bg-info text-white">
                    <Modal.Title className="w-100 text-center">Delete Category?</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center bg-light">
                    <p>Are you sure you want to delete this category permanently?</p>
                </Modal.Body>
                <hr />
                <Modal.Footer className="d-flex justify-content-center bg-light">
                    <Button
                        className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        onClick={() => { setShowModal(false); setCategory(null) }} style={{ color: "black" }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                    >
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>



        </div>
    );
};

export default AdminCategory;
