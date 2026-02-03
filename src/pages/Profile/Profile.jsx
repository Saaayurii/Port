import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';

const Profile = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        name: 'Иван Иванов',
        email: 'ivan@example.com',
        role: 'Разработчик',
        bio: 'Люблю создавать интересные проекты и работать с React',
        location: 'Москва, Россия',
        phone: '+7 (999) 123-45-67',
        company: 'DeployPort Inc.'
    });

    const [editData, setEditData] = useState(userData);

    const handleEdit = () => {
        setIsEditing(true);
        setEditData(userData);
    };

    const handleSave = () => {
        setUserData(editData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditData(userData);
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const stats = [
        { label: 'Проекты', value: '12' },
        { label: 'Команды', value: '3' },
        { label: 'Активность', value: '95%' }
    ];

    return (
        <div className={styles.profileWrapper}>
            <button className={styles.backButton} onClick={() => navigate('/')}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Назад на главную
            </button>
            <div className={styles.profileContainer}>
                <div className={styles.profileHeader}>
                    <div className={styles.avatarSection}>
                        <div className={styles.avatar}>
                            <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                                <rect fill="none" height="256" width="256" />
                                <path d="M128,32A96,96,0,0,0,63.8,199.4h0A72,72,0,0,1,128,160a40,40,0,1,1,40-40,40,40,0,0,1-40,40,72,72,0,0,1,64.2,39.4A96,96,0,0,0,128,32Z" opacity="0.2" />
                                <circle cx="128" cy="128" fill="none" r="96" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" />
                                <circle cx="128" cy="120" fill="none" r="40" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" />
                                <path d="M63.8,199.4a72,72,0,0,1,128.4,0" fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" />
                            </svg>
                        </div>
                        <button className={styles.changeAvatarBtn}>Изменить фото</button>
                    </div>
                    <div className={styles.headerInfo}>
                        <h1>{userData.name}</h1>
                        <p className={styles.role}>{userData.role}</p>
                        {!isEditing && (
                            <button className={styles.editBtn} onClick={handleEdit}>
                                Редактировать профиль
                            </button>
                        )}
                    </div>
                </div>

                <div className={styles.statsSection}>
                    {stats.map((stat, index) => (
                        <div key={index} className={styles.statCard}>
                            <div className={styles.statValue}>{stat.value}</div>
                            <div className={styles.statLabel}>{stat.label}</div>
                        </div>
                    ))}
                </div>

                <div className={styles.profileContent}>
                    <div className={styles.section}>
                        <h2>Основная информация</h2>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <label>Имя</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={editData.name}
                                        onChange={handleChange}
                                        className={styles.input}
                                    />
                                ) : (
                                    <p>{userData.name}</p>
                                )}
                            </div>
                            <div className={styles.infoItem}>
                                <label>Email</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={editData.email}
                                        onChange={handleChange}
                                        className={styles.input}
                                    />
                                ) : (
                                    <p>{userData.email}</p>
                                )}
                            </div>
                            <div className={styles.infoItem}>
                                <label>Должность</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="role"
                                        value={editData.role}
                                        onChange={handleChange}
                                        className={styles.input}
                                    />
                                ) : (
                                    <p>{userData.role}</p>
                                )}
                            </div>
                            <div className={styles.infoItem}>
                                <label>Компания</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="company"
                                        value={editData.company}
                                        onChange={handleChange}
                                        className={styles.input}
                                    />
                                ) : (
                                    <p>{userData.company}</p>
                                )}
                            </div>
                            <div className={styles.infoItem}>
                                <label>Местоположение</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="location"
                                        value={editData.location}
                                        onChange={handleChange}
                                        className={styles.input}
                                    />
                                ) : (
                                    <p>{userData.location}</p>
                                )}
                            </div>
                            <div className={styles.infoItem}>
                                <label>Телефон</label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={editData.phone}
                                        onChange={handleChange}
                                        className={styles.input}
                                    />
                                ) : (
                                    <p>{userData.phone}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2>О себе</h2>
                        {isEditing ? (
                            <textarea
                                name="bio"
                                value={editData.bio}
                                onChange={handleChange}
                                className={styles.textarea}
                                rows="4"
                            />
                        ) : (
                            <p className={styles.bio}>{userData.bio}</p>
                        )}
                    </div>

                    {isEditing && (
                        <div className={styles.actionButtons}>
                            <button className={styles.saveBtn} onClick={handleSave}>
                                Сохранить изменения
                            </button>
                            <button className={styles.cancelBtn} onClick={handleCancel}>
                                Отменить
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
