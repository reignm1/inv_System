# Supermarket Inventory Management System

This project is an inventory management system designed for a supermarket company. It consists of a client-side application built with React and Bootstrap CSS, and a server-side application built with Node.js. The system manages categories, suppliers, products, stock management, purchase orders, and user management.

## Project Structure

The project is organized into two main directories: `client` and `server`.

### Client

- **public/index.html**: The main HTML file for the React application.
- **src/components**: Contains functional components for managing categories, suppliers, products, stock, purchase orders, and users.
- **src/pages**: Contains pages for the dashboard and login functionality.
- **src/App.jsx**: The main application component that sets up routing.
- **src/index.js**: The entry point for the React application.
- **src/styles/bootstrap-custom.css**: Custom Bootstrap CSS styles.
- **package.json**: Configuration file for npm dependencies and scripts.
- **README.md**: Documentation for the client-side of the project.

### Server

- **src/controllers**: Contains controllers for handling CRUD operations for categories, suppliers, products, stock, purchase orders, and users.
- **src/models**: Defines the database models and schemas for categories, suppliers, products, stock, purchase orders, and users.
- **src/routes**: Sets up API routes for categories, suppliers, products, stock, purchase orders, and users.
- **src/app.js**: The main entry point for the server application.
- **src/database.js**: Handles database connection and configuration.
- **package.json**: Configuration file for npm dependencies and scripts.
- **README.md**: Documentation for the server-side of the project.

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB (or any other database of your choice)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd supermarket-inventory-management
   ```

2. Install server dependencies:
   ```
   cd server
   npm install
   ```

3. Install client dependencies:
   ```
   cd ../client
   npm install
   ```

### Running the Application

1. Start the server:
   ```
   cd server
   npm start
   ```

2. Start the client:
   ```
   cd ../client
   npm start
   ```

The application should now be running on `http://localhost:3000` for the client and `http://localhost:5000` for the server (or whichever port you have configured).

## Features

- Manage categories, suppliers, products, and users.
- Handle stock management and purchase orders.
- User authentication and authorization.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.