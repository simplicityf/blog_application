import justblog from "../../assets/images/just_blog.jpg";
import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import axios from "../../utils/axiosConnect";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const GetPosts = () => {
  const [posts, setPost] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(1); // Total number of pages
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [searchValue, setSearchValue] = useState("");
  const [fileUrls, setFileUrls] = useState({}); // Changed to an object to store multiple URLs
  const navigate = useNavigate();

  const handleError = (error) => {
    const message = error.response?.data?.message || "An error occurred.";
    toast.error(message);
  };

  useEffect(() => {
    const getPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/post?page=${currentPage}&q=${searchValue}`);
        const data = response.data.data;

        console.log('Posts:', response.data);
        setPost(data.posts);
        setTotalPage(response.data.pages); // Use 'pages' to set total pages

        toast.success(response.data.message);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        handleError(error);
      }
    };

    getPost();
  }, [currentPage, searchValue]); // Added currentPage as a dependency

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPage) setCurrentPage(prev => prev + 1);
  };

  const handleSearch = async (e) => {
    try {
      setLoading(false)
      const input = e.target.value;
      setSearchValue(input);
      const response = await axios.get(`/post?q=${input}&page=${currentPage}`);
      const data = response.data.data;
      setPost(data);
      setTotalPage(response.data.pages);
      setLoading(false)
    } catch (error) {
      setLoading(false);
      const response = error.response;
      const data = response?.data || { message: "Invalid Credential, please try again." };
      toast.error(data.message);
    }
  };

  useEffect(() => {
    // Fetch and set file URL when posts have a file key
    const getFileUrls = async () => {
      try {
        const newFileUrls = {}; // New object to store URLs
        for (const post of posts) {
          if (post?.file && post?.file.key) {
            console.log("This is File Key:", post.file.key);
            const response = await axios.get(`/file/signed-url?key=${post.file.key}`);
            newFileUrls[post.file.key] = response.data.data; // Map key to URL
          }
        }
        setFileUrls(newFileUrls); // Store all file URLs
      } catch (error) {
        const data = error.response ? error.response.data : { message: "An error occurred." };
        toast.error(data.message);
        console.error('Get file error:', error); // Log the error for debugging
      }
    };

      getFileUrls();
  
  }, [posts]); // Depend on posts to refetch URLs when posts change

  return (
    <div className="pt-10">
      <form className="mb-8" onChange={handleSearch}>
        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="search posts..." required />
          <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
        </div>
      </form>

      {loading ? (
        <div className="text-center">
          <div role="status">
            <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
         {posts.map((post) => (
            <div
            className="max-w-xs bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
            key={post._id}
          >
            <a href="#">
              <img
                className="rounded-t-lg h-48 w-full object-cover"
                src={fileUrls[post.file?.key] || justblog}
                alt={post.title}
              />
            </a>
            <div className="p-4">
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
               <small>{moment(post.updatedAt).format("YYYY-MM-DD HH:mm:ss")} </small>
              </p>
              <a href="#">
                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {post.title}
                </h5>
              </a>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                {post.desc.substring(0,50)}
              </p>
              <button
                type="button"
                className="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                onClick={() => navigate(`/post/detail-post/${post._id}`)}
              >
                Read More
              </button>
            </div>
          </div>
          ))
        }</div>
        ) : (
          <p>No Post found.</p>
        )
      )}






      {/* Render Pagination Buttons */}
      {totalPage > 1 && ( // Only show if more than one page
        <div className="flex flex-col items-center mb-5 mt-5">
          <div className="inline-flex mt-2 xs:mt-0">
            <button
              className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-sky-600 rounded-l hover:bg-gray-900"
              onClick={handlePrev}
              disabled={currentPage === 1}
              style={{ backgroundColor: currentPage > 1 ? 'rgb(2 132 199)' : 'rgb(163 163 163)' }}
            >
              Prev
            </button>
            <button
              className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-sky-600 rounded-r hover:bg-gray-900"
              onClick={handleNext}
              disabled={currentPage === totalPage}
              style={{ backgroundColor: currentPage < totalPage ? 'rgb(2 132 199)' : 'rgb(163 163 163)' }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  
  );
};

export default GetPosts;
