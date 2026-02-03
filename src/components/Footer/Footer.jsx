import React from 'react';
import styles from './Footer.module.css';
import { useMapContext } from '../../contexts/MapContext';

const Footer = () => {
    const { mapData } = useMapContext();
    const { mousePos, scale, objectsCount, selectedSize } = mapData;

    return (
        <footer className={styles['footer']}>
            <div className={styles['footer-container']}>
                <div className={styles['footer-left']}>
                    <div className={styles['footer-item']}>
                        <span className={styles['footer-label']}>Координаты:</span>
                        <span className={styles['footer-value']}>
                            {mousePos
                                ? `X: ${mousePos.x.toFixed(1)}, Y: ${mousePos.y.toFixed(1)}`
                                : 'X: —, Y: —'}
                        </span>
                    </div>
                    <div className={styles['footer-item']}>
                        <span className={styles['footer-label']}>Размер:</span>
                        <span className={styles['footer-value']}>
                            {selectedSize || '—'}
                        </span>
                    </div>
                </div>

                <div className={styles['footer-center']}>
                    <div className={styles['footer-item']}>
                        <span className={styles['footer-label']}>Объектов:</span>
                        <span className={styles['footer-value']}>{objectsCount}</span>
                    </div>
                </div>

                <div className={styles['footer-right']}>
                    <div className={styles['footer-item']}>
                        <span className={styles['footer-value']}>
                            {Math.round(scale * 100)}%
                        </span>
                    </div>
                    <div className={styles['footer-item']}>
                        <span className={styles['footer-value']}>DeployPort v0.1.0</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;