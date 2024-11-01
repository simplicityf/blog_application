#Blog Application
#Description
This is a full-stack blog application built with Node.js and React. The app allows users to register, create, edit, and manage blog posts. It features a secure and scalable backend, integrated third-party APIs, and cloud services for file storage and user management.

Features
User Authentication: Secure login and registration using Google OAuth 2.0.
Email Verification: New users are sent a verification email to confirm their account.
Password Reset: Forgot password functionality, allowing users to securely reset their password via email.
File Uploads: Users can upload images or documents associated with their blog posts using AWS S3 for secure file storage.
CRUD Operations: Full Create, Read, Update, Delete functionality for blog posts.
Responsive Design: Fully responsive and intuitive UI built with React.
Scalable Backend: Backend API built with Node.js and Express, and data is stored in MongoDB Atlas for scalability.
Tech Stack
Frontend: React, Flowbite, Tailwind
Backend: Node.js, Express.js
Database: MongoDB Atlas (NoSQL)
File Storage: AWS S3 for media files
Authentication: Google OAuth 2.0 for user authentication and email services
APIs: Various third-party APIs for additional features
Setup Instructions
Prerequisites
Node.js installed
MongoDB Atlas account (or local MongoDB installation)
AWS S3 bucket setup
Google Cloud credentials for OAuth 2.0
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/simplicityf/blog_application.git
Navigate into the project directory:

bash
Copy code
cd blog_application
Install server dependencies:

bash
Copy code
npm install
Install client dependencies (React frontend):

bash
Copy code
cd client
npm install
Environment Variables
Set up a .env file in the root of the project with the following variables:

bash
Copy code
# MongoDB
PORT = port_number
CONNECTIONURL=your_mongodb_atlas_connection_string

# AWS S3
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your_bucket_name
AWS_REGION=your_aws_region

# Google OAuth
SENDER_EMAIL: your_email
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
REFRESH_TOKEN=your_google_refresh_token

# JWT Secret
JWT_SECRET=your_jwt_secret_key
MY_SCECRET_KEY=your_secret_key

Running the Application
Start the server:

bash
Copy code
npm start
Start the client (in the client directory):

bash
Copy code
npm start
The application should now be running at http://localhost:3000 for the frontend and http://localhost:5000 for the backend.


https://github.com/user-attachments/assets/85dd1605-55c1-4196-92ec-e55e6a64ff7f


Future Improvements
Extending the application for user to interact with each other's content
Add comments and likes to enhance user interaction.
Improve SEO for blog posts.
Integrate social sharing features.
License
This project is licensed under the MIT License.

Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Contact
If you have any questions, feel free to reach out! omobolanlehazeezat@gmail.com
