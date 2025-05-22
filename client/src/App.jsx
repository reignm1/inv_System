import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/bootstrap-custom.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <ProtectedRoute path="/">
            <Dashboard />
          </ProtectedRoute>
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;