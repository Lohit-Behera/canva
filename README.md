# User Authentication and Form Submission with Image Upload

This project implements a user authentication system and a form submission feature with image upload, using React.js for the frontend, Node.js for the backend, and MongoDB as the database.

## Features

1. **Authentication System**:

   - **Google Login**: Allows users to log in using their Google accounts. User data (email, name, profile image) is stored in MongoDB.
   - **Standard Login and Registration**:
     - Register with email and password.
     - Login for registered users.
     - Secure password hashing before storage.

2. **Form Submission**:

   - Users are redirected to a protected form page after logging in.
   - Form fields include:
     - First Name
     - Last Name
     - Thumbnail (image upload)
   - Uploaded images are stored in cloud storage, and URLs are saved in the database.

3. **Database Design**:

   - **Users Collection**:
     - Stores user ID, email, hashed password, and profile image URL.
   - **Forms Collection**:
     - Stores form data (first name, last name, image URL) and associated user ID.

4. **Additional Features**:
   - Error handling for all API endpoints.
   - Protected routes using JWT authentication.
   - Fully responsive design with dark/light theme support.

---

### API Routes

| Route                          | Method | Description                                    | Authentication |
| ------------------------------ | ------ | ---------------------------------------------- | -------------- |
| `/api/v1/users/register`       | POST   | Register a new user with avatar upload.        | No             |
| `/api/v1/users/login`          | POST   | Login a user with email and password.          | No             |
| `/api/v1/users/auth/google`    | POST   | Login a user using Google OAuth.               | No             |
| `/api/v1/users/logout`         | GET    | Logout the authenticated user.                 | Yes            |
| `/api/v1/users/details`        | GET    | Fetch the details of the logged-in user.       | Yes            |
| `/api/v1/forms/create`         | POST   | Submit form data with thumbnail upload.        | Yes            |
| `/api/v1/forms/get/:formId`    | GET    | Retrieve a specific form by its ID.            | Yes            |
| `/api/v1/forms/all`            | GET    | Retrieve all forms for the authenticated user. | Yes            |
| `/api/v1/forms/delete/:formId` | DELETE | Delete a specific form by its ID.              | Yes            |

## Tech Stack

### Frontend

- React.js
- React Router
- Tailwind CSS
- Google OAuth Client
- React Toast Notifications (Sonner)

### Backend

- Node.js
- Express.js
- Multer (file handling)
- Cloudinary (image storage)
- JSON Web Tokens (JWT) for authentication
- MongoDB with Mongoose

---

## Installation

### Prerequisites

- Node.js (v18 or later)
- MongoDB
- Cloudinary account for image uploads
- Google OAuth Client ID and Secret

---

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file. There is a .env.sample file provided for reference.

In backend Folder

`PORT`
`CORS_ORIGIN`
`MEMORY`
`MONGODB_URI`
`ACCESS_TOKEN_SECRET`
`ACCESS_TOKEN_EXPIRY`
`REFRESH_TOKEN_SECRET`
`REFRESH_TOKEN_EXPIRY`
`CLOUDINARY_CLOUD_NAME`
`CLOUDINARY_API_KEY`
`CLOUDINARY_API_SECRET`
`CLOUDINARY_URL`
`GOOGLE_CLIENT_ID`
`GOOGLE_CLIENT_SECRET`

In frontend Folder

`VITE_BASE_URL`
`VITE_GOOGLE_CLIENT_ID`

## Run Locally

Clone the repository:

```bash
  git clone https://github.com/Lohit-Behera/canva.git
  cd canva
```

Change .env.sample to .env in both backend and frontend

**Running using [Docker](https://www.docker.com/)**

in root directory

```bash
  docker compose up
```

Then go to [localhost:5173](http://localhost:5173/) for frontend and [localhost:8000](http://localhost:8000/) for backend

**Running without Docker**

change directory to backend

```bash
  cd backend
```

Install node modules

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

Then go to [http://localhost:8000](http://localhost:8000)

In another terminal for React js

Now change directory to frontend

```bash
  cd canva
  cd frontend
```

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

Then go to [http://localhost:5173](http://localhost:5173)
