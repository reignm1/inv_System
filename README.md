# Supermarket Inventory Management System

This project is an inventory management system designed for a supermarket company. It is built using React for the client-side, Node.js for the server-side, and utilizes Bootstrap CSS for styling.

## Project Structure

The project is divided into two main parts: the client and the server.

### Client

The client-side of the application is built with React and includes the following components:

- **CategoryList**: Displays a list of product categories.
- **SupplierList**: Displays a list of suppliers.
- **ProductList**: Displays a list of products.
- **StockManagement**: Manages and displays stock information for products.
- **PurchaseOrders**: Handles and displays purchase orders.
- **UserManagement**: Manages and displays user information.
- **Dashboard**: The main dashboard that aggregates various components.
- **Login**: Handles user login functionality.

The client also includes custom Bootstrap CSS styles.

### Server

The server-side of the application is built with Node.js and includes:

- **Controllers**: Handle CRUD operations for categories, suppliers, products, stock, purchase orders, and user management.
- **Models**: Define the database schema for categories, suppliers, products, stock, purchase orders, and users.
- **Routes**: Set up API endpoints for each of the resources.
- **Database**: Manages the database connection and configuration.

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the client directory and install dependencies:
   ```
   cd client
   npm install
   ```

3. Navigate to the server directory and install dependencies:
   ```
   cd ../server
   npm install
   ```

### Running the Application

1. Start the server:
   ```
   cd server
   npm start
   ```

2. In a new terminal, start the client:
   ```
   cd client
   npm start
   ```

The application should now be running on `http://localhost:3000`.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License.