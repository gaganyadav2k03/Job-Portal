# Job Portal

## Setup Instructions

Follow these steps to set up the **Job Portal** project locally:

### Prerequisites

- **Node.js** (version 14 or higher)
- **MongoDB** (running locally or use MongoDB Atlas)
- **npm** or **yarn**


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


