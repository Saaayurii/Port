import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Login.module.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Заполните все поля');
      return;
    }

    const success = login(username, password);
    if (success) {
      navigate('/');
    } else {
      setError('Ошибка входа');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>DeployPort</h1>
        <p className={styles.subtitle}>Вход в систему</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Имя пользователя</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введите имя пользователя"
              autoComplete="username"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              autoComplete="current-password"
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.submitButton}>
            Войти
          </button>

          <div className={styles.hint}>
            Подсказка: введите любой логин и пароль
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
