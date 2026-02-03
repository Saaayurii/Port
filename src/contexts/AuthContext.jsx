import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Проверяем сохраненную сессию при загрузке
  useEffect(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedUser = localStorage.getItem('user');

    if (savedAuth === 'true' && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    // Заглушка: принимаем любой логин/пароль
    // Для демо можно добавить проверку: admin/admin
    if (username && password) {
      const userData = {
        username,
        loginTime: new Date().toISOString()
      };

      setIsAuthenticated(true);
      setUser(userData);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
