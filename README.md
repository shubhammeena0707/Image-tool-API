# Image Tools API

A RESTful API built with Node.js and Express for user authentication and server-side image processing. The API allows users to create accounts, authenticate using JWT, upload images, apply various image transformations, and manage their processed image history.

Image processing is powered by `sharp`, with support for resizing, format conversion, brightness adjustment, contrast adjustment, and target file-size compression.

## Features

* **User Authentication**

  * User registration and login
  * Secure password hashing using `bcryptjs`
  * JWT-based authentication for protected routes

* **Image Processing**

  * Upload JPEG, JPG, PNG, and WebP images
  * Resize images to custom dimensions
  * Convert between JPEG, PNG, and WebP formats
  * Adjust image brightness and contrast

* **Target-Size Compression**

  * Compress JPEG and WebP images to a specified target size
  * Uses binary search to determine an appropriate quality level

* **Image History**

  * Processed images are associated with the authenticated user
  * Users can view their processed image history through their profile

* **Image Management**

  * Delete individual processed images
  * Clear all processed images associated with a user

## Tech Stack

* **Node.js** — JavaScript runtime
* **Express.js 5** — HTTP server and API routing
* **MongoDB** — Database
* **Mongoose** — MongoDB object modeling
* **Sharp** — Server-side image processing
* **Multer** — Multipart file upload handling using in-memory storage
* **JSON Web Token (JWT)** — Authentication
* **bcryptjs** — Password hashing
* **dotenv** — Environment variable management
* **CORS** — Cross-Origin Resource Sharing

## Project Structure

```text
.
├── server.js                 # Application entry point, DB connection, middleware, and routes
├── middleware/
│   └── auth.js               # JWT authentication middleware
├── models/
│   ├── User.js               # User schema
│   └── Image.js              # Processed image schema
├── routes/
│   ├── auth.js               # Authentication routes
│   └── image.js              # Image processing and management routes
└── package.json
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js (LTS version recommended)
* npm
* MongoDB (local installation or MongoDB Atlas)

### Installation

Clone the repository:

```bash
git clone https://github.com/PiyushSankhala123/Image-Tools-API.git
```

Navigate to the project directory:

```bash
cd Image-Tools-API
```

Install the dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/image-tools
JWT_SECRET=your_jwt_secret_here
```

> **Important:** Do not commit your `.env` file to GitHub. Add `.env` to your `.gitignore` file to protect sensitive credentials.

## Running the Server

Start the application with:

```bash
node server.js
```

The API will run at:

```text
http://localhost:3000
```

or on the port specified in your `.env` file.

Processed images are stored in the `processed/` directory and served through:

```text
/processed/<filename>
```

## API Reference

Protected endpoints require a JWT token in the request header:

```text
Authorization: Bearer <token>
```

The token is returned after successful registration or login.

### Authentication — `/api/auth`

| Method | Endpoint    | Authentication | Description                                                   |
| ------ | ----------- | -------------- | ------------------------------------------------------------- |
| POST   | `/register` | No             | Register a new user using `username`, `email`, and `password` |
| POST   | `/login`    | No             | Log in using `email` and `password`                           |
| GET    | `/profile`  | Yes            | Get the authenticated user's profile and processed images     |

### Images — `/api/image`

| Method | Endpoint     | Authentication | Description                                                     |
| ------ | ------------ | -------------- | --------------------------------------------------------------- |
| POST   | `/process`   | Yes            | Upload and process an image                                     |
| DELETE | `/:id`       | Yes            | Delete a processed image by its database ID                     |
| DELETE | `/clear-all` | Yes            | Delete all processed images belonging to the authenticated user |

## Image Processing

### `POST /api/image/process`

The endpoint accepts `multipart/form-data`.

| Field          | Type   | Required | Description                                                         |
| -------------- | ------ | -------- | ------------------------------------------------------------------- |
| `image`        | File   | Yes      | Input image. Supported formats: JPEG, JPG, PNG, WebP                |
| `format`       | String | No       | Output format: `jpeg`, `png`, or `webp`. Default: `jpeg`            |
| `width`        | Number | No       | Output width in pixels. Requires `height`                           |
| `height`       | Number | No       | Output height in pixels. Requires `width`                           |
| `compressSize` | Number | No       | Target output size in KB for JPEG/WebP compression                  |
| `brightness`   | Number | No       | Brightness multiplier. Example: `1.0` keeps the original brightness |
| `contrast`     | Number | No       | Contrast adjustment value                                           |

## Example Request

Process and convert an image using `curl`:

```bash
curl -X POST http://localhost:3000/api/image/process \
  -H "Authorization: Bearer <token>" \
  -F "image=@photo.jpg" \
  -F "format=webp" \
  -F "width=800" \
  -F "height=600" \
  -F "compressSize=200"
```

## Security and Validation

* Uploaded files are validated using both MIME type and file extension.
* Supported input formats are JPEG, JPG, PNG, and WebP.
* Passwords are hashed using `bcryptjs` before being stored in the database.
* The password field is excluded from database queries by default using `select: false`.
* Protected routes require a valid JWT access token.
* Sensitive credentials and secrets should be stored in environment variables and never committed to version control.

## Storage

Processed images are saved to the `processed/` directory in the project root. The directory is created automatically if it does not already exist.

Processed files can be accessed through:

```text
/processed/<filename>
```

Each processed image is linked to the authenticated user in the database, allowing users to view and manage their image processing history.
