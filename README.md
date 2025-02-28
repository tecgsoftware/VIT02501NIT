# **Backend Documentation - Secure REST API with JWT & RBAC**

### **Table of Contents**
- [1. Project Overview](#1-project-overview)
- [2. Setup & Installation](#2-setup--installation)
- [3. Model](#3-model)
- [4. API Documentation](#4-api-documentation)
  - [Registration Controller](#registration-controller)
  - [Login Controller](#login-controller)
  - [Logout Controller](#logout-controller)
  - [Get Profile Controller](#getprofile-controller)
  - [Get all User Controller (admin access)](#getall-profile-controller)
  - [Update Profile](#update-profile-controller)

- [5. Middleware Implementation](#5-middleware-implementation)
- [6. Improvement made](#6-improvment-made)
- [7. Challenges Faced](#7-challenges-faced-in-this-project)


## **1. Project Overview**
### **Project Name:** Secure REST API with JWT & RBAC


### **Tech Stack:**
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ORM)
- **Authentication:** JSON Web Token (JWT)
- **Security:** Bcrypt (for password hashing)
- **Middleware:** Express Middleware for authentication and authorization
- **Testing:** Postman (for API testing)
---

Here’s a refined version of your approach with some improvements:  

### **Approach**  

- Installed all the necessary dependencies to set up the project.  
- Implemented **role-based access control (RBAC)** using a **User schema** with an `enum` field to define roles (`user` and `admin`).  
- Created routes to fetch all users, which can **only be accessed by an admin**.  
- Used two middlewares:  
  - **`userAuth`** to authenticate regular users.  
  - **`adminAuth`** to restrict admin-only routes.  
- Properly structured the project into separate folders (`controllers`, `routes`, `middlewares`, `models`) to improve code maintainability.  
- Used **JWT authentication** for secure user login and role verification.  
- Handled errors properly using `try-catch` blocks and meaningful responses to ensure smooth API behavior.  
- Configured `.env` variables properly to store sensitive information like **MongoDB URI** and **JWT secret** securely.  



## **2. Setup & Installation**

### **Prerequisites**
For running the project ensure this has installed in your pc:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- Git

### **Installation Steps**
1. **Clone the repository:**
   ```sh
   git clone https://github.com/tecgsoftware/VIT02501NIT.git
   cd backend
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set up environment variables:**
   Create a `.env` file in the root directory and add:
   ```env
   PORT = 5000
   MONGODB_URI = 'mongodb+srv://nt465638:tCCE9TY5ZmU10cuE@cluster0.ldvze.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
   JWT_SECRET = 'c8acb55a2d226140c206f0f9f0135f1bbce232112012b367886cc3e607779fc0dafe1e1fffb2cf99d138a4d8482688f84a8f39fdaa1d8f7cc1b1859569deb14cc26867bcdf8b2ae0ef1bc5a426498dfb7d9d9341ba8be15ff79198559f186e0bbe0457872094b74fe26b06d157e86d25cab4be5d427dec7d47f6bf042af12e21'
   ```
4. **Start the server:**
   ```sh
   nodemon index.js
   ```
   The server should now be running on `http://localhost:5000`.

---


## **3. Model**



### **User Model Schema**

| **Field**   | **Type**      | **Required** | **Default**   | **Description**                                      |
|-------------|---------------|--------------|---------------|------------------------------------------------------|
| **name**    | String        | Yes          | N/A           | The name of the user.                               |
| **email**   | String        | Yes          | N/A           | The user's email (must be unique).                  |
| **password**| String        | Yes          | N/A           | The user's password (should be hashed).             |
| **role**    | String        | No           | `'user'`      | User's role, can be `admin` or `user`.               |

----




## **4. API Documentation**

## **Registration Controller**  

### **Endpoint Details**  
- **Method:** `POST`  
- **Endpoint:** `/auth/register`  
- **Description:** Registers a new user/admin, hashes the password, and returns a JWT token.  

### **Request**  
#### **User Input**  
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "securePassword123"
}
```

#### **Admin Input**  
```json
{
  "name": "Nilesh Tiwari",
  "email": "nt465638@gmail.com",
  "password": "protectPassword123",
  "role": "admin"
}
```

### **Responses**  

**Success (`201 Created`)**  
#### **User Response**  
```json
{
    "message": "User created successfully",
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2MxM2U1ODQ4NzM3NmFjYTY1OGFlMmEiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0MDcxNzY1NywiZXhwIjoxNzQwNzIxMjU3fQ.z8o6ljR6t0C5Cdi0g7p3qW2HfmiZJs3bWja-jU6N63M",
    "user": {
        "id": "67c13e58487376aca658ae2a",
        "name": "John Doe",
        "email": "johndoe@example.com",
        "role": "user"
    }
}
```

#### **Admin Response**  
```json
{
    "message": "User created successfully",
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2MxM2ZiYTQ4NzM3NmFjYTY1OGFlMmQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDA3MTgwMTEsImV4cCI6MTc0MDcyMTYxMX0.R6RffDnX1eApVwvYwmHyaIR4vNl3YkameSUuhbKBp5s",
    "user": {
        "id": "67c13fba487376aca658ae2d",
        "name": "Nilesh Tiwari",
        "email": "nt465638@gmail.com",
        "role": "admin"
    }
}
```

### **Errors**  

| Status Code | Error Message                      | Description |
|-------------|-----------------------------------|-------------|
| `400` | `"User already exists"` | Email is already registered. |
| `400` | `"Invalid email format"` | Email does not match expected format. |
| `400` | `"Password must be at least 8 characters"` | Weak password. |
| `400` | `"All fields are required"` | One or more required fields are missing. |
| `500` | `"Something went wrong"` | Internal server error. |

---

---
## **login Controller**

- **Method:** `POST`  
- **Endpoint:** `/auth/login`  
- **Description:** Authenticates a user/admin, verifies credentials, and returns a JWT token.

### **Request**  
```json
{
  "email": "johndoe@example.com",
  "password": "securePassword123"
}
```

### **Response**
**Success (`200 OK`)**  
```json
{
    "message": "Login successful",
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YzEzZTU4NDg3Mzc2YWNhNjU4YWUyYSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQwNzE5NDQ3LCJleHAiOjE3NDA3MjMwNDd9.XwTArfrJgoeAHNRHGJkTp7QzeVc6Zkilr2tHsjTLniw",
    "user": {
        "id": "67c13e58487376aca658ae2a",
        "name": "John Doe",
        "email": "johndoe@example.com",
        "role": "user"
    }
}
```

### **Errors**  

| Status Code | Error Message                      | Description |
|-------------|-----------------------------------|-------------|
| `400` | `"All fields are required"` | Email or password missing. |
| `400` | `"User does not exist"` | No account found with the provided email. |
| `400` | `"Invalid credentials"` |Password does not match. |
| `500` | `"Something went wrong"` | Internal server error. |
 
---
---
## **logout controller**

- **Method:** `POST`  
- **Endpoint:** `/auth/logout`  
- **Description:** Logs out the user by clearing the JWT token cookie.

### **Request**
- No Request body required.

### **Response**
**Success (`200 OK`)**
```json
{
    "message": "Logout successful",
    "success": true
}
```

### **Errors**  

| Status Code | Error Message                      | Description |
|-------------|-----------------------------------|-------------|
| `500` | `"Something went wrong"` | Internal server error. |
 
---
## **getProfile controller**
- **Method:** `GET`  
- **Endpoint:** `/user/getProfile`  
- **Description:** for getting profile of the user or admin.

### **Request**
- No Request body required.

### **Response**
**Success (`200 OK`)**

```json
{
    "success": true,
    "user": {
        "_id": "67c13e58487376aca658ae2a",
        "name": "John Doe",
        "email": "johndoe@example.com",
        "password": "$2b$10$f/F2Pr5bX4obBUKUqNFO1Oeh2PyVdZaw1177CBPHRYD.iw87jtC1W",
        "role": "user",
        "createdAt": "2025-02-28T04:40:56.951Z",
        "updatedAt": "2025-02-28T04:40:56.951Z",
        "__v": 0
    }
}
```
### **Errors**  

| Status Code | Error Message                      | Description |
|-------------|-----------------------------------|-------------|  
| `401` | `"Unauthorized: No user found"` | User not authenticated (JWT missing/invalid). |  
| `404` | `"User not found"` | No account found with the provided user ID. |  
| `500` | `"Something went wrong"` | Internal server/database error. |  


## **Update Profile Controller**  
- **Method:** `PUT`  
- **Endpoint:** `/user/update`  
- **Description:** for updating profile of the user or admin.

### **Request**

```json
{
    "name":"John"
}
```

### **Response**
**Success (`200 OK`)**
```json
{
    "success": true,
    "message": "Profile updated successfully",
    "user": {
        "id": "67c13e58487376aca658ae2a",
        "name": "John",
        "email": "johndoe@example.com",
        "role": "user"
    }
}
```

### **Errors:**  

| Status Code | Message                           | Description |
|-------------|-----------------------------------|-------------|
| `400`       | `"Email is already taken"`       | The provided email is already registered to another account. |
| `404`       | `"User not found"`               | No user found with the provided ID. |
| `500`       | `"Something went wrong"`         | Internal server error. |

## **GetAll Profile Controller**  
- **Access** `Admin can access this route`
- **Method:** `GET`  
- **Endpoint:** `/admin/allUsers`  
- **Description:** for getting all the users.

### **Request**
- No Request body required.

### **Response**
**Success (`200 OK`)**
- gets all users

### **Errors:**  

| Status Code | Message                           | Description |
|-------------|-----------------------------------|-------------|
| `400`       | `"No users found"`       | No users exist in the database.registered to another account. |
| `403`       | `"Forbidden: Admin access required"`               |User does not have admin privileges. |
| `500`       | `"Something went wrong"`         | Internal server error. |



## **5. Middleware Implementation**  

### **1. Authentication Middleware (`authUser`)**  
Verifies JWT token before allowing access to protected routes.  

**Steps:**  
1. Extracts JWT token from cookies.  
2. Verifies token validity using `JWT_SECRET_KEY`.  
3. Attaches user data (`req.user`) if valid.  
4. Returns `401 Unauthorized` if token is missing or invalid.  
5. Proceeds to the next middleware if authenticated.  

---

### **2. Authorization Middleware (`authAdmin`)**  
Checks user role before granting admin-level access.  

**Steps:**  
1. Ensures the user is authenticated (`authUser` must run first).  
2. Checks user role before giving to the admin action.  
3. Returns `403 Forbidden` if the user is not an admin.  
4. Proceeds to the next middleware if authorized.  

### **Errors:**  

| Status Code | Error Message                      | Description |  
|-------------|-----------------------------------|-------------|  
| `401`       | `"Unauthorized: No user found"`   | User not authenticated (JWT missing/invalid). |  
| `404`       | `"User not found"`                | No account found with the provided user ID. |  
| `500`       | `"Something went wrong"`          | Internal server/database error. |  

---
## **6. Improvment made**

- **Role-Based Access**: I added role-based authentication so that different users (like admins and regular users) have different access levels.  

- **Better Documentation**: I wrote a detailed README file explaining how the API works, including the available endpoints and setup instructions.  

- **Organized Folder Structure**: I properly separated files into different folders like `controllers`, `routes`, `middlewares`, and `models`, making the project easier to manage.  

- **Cleaner Code**: I structured the code in a modular way, keeping everything well-organized and reusable for future improvements.  


## **7. Challenges Faced in This Project**
- MongoDB Connection: I resolved this by adding the API address 0.0.0.0/0.
- Token Undefined Error: The error occurred because I had not used cookie-parser in my index.js file. I resolved it by installing and using it in index.js.
- .env File Error: I used the wrong variable name for the JWT secret, which caused the error. I fixed it by using the correct variable name.



