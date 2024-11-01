import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../../utils/axiosConnect";
import { toast } from "react-toastify";
import moment from 'moment';
import { Modal, Button } from 'react-bootstrap'
import { useAuth } from "../../Components/context/useAuth";

const DetailPost = () => {

  const navigate = useNavigate();
  const params = useParams();
  const postId = params.id;
  const [posts, setPost] = useState(null);
  const [fileUrl, setFileUrl] = useState(null)
  const [showModal, setShowModal] = useState(false);
  const {user} = useAuth();


  console.log("postId", postId)


  useEffect(() => {
    const getPost = async () => {
      try {

        const response = await axios.get(`/post/${postId}`);
        const data = response.data.data;

        console.log('Post:', response.data);

        setPost(data)

      } catch (error) {

        const data = error.response ? error.response.data : { message: "An error occurred." };
        toast.error(data.message);
        console.error('Get category error:', error); // Log the error for debugging
      }
    };
    getPost();
  }, [postId]);
  console.log("Post:", posts)

  useEffect(() => {
    if (posts && posts?.file) {

      console.log("This is File Key:", posts?.file.key);

      const getFile = async () => {
        try {
          const response = await axios.get(`/file/signed-url?key=${posts.file.key}`);
          const data = response.data.data
          setFileUrl(data);
        } catch (error) {
          const data = error.response ? error.response.data : { message: "An error occurred." };
          toast.error(data.message);
          console.error('Get file error:', error); // Log the error for debugging
        }
      }; getFile()
    }
  }, [posts])

  console.log("File Url", fileUrl, "span")

  const handleDelete = async () => {
    try {
        const response = await axios.delete(`/post/${postId}`);
        const data = response.data;
        setShowModal(false)
        toast.success(data.message);
          navigate("/post")
        
    } catch (error) {
      const data = error.response ? error.response.data : { message: "An error occurred." };
      toast.error(data.message);
      console.error('Delete post error:', error); // Log the error for debugging
        setShowModal(false)

    }
}

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



      {posts ? (
      <>
        <h5 className="text-xl font-bold dark:text-white mx-auto mt-4 text-center">Title: {posts?.title}</h5>
        <p className="text-4xl font-thin text-gray-900 dark:text-white mt-2">Category: {posts?.category?.title}</p>
        <p className="text-lg text-gray-900 dark:text-white mt-5"> 
          <i> Created At: {moment(posts?.createdAt).format("YYYY-MM-DD HH:mm:ss")}</i>
        </p>
        <p className="text-lg text-gray-900 dark:text-white"> 
          <i> Updated At: {moment(posts?.updatedAt).format("YYYY-MM-DD HH:mm:ss")} </i>
        </p>
        <p className="text-lg text-gray-900 dark:text-white"> 
          <i> Posted By: {posts?.updatedBy?.name} </i>
        </p>

        {/* Conditionally render the file if it exists */}
        {fileUrl && (
          <img
            className="h-96 w-9/12 rounded-lg mt-6 mb-8 ml-20"
            src={fileUrl}
            alt="Post image"
          />
        )}
        <p className="text-center text-gray-500 dark:text-gray-400 mb-16">{posts?.desc}</p>

        {(user.role === 'vip' || user.role === 'admin') && (
          <>
          <button
          type="button"
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-12"
          onClick={() => navigate(`/post/update-post/${posts._id}`)}
        >
          Update
        </button>
        <button
          type="button"
          className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-12"
          onClick={() => { setShowModal(true); setPost(posts._id) }}
        >
          Delete
        </button>
          </>
        )}
      </>
    ) : (
      <p>Loading post details...</p>
    )}

    {/* Modal for delete confirmation */}
    <Modal
      show={showModal}
      onHide={() => { setShowModal(false); setPost(null); }}
      dialogClassName="custom-modal"
      centered={false}
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
          onClick={() => { setShowModal(false); setPost(null); }}
          style={{ color: "black" }}
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


    </div> //setShowModal(true); setCategory
  )
}

export default DetailPost