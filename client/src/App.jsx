import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/bootstrap-custom.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './components/Products';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import PurchaseOrders from './components/PurchaseOrders';
import SupplierList from './components/SupplierList';
import StockManagement from './components/StockManagement';
import UserManagement from './components/UserManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <ProtectedRoute>
            <div className="d-flex">
              <Sidebar />
              <div className="flex-grow-1">
                <Switch>
                  <Route exact path="/" component={Dashboard} />
                  <Route path="/products" component={Products} />
                  <Route path="/orders" component={PurchaseOrders} />
                  <Route path="/suppliers" component={SupplierList} />
                  <Route path="/stock" component={StockManagement} />
                  <Route path="/users" component={UserManagement} />
                  {/* Add other routes here as needed */}
                </Switch>
              </div>
            </div>
          </ProtectedRoute>
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;