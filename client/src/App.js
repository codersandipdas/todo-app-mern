import './App.css';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateTodo from './pages/CreateTodo';
import PageNotFound from './pages/PageNotFound';
import UpdateTodo from './pages/UpdateTodo';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route
          path='/create'
          element={
            <ProtectedRoute>
              <CreateTodo />
            </ProtectedRoute>
          }
        />
        <Route
          path='/update/:id'
          element={
            <ProtectedRoute>
              <UpdateTodo />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
