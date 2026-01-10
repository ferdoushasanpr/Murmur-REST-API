# Murmur Backend API

The RESTful API engine for the Murmur social application. Built with **Node.js**, **Express**, and **MongoDB**, it handles authentication, social relationships, and paginated feed generation.

## 🛠 Tech Stack

* **Runtime**: Node.js

* **Framework**: Express.js

* **Database**: MongoDB (via Mongoose ODM)

* **Security**: JWT (JSON Web Tokens) \& Bcrypt hashing

* **Validation**: Mongoose Schema Validation



## System Architecture

The project follows a **Controller-Service-Route** pattern to ensure separation of concerns:

* **Models**: Define the data structure and business rules (e.g., password hashing hooks).

* **Controllers**: Handle the request logic and database interactions.

* **Routes**: Define the entry points and apply authentication middleware.

* **Middleware**: Handles JWT verification and error handling.

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint        | Description                | Auth Required |
|--------|------------------|----------------------------|---------------|
| POST   | /auth/signup     | Register a new user        | No            |
| POST   | /auth/signin     | Login and receive JWT      | No            |



### User Management

| Method | Endpoint              | Description                     | Auth Required |
|--------|-----------------------|---------------------------------|---------------|
| GET    | /users/me             | Get own profile details         | Yes           |
| GET    | /users/:id            | Get details of another user     | Yes           |
| PUT    | /users/me             | Update profile or password      | Yes           |
| POST   | /users/:id/follow     | Toggle follow/unfollow          | Yes           |



### Murmurs (Tweets)

| Method | Endpoint                 | Description                    | Auth Required |
|--------|--------------------------|--------------------------------|---------------|
| GET    | /murmurs                 | Get timeline (10 per page)     | Yes           |
| POST   | /me/murmurs              | Post a new murmur              | Yes           |
| DELETE | /me/murmurs/:id          | Delete own murmur              | Yes           |
| POST   | /murmurs/:id/like        | Toggle like status             | Yes           |



---

## 🗄 Database Design

The application uses three primary collections with optimized indexing for social graph queries:

* **Users**: Stores profiles, hashed credentials, and counters.

* **Murmurs**: Stores post content and a reference to the author.

* **Follows**: A junction collection managing the "Following" relationship between User IDs.

---

## ⚙️ Installation \& Setup

### Prerequisites

* Node.js (v16+)

* MongoDB (Local or Atlas)

### 1. Clone \& Install

```bash

git clone https://github.com/ferdoushasanpr/Murmur-REST-API.git

cd Murmur-REST-API

npm install

```

### 2. Environment Variables

Create a `.env` file in the root:

```env

PORT=5000

MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/murmur

JWT_SECRET=your_super_secret_string_here

```

### 3. Run the Server

```bash

# Development mode

node index

```

---


## 💡 Key Implementation Details

* **Atomic Counters**: Uses MongoDB's `$inc` operator for `followerCount` and `followedCount` to prevent race conditions.

* **Scalable Feeds**: Timeline generation uses `$in` queries based on the user's follow list, optimized with compound indexes on `author` and `createdAt`.

* **Security**: Implements a `protect` middleware that decodes the JWT and attaches the user to the `req` object for all private routes.



---

