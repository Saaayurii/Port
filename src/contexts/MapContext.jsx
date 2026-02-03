import React, { createContext, useContext, useState, useCallback } from 'react';

const MapContext = createContext();

export const MapProvider = ({ children }) => {
    const [mapData, setMapData] = useState({
        mousePos: null,
        scale: 1,
        objectsCount: 0,
        selectedSize: null
    });

    const [mapObjects, setMapObjects] = useState([]);

    const [layerSettings, setLayerSettings] = useState({
        showMapImage: true,
        mapImageOpacity: 0.8,
        showGrid: true,
        gridOpacity: 0.5,
        currentMapUrl: '/deployport/port.png'
    });

    const updateMapData = useCallback((data) => {
        setMapData(prev => ({ ...prev, ...data }));
    }, []);

    const addMapObject = useCallback((type) => {
        const newObject = {
            id: Date.now() + Math.random(),
            type,
            x: Math.random() * 100 - 50,  // случайная позиция от -50 до 50
            y: Math.random() * 100 - 50,
            rotation: 0
        };
        setMapObjects(prev => [...prev, newObject]);
    }, []);

    const updateMapObject = useCallback((id, updates) => {
        setMapObjects(prev => prev.map(obj =>
            obj.id === id ? { ...obj, ...updates } : obj
        ));
    }, []);

    const removeMapObject = useCallback((id) => {
        setMapObjects(prev => prev.filter(obj => obj.id !== id));
    }, []);

    const clearMapObjects = useCallback(() => {
        setMapObjects([]);
    }, []);

    const updateLayerSettings = useCallback((settings) => {
        setLayerSettings(prev => ({ ...prev, ...settings }));
    }, []);

    return (
        <MapContext.Provider value={{
            mapData,
            updateMapData,
            mapObjects,
            addMapObject,
            updateMapObject,
            removeMapObject,
            clearMapObjects,
            layerSettings,
            updateLayerSettings
        }}>
            {children}
        </MapContext.Provider>
    );
};

export const useMapContext = () => {
    const context = useContext(MapContext);
    if (!context) {
        throw new Error('useMapContext must be used within MapProvider');
    }
    return context;
};
