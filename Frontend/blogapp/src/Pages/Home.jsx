import PublicNavBar from '../Pages/NavBar/PublicNavBar';
import { NavLink } from 'react-router-dom';
import blog from '../assets/images/blog.jpg'
import blog1 from '../assets/images/blog1.jpg'
import blog2 from '../assets/images/blog2.jpg'
import blog3 from '../assets/images/blog3.jpg'
import blog4 from '../assets/images/blog4.jpg'

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-neutral-50 via-orange-100 to-amber-50"> 
      <PublicNavBar />
      <div className="pt-20"> 

        <section className="bg-transparent dark:bg-gray-900">
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 grid lg:grid-cols-2 gap-8 lg:gap-16">
        <div className="flex flex-col justify-center">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Unleashing Creativity Through Connection</h1>
            <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">At JustBlog, we believe in the power of storytelling and the impact of shared ideas. Join us as we explore the intersections of innovation, inspiration, and community, fostering a space where voices are heard and creativity flourishes.</p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0">
                <NavLink to="/signup" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
                    Get started
                    <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                    </svg>
                </NavLink>
                
            </div>
        </div>
        <div>
            <img className="mx-auto w-full lg:max-w-xl h-64 rounded-lg sm:h-96 shadow-xl" src={blog} alt="image" />
        </div>

        <div>
            <img className="mx-auto w-full lg:max-w-xl h-64 rounded-lg sm:h-96 shadow-xl" src={blog1} alt="image" />
        </div>

        <div>
            <img className="mx-auto w-full lg:max-w-xl h-64 rounded-lg sm:h-96 shadow-xl" src={blog2} alt="image" />
        </div>

        <div>
            <img className="mx-auto w-full lg:max-w-xl h-64 rounded-lg sm:h-96 shadow-xl" src={blog3} alt="image" />
        </div>

        <div>
            <img className="mx-auto w-full lg:max-w-xl h-64 rounded-lg sm:h-96 shadow-xl" src={blog4} alt="image" />
        </div>
    </div>
</section>
</div>
    </div>
  );
};

export default Home;
