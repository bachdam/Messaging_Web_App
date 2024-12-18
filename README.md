# Messaging Web App

A robust full-stack messaging web application built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js) and **Vite**. This application allows users to communicate through real-time messaging seamlessly.

---

## Features

- **Real-Time Messaging**: Send and receive messages instantly using WebSocket technology (e.g., Socket.IO).
- **Authentication**: Secure user registration and login with JWT-based authentication.
- **Scalable Backend**: Built with Node.js and Express.js for efficient handling of multiple concurrent connections.
- **Persistent Data**: Store messages and users securely in MongoDB.

---

## Tech Stack

### Frontend
- **React.js**: Component-based architecture for a dynamic UI.
- **Vite**: Lightning-fast development environment.
- **CSS**: Custom designs.

### Backend
- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Framework for building APIs and handling routing.
- **Socket.IO**: Real-time bidirectional communication.

### Database
- **MongoDB**: NoSQL database for storing user data and messages.

---

## Installation

1. **Install Vite**:
   Ensure Vite is installed on your system. On macOS, you can install it via Homebrew:
   ```bash
   brew install vite
   ```

2. **Clone the Repository**:
   ```bash
   https://github.com/bachdam/Messaging_Web_App.git
   cd messaging_web_app
   ```

3. **Install Dependencies**:
   - Frontend:
     ```bash
     cd client
     npm install
     ```
   - Backend:
     ```bash
     cd server
     npm install
     ```

4. **Set Up Environment Variables**:
   Create a `.env` file in the `server` directory with the following variables:
   ```env
   MONGO_URL=your_mongodb_connection_string
   SECRET_KEY=your_jwt_secret_key
   ```

5. **Start the Application**:
   - Backend:
     ```bash
     cd server
     npm start
     ```
   - Frontend:
     ```bash
     cd client
     npm run dev
     ```

6. **Access the Application**:
   Open your browser and navigate to `http://localhost:5173`.

---

## Features in Progress

- **Group Chats**: Create and manage group conversations.
- **Media Support**: Share images, videos, and files in chats.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Add feature name'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

---

## Credits

This project was inspired by and developed following a tutorial on https://www.youtube.com/@ChaooCharles. Special thanks to the creator of the tutorial for his guidance.

---

## Contact

- **Author**: [Bach Dam](https://github.com/bachdam)
- **Email**: dam07464@stthomas.edu

For any questions or suggestions, feel free to reach out!
