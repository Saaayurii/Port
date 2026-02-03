import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import styles from './Map.module.css';
import { useMapContext } from '../../../contexts/MapContext';

const CoordinateSystem = ({
  initialXRange = [-200, 200],
  initialYRange = [-200, 200],
  gridStep = 10,
  children
}) => {
  const { updateMapData, mapObjects, updateMapObject, layerSettings } = useMapContext();
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startPanPos, setStartPanPos] = useState({ x: 0, y: 0 });
  const [startOffset, setStartOffset] = useState({ x: 0, y: 0 });

  const [draggingObject, setDraggingObject] = useState(null);

  const [mapImage] = useState({
    width: 400,
    height: 400,
    x: -200,
    y: -200
  });

  const basePixelsPerUnit = 5;
  const pixelsPerUnit = basePixelsPerUnit / scale;

  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;

  const visibleWidth = dimensions.width / pixelsPerUnit;
  const visibleHeight = dimensions.height / pixelsPerUnit;

  // ← Вот исправление: useMemo вместо создания нового массива каждый раз
  const xRange = useMemo(
    () => [
      offset.x - visibleWidth / 2,
      offset.x + visibleWidth / 2
    ],
    [offset.x, visibleWidth]
  );

  const yRange = useMemo(
    () => [
      offset.y - visibleHeight / 2,
      offset.y + visibleHeight / 2
    ],
    [offset.y, visibleHeight]
  );

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    updateMapData({
      mousePos,
      scale,
      objectsCount: mapObjects.length
    });
  }, [mousePos, scale, mapObjects.length, updateMapData]);

  const scaleX = useCallback(
    (x) => centerX + (x - offset.x) * pixelsPerUnit,
    [centerX, offset.x, pixelsPerUnit]
  );

  const scaleY = useCallback(
    (y) => centerY - (y - offset.y) * pixelsPerUnit,
    [centerY, offset.y, pixelsPerUnit]
  );

  const invertScaleX = useCallback(
    (x) => (x - centerX) / pixelsPerUnit + offset.x,
    [centerX, pixelsPerUnit, offset.x]
  );

  const invertScaleY = useCallback(
    (y) => -(y - centerY) / pixelsPerUnit + offset.y,
    [centerY, pixelsPerUnit, offset.y]
  );

  const handleMouseDown = (e) => {
    if (draggingObject) return;
    setIsDragging(true);
    setStartPanPos({
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY
    });
    setStartOffset(offset);
  };

  const handleMouseMove = (e) => {
    if (!dimensions.width || !dimensions.height) return;

    const pointX = invertScaleX(e.nativeEvent.offsetX);
    const pointY = invertScaleY(e.nativeEvent.offsetY);
    setMousePos({
      x: pointX,
      y: pointY,
      svgX: e.nativeEvent.offsetX,
      svgY: e.nativeEvent.offsetY
    });

    if (draggingObject) {
      updateMapObject(draggingObject.id, {
        x: pointX,
        y: pointY
      });
      return;
    }

    if (isDragging) {
      const dx = e.nativeEvent.offsetX - startPanPos.x;
      const dy = e.nativeEvent.offsetY - startPanPos.y;

      const deltaX = dx / pixelsPerUnit;
      const deltaY = -dy / pixelsPerUnit;

      setOffset({
        x: startOffset.x - deltaX,
        y: startOffset.y - deltaY
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggingObject(null);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsDragging(false);
    setDraggingObject(null);
    setMousePos(null);
  };

  const handleObjectMouseDown = (e, obj) => {
    e.stopPropagation();
    setDraggingObject(obj);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (!dimensions.width || !dimensions.height) return;

    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(0.25, scale * delta), 3);

    const pointX = invertScaleX(e.nativeEvent.offsetX);
    const pointY = invertScaleY(e.nativeEvent.offsetY);

    const scaleRatio = newScale / scale;
    setOffset({
      x: pointX - (pointX - offset.x) / scaleRatio,
      y: pointY - (pointY - offset.y) / scaleRatio
    });
    setScale(newScale);
  };

  const handleScaleChange = (newScale) => {
    setScale(newScale);
    setOffset({ x: 0, y: 0 });
  };

  const renderMapObject = (obj) => {
    const x = scaleX(obj.x);
    const y = scaleY(obj.y);
    const size = 10 / scale;
    const isBeingDragged = draggingObject?.id === obj.id;

    const commonProps = {
      style: {
        cursor: 'move',
        opacity: isBeingDragged ? 0.7 : 1,
        filter: isBeingDragged ? 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.5))' : 'none'
      },
      onMouseDown: (e) => handleObjectMouseDown(e, obj)
    };

    switch (obj.type) {
      case 'ship':
        return (
          <g key={obj.id} {...commonProps}>
            <ellipse
              cx={x}
              cy={y}
              rx={size * 2}
              ry={size}
              fill="#3b82f6"
              stroke="#1e40af"
              strokeWidth={1 / scale}
            />
            <rect
              x={x - size * 1.5}
              y={y - size * 1.2}
              width={size * 3}
              height={size * 0.8}
              fill="#1e40af"
            />
          </g>
        );

      case 'crane':
        return (
          <g key={obj.id} {...commonProps}>
            <rect
              x={x - size * 0.5}
              y={y - size * 0.5}
              width={size}
              height={size}
              fill="#fbbf24"
              stroke="#f59e0b"
              strokeWidth={1 / scale}
            />
            <line
              x1={x}
              y1={y}
              x2={x + size * 2}
              y2={y - size * 2}
              stroke="#f59e0b"
              strokeWidth={2 / scale}
            />
            <circle
              cx={x + size * 2}
              cy={y - size * 2}
              r={size * 0.3}
              fill="#ef4444"
            />
          </g>
        );

      case 'container':
        return (
          <g key={obj.id} {...commonProps}>
            <rect
              x={x - size * 0.7}
              y={y - size * 0.7}
              width={size * 1.4}
              height={size * 1.4}
              fill="#10b981"
              stroke="#059669"
              strokeWidth={1 / scale}
              rx={2 / scale}
            />
          </g>
        );

      case 'rail':
        return (
          <g key={obj.id} {...commonProps}>
            <line
              x1={x - size * 2}
              y1={y - size * 0.3}
              x2={x + size * 2}
              y2={y - size * 0.3}
              stroke="#6b7280"
              strokeWidth={2 / scale}
            />
            <line
              x1={x - size * 2}
              y1={y + size * 0.3}
              x2={x + size * 2}
              y2={y + size * 0.3}
              stroke="#6b7280"
              strokeWidth={2 / scale}
            />
            {[-1.5, -0.5, 0.5, 1.5].map((offset, idx) => (
              <line
                key={idx}
                x1={x + size * offset}
                y1={y - size * 0.5}
                x2={x + size * offset}
                y2={y + size * 0.5}
                stroke="#4b5563"
                strokeWidth={1.5 / scale}
              />
            ))}
          </g>
        );

      case 'warehouse':
        return (
          <g key={obj.id} {...commonProps}>
            <rect
              x={x - size * 1.5}
              y={y - size}
              width={size * 3}
              height={size * 2}
              fill="#8b5cf6"
              stroke="#6d28d9"
              strokeWidth={1 / scale}
            />
            <polygon
              points={`
                ${x - size * 1.7},${y - size}
                ${x},${y - size * 1.8}
                ${x + size * 1.7},${y - size}
              `}
              fill="#7c3aed"
              stroke="#6d28d9"
              strokeWidth={1 / scale}
            />
          </g>
        );

      case 'building':
        return (
          <g key={obj.id} {...commonProps}>
            <rect
              x={x - size}
              y={y - size * 1.5}
              width={size * 2}
              height={size * 3}
              fill="#ec4899"
              stroke="#be185d"
              strokeWidth={1 / scale}
            />
            {[0, 1, 2].map((row) =>
              [0, 1].map((col) => (
                <rect
                  key={`${row}-${col}`}
                  x={x - size * 0.7 + col * size}
                  y={y - size * 1.2 + row * size * 0.8}
                  width={size * 0.4}
                  height={size * 0.4}
                  fill="#fef3c7"
                  stroke="#be185d"
                  strokeWidth={0.5 / scale}
                />
              ))
            )}
          </g>
        );

      default:
        return (
          <g key={obj.id} {...commonProps}>
            <circle
              cx={x}
              cy={y}
              r={size}
              fill="#64748b"
            />
          </g>
        );
    }
  };

  const generateGrid = () => {
    if (!dimensions.width || !dimensions.height) return null;

    const gridLines = [];
    const subGridStep = gridStep / 5;

    const startX = Math.ceil(xRange[0] / subGridStep) * subGridStep;
    const endX = Math.floor(xRange[1] / subGridStep) * subGridStep;

    for (let x = startX; x <= endX; x += subGridStep) {
      const isMainLine = Math.abs(x % gridStep) < 0.001;

      gridLines.push(
        <line
          key={`v_${x}`}
          x1={scaleX(x)}
          y1={0}
          x2={scaleX(x)}
          y2={dimensions.height}
          stroke={isMainLine ? "#97bd83" : "#ffffff"}
          strokeWidth={isMainLine ? 1 : 0.5}
          opacity={(isMainLine ? 1 : 0.6) * layerSettings.gridOpacity}
        />
      );
    }

    const startY = Math.ceil(yRange[0] / subGridStep) * subGridStep;
    const endY = Math.floor(yRange[1] / subGridStep) * subGridStep;

    for (let y = startY; y <= endY; y += subGridStep) {
      const isMainLine = Math.abs(y % gridStep) < 0.001;

      gridLines.push(
        <line
          key={`h_${y}`}
          x1={0}
          y1={scaleY(y)}
          x2={dimensions.width}
          y2={scaleY(y)}
          stroke={isMainLine ? "#97bd83" : "#ffffff"}
          strokeWidth={isMainLine ? 1 : 0.5}
          opacity={(isMainLine ? 1 : 0.6) * layerSettings.gridOpacity}
        />
      );
    }

    return gridLines;
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '300px',
        overflow: 'hidden'
      }}
    >
      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 100,
        display: 'flex',
        gap: '5px',
        flexWrap: 'wrap',
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: '5px',
        borderRadius: '5px'
      }}>
        {[25, 50, 75, 100, 125, 150, 175].map((percent) => (
          <button
            key={percent}
            onClick={() => handleScaleChange(percent / 100)}
            style={{
              padding: '5px 10px',
              border: '1px solid #ccc',
              borderRadius: '3px',
              background: scale === percent / 100 ? '#ddd' : '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
          >
            {percent}%
          </button>
        ))}
      </div>

      <svg
        width={dimensions.width}
        height={dimensions.height}
        style={{
          cursor: draggingObject ? 'grabbing' : (isDragging ? 'grabbing' : 'grab'),
          touchAction: 'none'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsHovered(true)}
        onWheel={handleWheel}
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="black" />
          </marker>
        </defs>

        {layerSettings.showMapImage && layerSettings.currentMapUrl && (
          <image
            href={layerSettings.currentMapUrl}
            x={scaleX(mapImage.x)}
            y={scaleY(mapImage.y + mapImage.height)}
            width={mapImage.width * pixelsPerUnit}
            height={mapImage.height * pixelsPerUnit}
            opacity={layerSettings.mapImageOpacity}
            preserveAspectRatio="none"
            style={{ pointerEvents: 'none' }}
          />
        )}

        {layerSettings.showGrid && generateGrid()}

        <line
          x1={0}
          y1={scaleY(0)}
          x2={dimensions.width}
          y2={scaleY(0)}
          stroke="#ff0000"
          strokeWidth={2}
          opacity={0.7}
          markerEnd="url(#arrow)"
        />

        <line
          x1={scaleX(0)}
          y1={0}
          x2={scaleX(0)}
          y2={dimensions.height}
          stroke="#ff0000"
          strokeWidth={2}
          opacity={0.7}
          markerEnd="url(#arrow)"
        />

        {isHovered && mousePos && (
          <text
            x={mousePos.svgX + 10}
            y={mousePos.svgY - 10}
            fontSize="12"
            fill="black"
            style={{
              userSelect: 'none',
              pointerEvents: 'none',
              backgroundColor: 'white',
              padding: '2px 5px',
              borderRadius: '3px',
              boxShadow: '0 0 3px rgba(0,0,0,0.3)'
            }}
          >
            {`(${mousePos.x.toFixed(2)}, ${mousePos.y.toFixed(2)})`}
          </text>
        )}

        {mapObjects.map(renderMapObject)}

        {children({ scaleX, scaleY, scale })}
      </svg>
    </div>
  );
};

export default CoordinateSystem;