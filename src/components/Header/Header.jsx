import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Header.module.css';
import logo from './../../logo.svg';

import view from './../../img/header/view.svg';
import arrowdown from './../../img/header/arrowdown.svg';
import plus from './../../img/header/plus.svg';
import minus from './../../img/header/minus.svg';
import next from './../../img/header/next.svg';
import back from './../../img/header/back.svg';
import deletes from './../../img/header/delete.svg';
import frontIcon from './../../img/header/front-icon.svg';
import backIcon from './../../img/header/back-icon.svg';

const Header = () => {
    const [activeMenu, setActiveMenu] = useState(null);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    // Закрытие меню при клике вне его
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleMenu = (menuName) => {
        setActiveMenu(activeMenu === menuName ? null : menuName);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleMenuAction = (action) => {
        console.log(`Действие: ${action}`);
        setActiveMenu(null);
        // Здесь будет логика для каждого действия
        switch(action) {
            case 'new':
                alert('Создать новый проект');
                break;
            case 'open':
                alert('Открыть проект');
                break;
            case 'save':
                alert('Сохранить проект');
                break;
            case 'export':
                alert('Экспорт проекта');
                break;
            case 'undo':
                alert('Отменить действие');
                break;
            case 'redo':
                alert('Повторить действие');
                break;
            case 'copy':
                alert('Копировать');
                break;
            case 'paste':
                alert('Вставить');
                break;
            case 'zoom-in':
                alert('Увеличить масштаб');
                break;
            case 'zoom-out':
                alert('Уменьшить масштаб');
                break;
            case 'fullscreen':
                alert('Полноэкранный режим');
                break;
            case 'grid':
                alert('Показать/скрыть сетку');
                break;
            case 'align-left':
                alert('Выровнять по левому краю');
                break;
            case 'align-center':
                alert('Выровнять по центру');
                break;
            case 'align-right':
                alert('Выровнять по правому краю');
                break;
            case 'distribute':
                alert('Распределить элементы');
                break;
            case 'settings':
                alert('Настройки');
                break;
            case 'plugins':
                alert('Плагины');
                break;
            case 'shortcuts':
                alert('Горячие клавиши');
                break;
            case 'docs':
                navigate('/documentation');
                break;
            case 'about':
                alert('О программе');
                break;
            case 'exit':
                handleLogout();
                break;
            default:
                break;
        }
    };

    const menuItems = {
        file: [
            { label: 'Создать', action: 'new', shortcut: 'Ctrl+N' },
            { label: 'Открыть', action: 'open', shortcut: 'Ctrl+O' },
            { label: 'Сохранить', action: 'save', shortcut: 'Ctrl+S' },
            { label: 'Сохранить как...', action: 'save-as', shortcut: 'Ctrl+Shift+S' },
            { divider: true },
            { label: 'Экспорт', action: 'export', shortcut: 'Ctrl+E' },
            { divider: true },
            { label: 'Выход', action: 'exit', shortcut: 'Alt+F4' }
        ],
        edit: [
            { label: 'Отменить', action: 'undo', shortcut: 'Ctrl+Z' },
            { label: 'Повторить', action: 'redo', shortcut: 'Ctrl+Y' },
            { divider: true },
            { label: 'Копировать', action: 'copy', shortcut: 'Ctrl+C' },
            { label: 'Вырезать', action: 'cut', shortcut: 'Ctrl+X' },
            { label: 'Вставить', action: 'paste', shortcut: 'Ctrl+V' },
            { divider: true },
            { label: 'Выделить всё', action: 'select-all', shortcut: 'Ctrl+A' }
        ],
        view: [
            { label: 'Увеличить', action: 'zoom-in', shortcut: 'Ctrl+=' },
            { label: 'Уменьшить', action: 'zoom-out', shortcut: 'Ctrl+-' },
            { label: 'Фактический размер', action: 'actual-size', shortcut: 'Ctrl+0' },
            { divider: true },
            { label: 'Полноэкранный режим', action: 'fullscreen', shortcut: 'F11' },
            { label: 'Показать сетку', action: 'grid', shortcut: 'Ctrl+G' },
            { label: 'Показать линейки', action: 'rulers', shortcut: 'Ctrl+R' }
        ],
        position: [
            { label: 'Выровнять по левому краю', action: 'align-left' },
            { label: 'Выровнять по центру', action: 'align-center' },
            { label: 'Выровнять по правому краю', action: 'align-right' },
            { divider: true },
            { label: 'Распределить по горизонтали', action: 'distribute-h' },
            { label: 'Распределить по вертикали', action: 'distribute-v' },
            { divider: true },
            { label: 'На передний план', action: 'bring-front', shortcut: 'Ctrl+]' },
            { label: 'На задний план', action: 'send-back', shortcut: 'Ctrl+[' }
        ],
        extra: [
            { label: 'Настройки', action: 'settings', shortcut: 'Ctrl+,' },
            { label: 'Плагины', action: 'plugins' },
            { label: 'Горячие клавиши', action: 'shortcuts' },
            { divider: true },
            { label: 'Импорт данных', action: 'import' },
            { label: 'Экспорт данных', action: 'export-data' }
        ],
        help: [
            { label: 'Документация', action: 'docs', shortcut: 'F1' },
            { label: 'Руководство пользователя', action: 'guide' },
            { divider: true },
            { label: 'Сообщить об ошибке', action: 'report-bug' },
            { label: 'О программе', action: 'about' }
        ]
    };

    return (
        <header className={styles.header}>
            <section className={styles['header-top']}>
                <div className={styles['header-top-left-group']}>
                    <div className={styles.logo} onClick={() => navigate('/')}>
                        <img src={logo} alt="" />
                    </div>
                    <div className={styles['name-menu-group']}>
                        <div className={styles['project-name']}>
                            Название проекта
                        </div>
                        <div className={styles['header-top-menu']} ref={menuRef}>
                            <ul className={styles['header-top-menu-list']}>
                                <li
                                    className={`${styles['header-top-menu-item']} ${activeMenu === 'file' ? styles['active'] : ''}`}
                                    onClick={() => toggleMenu('file')}
                                >
                                    Файл
                                    {activeMenu === 'file' && (
                                        <div className={styles['dropdown-menu']}>
                                            {menuItems.file.map((item, index) => (
                                                item.divider ? (
                                                    <div key={index} className={styles['menu-divider']}></div>
                                                ) : (
                                                    <div
                                                        key={index}
                                                        className={styles['menu-item']}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMenuAction(item.action);
                                                        }}
                                                    >
                                                        <span>{item.label}</span>
                                                        {item.shortcut && <span className={styles['shortcut']}>{item.shortcut}</span>}
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    )}
                                </li>
                                <li
                                    className={`${styles['header-top-menu-item']} ${activeMenu === 'edit' ? styles['active'] : ''}`}
                                    onClick={() => toggleMenu('edit')}
                                >
                                    Правка
                                    {activeMenu === 'edit' && (
                                        <div className={styles['dropdown-menu']}>
                                            {menuItems.edit.map((item, index) => (
                                                item.divider ? (
                                                    <div key={index} className={styles['menu-divider']}></div>
                                                ) : (
                                                    <div
                                                        key={index}
                                                        className={styles['menu-item']}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMenuAction(item.action);
                                                        }}
                                                    >
                                                        <span>{item.label}</span>
                                                        {item.shortcut && <span className={styles['shortcut']}>{item.shortcut}</span>}
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    )}
                                </li>
                                <li
                                    className={`${styles['header-top-menu-item']} ${activeMenu === 'view' ? styles['active'] : ''}`}
                                    onClick={() => toggleMenu('view')}
                                >
                                    Вид
                                    {activeMenu === 'view' && (
                                        <div className={styles['dropdown-menu']}>
                                            {menuItems.view.map((item, index) => (
                                                item.divider ? (
                                                    <div key={index} className={styles['menu-divider']}></div>
                                                ) : (
                                                    <div
                                                        key={index}
                                                        className={styles['menu-item']}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMenuAction(item.action);
                                                        }}
                                                    >
                                                        <span>{item.label}</span>
                                                        {item.shortcut && <span className={styles['shortcut']}>{item.shortcut}</span>}
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    )}
                                </li>
                                <li
                                    className={`${styles['header-top-menu-item']} ${activeMenu === 'position' ? styles['active'] : ''}`}
                                    onClick={() => toggleMenu('position')}
                                >
                                    Положение
                                    {activeMenu === 'position' && (
                                        <div className={styles['dropdown-menu']}>
                                            {menuItems.position.map((item, index) => (
                                                item.divider ? (
                                                    <div key={index} className={styles['menu-divider']}></div>
                                                ) : (
                                                    <div
                                                        key={index}
                                                        className={styles['menu-item']}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMenuAction(item.action);
                                                        }}
                                                    >
                                                        <span>{item.label}</span>
                                                        {item.shortcut && <span className={styles['shortcut']}>{item.shortcut}</span>}
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    )}
                                </li>
                                <li
                                    className={`${styles['header-top-menu-item']} ${activeMenu === 'extra' ? styles['active'] : ''}`}
                                    onClick={() => toggleMenu('extra')}
                                >
                                    Дополнительно
                                    {activeMenu === 'extra' && (
                                        <div className={styles['dropdown-menu']}>
                                            {menuItems.extra.map((item, index) => (
                                                item.divider ? (
                                                    <div key={index} className={styles['menu-divider']}></div>
                                                ) : (
                                                    <div
                                                        key={index}
                                                        className={styles['menu-item']}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMenuAction(item.action);
                                                        }}
                                                    >
                                                        <span>{item.label}</span>
                                                        {item.shortcut && <span className={styles['shortcut']}>{item.shortcut}</span>}
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    )}
                                </li>
                                <li
                                    className={`${styles['header-top-menu-item']} ${activeMenu === 'help' ? styles['active'] : ''}`}
                                    onClick={() => toggleMenu('help')}
                                >
                                    Помощь
                                    {activeMenu === 'help' && (
                                        <div className={styles['dropdown-menu']}>
                                            {menuItems.help.map((item, index) => (
                                                item.divider ? (
                                                    <div key={index} className={styles['menu-divider']}></div>
                                                ) : (
                                                    <div
                                                        key={index}
                                                        className={styles['menu-item']}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMenuAction(item.action);
                                                        }}
                                                    >
                                                        <span>{item.label}</span>
                                                        {item.shortcut && <span className={styles['shortcut']}>{item.shortcut}</span>}
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    )}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={styles['header-top-right-group']}>
                    <div className={styles['user-info']}>
                        {user && <span className={styles['username']}>{user.username}</span>}
                    </div>
                    <div className={styles['profile']} onClick={() => {
                        console.log('Клик по профилю');
                        navigate('/profile');
                    }}>
                        <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect fill="none" height="256" width="256" /><path d="M128,32A96,96,0,0,0,63.8,199.4h0A72,72,0,0,1,128,160a40,40,0,1,1,40-40,40,40,0,0,1-40,40,72,72,0,0,1,64.2,39.4A96,96,0,0,0,128,32Z" opacity="0.2" /><circle cx="128" cy="128" fill="none" r="96" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><circle cx="128" cy="120" fill="none" r="40" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><path d="M63.8,199.4a72,72,0,0,1,128.4,0" fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>
                        <div>Профиль</div>
                    </div>
                    <div className={styles['logout']} onClick={handleLogout} title="Выход">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                        </svg>
                        <div>Выход</div>
                    </div>
                </div>
            </section>
            <section className={styles['header-bottom']}>
                <div className={styles['header-bottom-menu']}>
                    <div className={styles['header-bottom-menu-group']}>
                        <div className={styles['header-bottom-item']}>
                            <img src={view} alt="Вид" title='Вид' />
                        </div>
                    </div>
                    <div className={styles['header-bottom-menu-group']}>
                        <div className={styles['header-bottom-item']}>
                            175% <img src={arrowdown} alt="#" />
                        </div>
                    </div>
                    <div className={styles['header-bottom-menu-group']}>
                        <div className={styles['header-bottom-item']}>
                            <img src={plus} alt="Плюс" title='Увеличить' />
                        </div>
                        <div className={styles['header-bottom-item']}>
                            <img src={minus} alt="Уменьшить" title='Уменьшить' />
                        </div>
                    </div>
                    <div className={styles['header-bottom-menu-group']}>
                        <div className={styles['header-bottom-item']}>
                            <img src={back} alt="Отменить" title='Отменить' />
                        </div>
                        <div className={styles['header-bottom-item']}>
                            <img src={next} alt="Вернуть" title='Вернуть' />
                        </div>
                    </div>
                    <div className={styles['header-bottom-menu-group']}>
                        <div className={styles['header-bottom-item']}>
                            <img src={deletes} alt="Удалить" title='Удалить' />
                        </div>
                    </div>
                    <div className={styles['header-bottom-menu-group']}>
                        <div className={styles['header-bottom-item']}>
                            <img src={frontIcon} alt="На передний план" title='На передний план' />
                        </div>
                        <div className={styles['header-bottom-item']}>
                            <img src={backIcon} alt="На задний план" title='На задний план' />
                        </div>
                    </div>

                </div>
            </section>
        </header>
    )
}

export default Header;