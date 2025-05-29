# Job Portal

## Setup Instructions

Follow these steps to set up the **Job Portal** project locally:

### Prerequisites

- **Node.js** (version 14 or higher)
- **MongoDB** (running locally or use MongoDB Atlas)
- **npm** or **yarn**

### Step 1: Clone the repository

Clone the repository to your local machine using:

```bash
git clone https://github.com/Ranjan-chauhan/Job-Portal.git
```

### Step 2: Install Dependencies
Navigate to the project folder and install dependencies for both the client and server.

Server Setup:
```bash
 cd server
 npm install
```

Client Setup:
```bash
cd client
npm install
```

### Step 3: Set Up Environment Variables
Create a .env file in the root directory of the server, and add the following variables:
```bash
PORT=3000
JWT_SECRET=your_jwt_secret_key
MONGO_URI=your_mongodb_connection_string
```

### Step 4: Run the Project

Start the Server
```bash
cd server
npm run dev
```
Start the Client
```bash
cd client
npm start
```

Visit Live Application :  https://job-portal-livid-nine.vercel.app/

### Features & Implementation Details
1. **User Authentication (JWT) :**  Role bases Authentication for Users (jobseekers & employers).
   
3. **Job Listings (CRUD) :**  Employers can create, read, update, and delete job listings and Jobseekers can view job listings and apply for jobs.

3. **Job Application System :** Jobseekers can upload their resume (PDF format) and submit a cover letter while applying for jobs and track their applications.

4. **Role-Based Access Control (RBAC) :** Role-based authorization is implemented using JWT. Only jobseekers can apply for jobs, and only employers can view applicants and manage job listings.

5. **File Upload (Resume) :** Jobseekers can upload their resume (PDF file) as part of the application process. The resume is handled via multer.

6. **Dashboard :** Employers can see a dashboard with all applicants for their job listings and Jobseekers can view the status of their job applications.

7. **Responsive UI :** The client-side is built using React and TailwindCSS, ensuring a responsive and smooth user experience across all devices.

8. **Frontend Features :** Jobseekers can apply for jobs directly from the job details page and Employers can view the applicants for each job listing they post.

### Technologies Used :

1. **Frontend:** React.js, TailwindCSS, React Router, Redux

2. **Backend:** Node.js, Express.js, MongoDB, JWT, Multer

3. **Authentication:** JWT with role-based access control (RBAC)

4. **File Upload:** Multer for handling resume uploads

