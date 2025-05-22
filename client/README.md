# Supermarket Inventory Management System

This project is a web application for managing inventory in a supermarket. It is built using React for the frontend and Node.js for the backend, with Bootstrap for styling.

## Client-Side

The client-side of the application is located in the `client` directory. It includes the following components and pages:

- **Components**:
  - `CategoryList.jsx`: Displays a list of categories.
  - `SupplierList.jsx`: Displays a list of suppliers.
  - `ProductList.jsx`: Displays a list of products.
  - `StockManagement.jsx`: Manages and displays stock information.
  - `PurchaseOrders.jsx`: Handles and displays purchase orders.
  - `UserManagement.jsx`: Manages and displays user information.

- **Pages**:
  - `Dashboard.jsx`: The main dashboard that aggregates various components.
  - `Login.jsx`: Handles user login functionality.

### Installation

To install the client-side dependencies, navigate to the `client` directory and run:

```
npm install
```

### Running the Client

To start the client-side application, run:

```
npm start
```

This will start the development server and open the application in your default web browser.

## Server-Side

The server-side of the application is located in the `server` directory. It includes controllers for handling CRUD operations for categories, suppliers, products, stock, purchase orders, and user management.

### Installation

To install the server-side dependencies, navigate to the `server` directory and run:

```
npm install
```

### Running the Server

To start the server-side application, run:

```
npm start
```

This will start the server and listen for API requests.

## Database

The application uses a database to store information about categories, suppliers, products, stock, purchase orders, and users. Ensure that your database is set up and configured correctly in the `server/src/database.js` file.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any improvements or bugs you find.

## License

This project is licensed under the MIT License.