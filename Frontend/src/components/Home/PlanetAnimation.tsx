// @ts-nocheck
import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import * as THREE from 'three';

// Extracted Three.js planet animation into its own component
const PlanetAnimation = memo(({ onLoad }) => {
  const containerRef = useRef(null);
  const mountRef = useRef({ scene: null, camera: null, renderer: null, earth: null, clouds: null });
  const [isLoading, setIsLoading] = useState(true);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const autoRotateRef = useRef(true);
  const frameRef = useRef(null);
  
  // Memoized texture loading function
  const loadTextures = useCallback((loadManager) => {
    const textureLoader = new THREE.TextureLoader(loadManager);
    
    // Use a texture cache to avoid reloading the same textures
    const textureCache = {};
    
    const loadTexture = (url) => {
      if (!textureCache[url]) {
        textureCache[url] = textureLoader.load(url);
      }
      return textureCache[url];
    };
    
    return {
      earthTexture: loadTexture('/3d-models/earth/textures/image.png'),
      bumpMap: loadTexture('/3d-models/earth/textures/earth_normal.png'),
      specularMap: loadTexture('/3d-models/earth/textures/earth_specular.png'),
      cloudTexture: loadTexture('/earth/8k_earth_clouds.jpg')
    };
  }, []);
  
  // Memoized scene initialization
  const initScene = useCallback(() => {
    if (!containerRef.current) return;
    
    const { current: mount } = mountRef;
    const container = containerRef.current;
    
    // Create scene only once
    mount.scene = new THREE.Scene();
    
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Camera setup
    mount.camera = new THREE.PerspectiveCamera(45, containerWidth / containerHeight, 0.1, 100);
    mount.camera.position.z = 2.6;

    // Renderer with settings optimized for performance
    mount.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance', // Optimize for performance
      precision: 'mediump' // Use medium precision for better performance
    });
    mount.renderer.setSize(containerWidth, containerHeight);
    mount.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for better performance
    container.appendChild(mount.renderer.domElement);

    // Load textures with loading manager
    const loadManager = new THREE.LoadingManager();
    
    loadManager.onLoad = () => {
      setIsLoading(false);
      if (onLoad) onLoad();
    };

    const textures = loadTextures(loadManager);

    // Optimize geometry for performance - lower polygon count for mobile devices
    const isMobile = window.innerWidth < 768;
    const resolution = isMobile ? 64 : 96; // Lower poly count for mobile
    
    // Create geometries once and reuse
    const earthGeometry = new THREE.SphereGeometry(1, resolution, resolution);
    const cloudGeometry = new THREE.SphereGeometry(1.02, resolution, resolution);

    // Earth mesh
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: textures.earthTexture,
      bumpMap: textures.bumpMap,
      bumpScale: 0.05,
      specularMap: textures.specularMap,
      specular: new THREE.Color('grey'),
      normalScale: new THREE.Vector2(0.85, 0.85)
    });

    mount.earth = new THREE.Mesh(earthGeometry, earthMaterial);
    mount.scene.add(mount.earth);

    // Cloud mesh
    const cloudMaterial = new THREE.MeshPhongMaterial({
      map: textures.cloudTexture,
      transparent: true,
      opacity: 0.4
    });

    mount.clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    mount.scene.add(mount.clouds);

    // Lighting - use a single light for performance
    const sunLight = new THREE.DirectionalLight(0xffffff, 0.9);
    sunLight.position.set(5, 3, 5);
    mount.scene.add(sunLight);
    
    // Add ambient light to avoid completely dark sides
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    mount.scene.add(ambientLight);
  }, [loadTextures, onLoad]);
  
  // Memoized resize handler
  const handleResize = useCallback(() => {
    const { current: mount } = mountRef;
    const container = containerRef.current;
    
    if (!container || !mount.camera || !mount.renderer) return;
    
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    
    mount.camera.aspect = newWidth / newHeight;
    mount.camera.updateProjectionMatrix();
    mount.renderer.setSize(newWidth, newHeight);
  }, []);
  
  // Memoized animation frame function
  const animate = useCallback(() => {
    const { current: mount } = mountRef;
    
    if (!mount.scene || !mount.camera || !mount.renderer) return;
    
    // Auto rotation
    if (autoRotateRef.current && mount.earth && mount.clouds) {
      mount.earth.rotation.y += 0.001;
      mount.clouds.rotation.y += 0.0012;
    }
    
    mount.renderer.render(mount.scene, mount.camera);
    frameRef.current = requestAnimationFrame(animate);
  }, []);
  
  // Mouse event handlers
  const handleMouseDown = useCallback((e) => {
    isDraggingRef.current = true;
    autoRotateRef.current = false;
    previousMousePositionRef.current = { x: e.offsetX, y: e.offsetY };
  }, []);
  
  const handleMouseMove = useCallback((e) => {
    if (!isDraggingRef.current || !mountRef.current.earth || !mountRef.current.clouds) return;
    
    const deltaMove = {
      x: e.offsetX - previousMousePositionRef.current.x,
      y: e.offsetY - previousMousePositionRef.current.y
    };

    const rotationSpeed = 0.003;
    mountRef.current.earth.rotation.y += deltaMove.x * rotationSpeed;
    mountRef.current.clouds.rotation.y += deltaMove.x * rotationSpeed;

    const maxPolarAngle = Math.PI / 2;
    const newRotationX = mountRef.current.earth.rotation.x + (deltaMove.y * rotationSpeed);
    
    if (Math.abs(newRotationX) < maxPolarAngle) {
      mountRef.current.earth.rotation.x = newRotationX;
      mountRef.current.clouds.rotation.x = newRotationX;
    }
    
    previousMousePositionRef.current = { x: e.offsetX, y: e.offsetY };
  }, []);
  
  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);
  
  // Setup and teardown
  useEffect(() => {
    // Defer expensive operations to after first render
    const timer = setTimeout(() => {
      initScene();
      animate();
    }, 100);
    
    // Event listeners
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      clearTimeout(timer);
      
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      
      window.removeEventListener('resize', handleResize);
      
      // Clean up Three.js resources
      const { current: mount } = mountRef;
      
      if (mount.renderer && containerRef.current) {
        containerRef.current.removeChild(mount.renderer.domElement);
        mount.renderer.dispose();
      }
      
      if (mount.earth) {
        mount.earth.geometry.dispose();
        mount.earth.material.dispose();
      }
      
      if (mount.clouds) {
        mount.clouds.geometry.dispose();
        mount.clouds.material.dispose();
      }
      
      if (mount.scene) {
        mount.scene.clear();
      }
    };
  }, [initScene, animate, handleResize]);
  
  // Setup event listeners for the container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseUp);
    
    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp]);
  
  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full flex items-center justify-center"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
});

export default PlanetAnimation;