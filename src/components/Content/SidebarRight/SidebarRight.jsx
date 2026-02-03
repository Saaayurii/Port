import styles from './SidebarRight.module.css';
import { useMapContext } from '../../../contexts/MapContext';

const SidebarRight = () => {
    const { addMapObject, clearMapObjects, mapObjects, layerSettings, updateLayerSettings } = useMapContext();

    const objectTypes = [
        { type: 'ship', label: '🚢 Корабль', icon: '🚢' },
        { type: 'crane', label: '🏗️ Стрела', icon: '🏗️' },
        { type: 'container', label: '📦 Контейнер', icon: '📦' },
        { type: 'rail', label: '🛤️ Рельсы', icon: '🛤️' },
        { type: 'warehouse', label: '🏭 Склад', icon: '🏭' },
        { type: 'building', label: '🏢 Здание', icon: '🏢' }
    ];

    // Предустановленные карты (добавьте свои файлы в папку public)
    const predefinedMaps = [
        { id: 'port1', name: 'Карта порта 1', url: '/deployport/port.png' },
        { id: 'port2', name: 'Карта порта 2', url: '/deployport/port2.png' },
        { id: 'port3', name: 'Карта порта 3', url: '/deployport/port3.png' },
        { id: 'empty', name: 'Без карты', url: null }
    ];

    // Обработчик загрузки файла
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                updateLayerSettings({ currentMapUrl: e.target.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={styles['sidebar-right']}>
            {/* Панель слоев */}
            <div className={styles['layers-panel']}>
                <h3 className={styles['panel-title']}>Слои</h3>

                <div className={styles['layer-controls']}>
                    {/* Выбор карты */}
                    <div className={styles['layer-item']}>
                        <label className={styles['map-selector-label']}>Выбор карты</label>

                        <div className={styles['map-info']}>
                            <span className={styles['info-icon']}>ℹ️</span>
                            <span className={styles['info-text']}>
                                Добавьте файлы port2.png, port3.png в папку public/
                                или загрузите свою карту
                            </span>
                        </div>

                        <div className={styles['map-selector']}>
                            {predefinedMaps.map((map) => (
                                <button
                                    key={map.id}
                                    className={`${styles['map-button']} ${
                                        layerSettings.currentMapUrl === map.url ? styles['map-button-active'] : ''
                                    }`}
                                    onClick={() => updateLayerSettings({
                                        currentMapUrl: map.url,
                                        showMapImage: map.url !== null
                                    })}
                                >
                                    {layerSettings.currentMapUrl === map.url && '✓ '}
                                    {map.name}
                                </button>
                            ))}
                        </div>

                        <div className={styles['file-upload']}>
                            <label className={styles['upload-button']}>
                                📁 Загрузить свою карту
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </div>
                    </div>

                    <div className={styles['layer-item']}>
                        <label className={styles['layer-checkbox']}>
                            <input
                                type="checkbox"
                                checked={layerSettings.showMapImage}
                                onChange={(e) => updateLayerSettings({ showMapImage: e.target.checked })}
                                disabled={!layerSettings.currentMapUrl}
                            />
                            <span>Показать карту</span>
                        </label>
                        {layerSettings.showMapImage && layerSettings.currentMapUrl && (
                            <div className={styles['slider-container']}>
                                <label>Прозрачность карты</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={layerSettings.mapImageOpacity}
                                    onChange={(e) => updateLayerSettings({ mapImageOpacity: parseFloat(e.target.value) })}
                                    className={styles['slider']}
                                />
                                <span className={styles['slider-value']}>
                                    {Math.round(layerSettings.mapImageOpacity * 100)}%
                                </span>
                            </div>
                        )}
                    </div>

                    <div className={styles['layer-item']}>
                        <label className={styles['layer-checkbox']}>
                            <input
                                type="checkbox"
                                checked={layerSettings.showGrid}
                                onChange={(e) => updateLayerSettings({ showGrid: e.target.checked })}
                            />
                            <span>Показать сетку</span>
                        </label>
                        {layerSettings.showGrid && (
                            <div className={styles['slider-container']}>
                                <label>Прозрачность сетки</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={layerSettings.gridOpacity}
                                    onChange={(e) => updateLayerSettings({ gridOpacity: parseFloat(e.target.value) })}
                                    className={styles['slider']}
                                />
                                <span className={styles['slider-value']}>
                                    {Math.round(layerSettings.gridOpacity * 100)}%
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Панель объектов */}
            <div className={styles['objects-panel']}>
                <h3 className={styles['panel-title']}>Объекты</h3>

                <div className={styles['objects-grid']}>
                    {objectTypes.map(({ type, label, icon }) => (
                        <button
                            key={type}
                            className={styles['object-button']}
                            onClick={() => addMapObject(type)}
                            title={label}
                        >
                            <span className={styles['object-icon']}>{icon}</span>
                            <span className={styles['object-label']}>{label}</span>
                        </button>
                    ))}
                </div>

                <div className={styles['controls']}>
                    <div className={styles['counter']}>
                        Объектов на карте: {mapObjects.length}
                    </div>
                    <button
                        className={styles['clear-button']}
                        onClick={clearMapObjects}
                        disabled={mapObjects.length === 0}
                    >
                        Очистить карту
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SidebarRight;