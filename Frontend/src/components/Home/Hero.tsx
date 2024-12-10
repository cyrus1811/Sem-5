// @ts-nocheck
import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let scene, camera, renderer, earth, clouds, atmosphere, controls;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let autoRotate = true;
    const container = document.getElementById('rotating-planet');

    function initScene() {
      scene = new THREE.Scene();
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      // Enhanced camera setup
      camera = new THREE.PerspectiveCamera(45, containerWidth / containerHeight, 0.1, 100);
      camera.position.z = 2.6;

      // Improved renderer with better antialiasing and physically correct lighting
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      renderer.setSize(containerWidth, containerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(renderer.domElement);

      // Load textures with loading manager
      const loadManager = new THREE.LoadingManager();
      loadManager.onLoad = () => setIsLoading(false);

      const textureLoader = new THREE.TextureLoader(loadManager);

      // Enhanced Earth with more detailed textures
      const earthGeometry = new THREE.SphereGeometry(1, 128, 128);
      const earthTexture = textureLoader.load('https://cdn.jsdelivr.net/gh/mrdoob/three.js/examples/textures/planets/earth_atmos_2048.jpg');
      const bumpMap = textureLoader.load('https://cdn.jsdelivr.net/gh/mrdoob/three.js/examples/textures/planets/earth_normal_2048.jpg');
      const specularMap = textureLoader.load('https://cdn.jsdelivr.net/gh/mrdoob/three.js/examples/textures/planets/earth_specular_2048.jpg');

      const earthMaterial = new THREE.MeshPhongMaterial({
        map: earthTexture,
        bumpMap: bumpMap,
        bumpScale: 0.05,
        specularMap: specularMap,
        specular: new THREE.Color('grey'),
        normalScale: new THREE.Vector2(0.85, 0.85)
      });

      earth = new THREE.Mesh(earthGeometry, earthMaterial);
      scene.add(earth);

      // Add cloud layer
      const cloudGeometry = new THREE.SphereGeometry(1.02, 128, 128);
      const cloudTexture = textureLoader.load('/earth/8k_earth_clouds.jpg');
      const cloudMaterial = new THREE.MeshPhongMaterial({
        map: cloudTexture,
        transparent: true,
        opacity: 0.4
      });

      clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
      scene.add(clouds);

      const sunLight = new THREE.DirectionalLight(0xffffff, 0.9);
      sunLight.position.set(5, 3, 5);
      scene.add(sunLight);

      window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    }

    // Enhanced interaction handling
    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      autoRotate = false;
    });

    container.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const deltaMove = {
          x: e.offsetX - previousMousePosition.x,
          y: e.offsetY - previousMousePosition.y
        };

        const rotationSpeed = 0.003;
        earth.rotation.y += deltaMove.x * rotationSpeed;
        clouds.rotation.y += deltaMove.x * rotationSpeed;

        const maxPolarAngle = Math.PI / 2;
        const newRotationX = earth.rotation.x + (deltaMove.y * rotationSpeed);
        if (Math.abs(newRotationX) < maxPolarAngle) {
          earth.rotation.x = newRotationX;
          clouds.rotation.x = newRotationX;
        }
      }

      previousMousePosition = { x: e.offsetX, y: e.offsetY };
    });

    container.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Smoother animation loop
    function animate() {
      requestAnimationFrame(animate);

      if (autoRotate) {
        earth.rotation.y += 0.001;
        clouds.rotation.y += 0.0012;
      }

      renderer.render(scene, camera);
    }

    initScene();
    animate();

    return () => {
      // Cleanup
      renderer.dispose();
      container.removeChild(renderer.domElement);
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  return (
    <section className="relative flex items-center justify-center px-4 py-24">
      <div className="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-blue-900/5 to-transparent"></div>

      <div className="relative max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="p-8 rounded-3xl bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl transform translate-y-12 opacity-0 animate-fadeInUp">
          <h1 className="text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white via-blue-400 to-purple-500 bg-clip-text text-transparent">
            Discover New Worlds
          </h1>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Journey through the cosmos with our advanced AI technology, uncovering potentially habitable exoplanets and expanding our understanding of the universe.
          </p>
          <div className="flex gap-4">
            <Button
              variant='outline'
              href="#discover"
              className="group inline-flex items-center gap-3 px-8 py-6 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              Begin Exploration
              <ArrowRight className='transform transition-transform group-hover:translate-x-1' />
            </Button>
            <Button
              variant="outline"
              className="px-8 py-6 rounded-xl font-bold border-white/20 text-white/90 hover:bg-white/10 transition-all duration-300"
            >
              Learn More
            </Button>
          </div>
        </div>

        <div className="relative h-[600px] transform translate-x-12 opacity-0 animate-fadeInRight delay-300">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <div id="rotating-planet" className="relative w-full h-full flex items-center justify-center">
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;