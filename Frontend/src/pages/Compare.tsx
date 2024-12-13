// @ts-nocheck

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";

const EarthExoplanetComparison = () => {
  const canvasRef = useRef(null);
  const [exoplanetSize, setExoplanetSize] = useState(1.0);
  const [earthSize, setEarthSize] = useState(1.0);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const earthSphereRef = useRef(null);
  const exoplanetSphereRef = useRef(null);
  const starsRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 2, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasRef.current.appendChild(renderer.domElement);

    // Create starry background
    const createStarfield = () => {
      const starGeometry = new THREE.BufferGeometry();
      const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true
      });

      const starVertices = [];
      for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starVertices.push(x, y, z);
      }

      starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
      const stars = new THREE.Points(starGeometry, starMaterial);
      starsRef.current = stars;
      scene.add(stars);
    };

    createStarfield();

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableZoom = true;

    // Earth
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2a72d4,
      shininess: 10,
      specular: 0x88cc88,
    });
    const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
    const earthSphere = new THREE.Mesh(earthGeometry, earthMaterial);
    earthSphereRef.current = earthSphere;
    earthSphere.position.set(0, 0, 0);
    scene.add(earthSphere);

    // Exoplanet
    const exoplanetMaterial = new THREE.MeshPhongMaterial({
      emissive: 0xffffff,
      emissiveIntensity: 0.5,
      shininess: 50,
      color: 0xaaaaaa
    });

    const createExoplanet = (size) => {
      // Remove existing exoplanet if it exists
      if (exoplanetSphereRef.current) {
        scene.remove(exoplanetSphereRef.current);
      }

      const exoplanetGeometry = new THREE.SphereGeometry(size, 64, 64);
      const exoplanetSphere = new THREE.Mesh(exoplanetGeometry, exoplanetMaterial);
      exoplanetSphereRef.current = exoplanetSphere;
      exoplanetSphere.position.set(3, 0, 0);
      scene.add(exoplanetSphere);
    };

    createExoplanet(1);

    // Animation variables
    let orbitRadius = 3, orbitSpeed = 0.02, angle = 0;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Starfield rotation
      if (starsRef.current) {
        starsRef.current.rotation.x += 0.0001;
        starsRef.current.rotation.y += 0.0002;
      }

      // Exoplanet orbit
      angle += orbitSpeed;
      if (exoplanetSphereRef.current) {
        exoplanetSphereRef.current.position.x = orbitRadius * Math.cos(angle);
        exoplanetSphereRef.current.position.z = orbitRadius * Math.sin(angle);
      }

      // Rotations
      earthSphere.rotation.y += 0.005;
      if (exoplanetSphereRef.current) {
        exoplanetSphereRef.current.rotation.y += 0.005;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  // Update exoplanet size when slider changes
  useEffect(() => {
    if (sceneRef.current && exoplanetSphereRef.current) {
      const scene = sceneRef.current;
      const createExoplanet = (size) => {
        scene.remove(exoplanetSphereRef.current);

        const exoplanetMaterial = new THREE.MeshPhongMaterial({
          emissive: 0xffffff,
          emissiveIntensity: 0.5,
          shininess: 50,
          color: 0xaaaaaa
        });

        const exoplanetGeometry = new THREE.SphereGeometry(size, 64, 64);
        const exoplanetSphere = new THREE.Mesh(exoplanetGeometry, exoplanetMaterial);
        exoplanetSphere.position.set(3, 0, 0);
        scene.add(exoplanetSphere);
        exoplanetSphereRef.current = exoplanetSphere;
      };

      createExoplanet(exoplanetSize);
    }
  }, [exoplanetSize]);

  // Update earth size when planet is selected
  useEffect(() => {
    if (earthSphereRef.current) {
      const earthSphere = earthSphereRef.current;
      earthSphere.scale.set(earthSize, earthSize, earthSize);
    }
  }, [earthSize]);

  return (
    <div className="relative w-full h-screen bg-black">
      <Card className="absolute top-4 left-4 z-10 w-72 bg-white/10 backdrop-blur-md border border-white/20">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="planetSelect"
              className="text-white hover:text-gray-200"
            >
              Select Planet
            </Label>
            <Select onValueChange={(value) => setEarthSize(parseFloat(value))}>
              <SelectTrigger className="bg-white/10 text-white border-white/20 hover:bg-white/20 rounded-xl">
                <SelectValue placeholder="Select a planet" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white border-white/20">
                <SelectItem
                  value="1.0"
                  className="text-white hover:bg-white/10 focus:bg-white/20"
                >
                  Earth
                </SelectItem>
                <SelectItem
                  value="0.5"
                  className="text-white hover:bg-white/10 focus:bg-white/20"
                >
                  Mercury
                </SelectItem>
                <SelectItem
                  value="0.6"
                  className="text-white hover:bg-white/10 focus:bg-white/20"
                >
                  Venus
                </SelectItem>
                <SelectItem
                  value="0.53"
                  className="text-white hover:bg-white/10 focus:bg-white/20"
                >
                  Mars
                </SelectItem>
                <SelectItem
                  value="1.4"
                  className="text-white hover:bg-white/10 focus:bg-white/20"
                >
                  Jupiter
                </SelectItem>
                <SelectItem
                  value="1.2"
                  className="text-white hover:bg-white/10 focus:bg-white/20"
                >
                  Saturn
                </SelectItem>
                <SelectItem
                  value="0.5"
                  className="text-white hover:bg-white/10 focus:bg-white/20"
                >
                  Uranus
                </SelectItem>
                <SelectItem
                  value="0.5"
                  className="text-white hover:bg-white/10 focus:bg-white/20"
                >
                  Neptune
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="sizeSlider"
              className="text-white hover:text-gray-200"
            >
              Exoplanet Size
            </Label>
            <Slider
              id="sizeSlider"
              min={0.5}
              max={2.0}
              step={0.1}
              value={[exoplanetSize]}
              onValueChange={(values) => setExoplanetSize(values[0])}
              className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-white hover:[&_[role=slider]]:bg-gray-200 bg-blue-200"
            />
            <p className="text-xs text-white/70">
              Adjust exoplanet size: {exoplanetSize.toFixed(1)}
            </p>
          </div>
        </CardContent>
      </Card>
      <div ref={canvasRef} className="w-full h-full"></div>
    </div>
  );
};

export default EarthExoplanetComparison;
