import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Content from './components/Content/Content';
import Footer from './components/Footer/Footer';
import Profile from './pages/Profile/Profile';
import Documentation from './pages/Documentation/Documentation';
import Login from './pages/Login/Login';
import { MapProvider } from './contexts/MapContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <MapProvider>
        <Router >
          <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="*" element={
              <ProtectedRoute>
                <div className="wrapper">
                  <Header/>
                  <Routes>
                    <Route path="/" element={<Content/>} />
                    <Route path="/profile" element={<Profile/>} />
                    <Route path="/documentation" element={<Documentation/>} />
                  </Routes>
                  <Footer/>
                </div>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </MapProvider>
    </AuthProvider>
  );
}

export default App;