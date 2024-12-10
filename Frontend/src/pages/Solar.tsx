//@ts-nocheck

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const SolarSystem = () => {
    const containerRef = useRef(null);
    const [orbitsVisible, setOrbitsVisible] = useState(true);
    const solarSystemRef = useRef(null);

    useEffect(() => {
        class SolarSystem {
            constructor(container) {
                this.container = container;
                this.init();
                this.createScene();
                this.createLights();
                this.createStarfield();
                this.createPlanets();
                this.createOrbits();
                this.createAsteroidBelt();
                this.setupControls();
                this.addEventListeners();
                this.animate();
            }

            init() {
                this.scene = new THREE.Scene();
                this.camera = new THREE.PerspectiveCamera(
                    75,
                    this.container.offsetWidth / this.container.offsetHeight,
                    0.1,
                    1000
                );

                this.renderer = new THREE.WebGLRenderer({ antialias: true });
                this.renderer.setPixelRatio(window.devicePixelRatio);
                this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
                this.container.appendChild(this.renderer.domElement);

                this.camera.position.set(0, 20, 30);
                this.camera.lookAt(0, 0, 0);

                this.scene.background = new THREE.Color(0x000000);

                this.planets = [];
                this.orbits = [];
                this.labels = [];
                this.showOrbits = true;
                this.showLabels = true;
            }

            createScene() {
                this.controls = new OrbitControls(this.camera, this.renderer.domElement);
                this.controls.enableDamping = true;
                this.controls.dampingFactor = 0.05;
                this.controls.minDistance = 10;
                this.controls.maxDistance = 100;
            }

            createLights() {
                const ambientLight = new THREE.AmbientLight(0x404040);
                this.scene.add(ambientLight);

                const pointLight = new THREE.PointLight(0xffffff, 2, 100);
                pointLight.position.set(0, 0, 0);
                this.scene.add(pointLight);
            }

            createAsteroidBelt() {
                const asteroidGeometry = new THREE.SphereGeometry(0.1, 8, 8);
                const beltRadius = 15;

                for (let i = 0; i < 100; i++) {
                    const material = new THREE.MeshBasicMaterial({ color: 0x888888 });
                    const asteroid = new THREE.Mesh(asteroidGeometry, material);

                    const angle = Math.random() * Math.PI * 2;
                    const distance = beltRadius + (Math.random() * 2 - 1);
                    asteroid.position.set(
                        Math.cos(angle) * distance,
                        0,
                        Math.sin(angle) * distance
                    );

                    this.scene.add(asteroid);
                }
            }


            createStarfield() {
                const starsGeometry = new THREE.BufferGeometry();
                const starCount = 10000;
                const positions = new Float32Array(starCount * 3);

                for (let i = 0; i < starCount; i++) {
                    const i3 = i * 3;
                    const radius = 100 + Math.random() * 900;
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.acos((Math.random() * 2) - 1);

                    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
                    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
                    positions[i3 + 2] = radius * Math.cos(phi);
                }

                starsGeometry.setAttribute(
                    "position",
                    new THREE.BufferAttribute(positions, 3)
                );

                const starsMaterial = new THREE.PointsMaterial({
                    color: 0xffffff,
                    size: 0.1,
                    transparent: true,
                    opacity: 0.8,
                    sizeAttenuation: true,
                });

                const starField = new THREE.Points(starsGeometry, starsMaterial);
                this.scene.add(starField);
            }

            createPlanets() {
                const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
                const sunMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffff00,
                    emissive: 0xffff00,
                });
                const sun = new THREE.Mesh(sunGeometry, sunMaterial);
                this.scene.add(sun);

                const planetsData = [
                    ["Mercury", 0.4, 5, 0xaaaaaa, 0.01],
                    ["Venus", 0.6, 7, 0xffcc00, 0.008],
                    ["Earth", 0.6, 10, 0x2233ff, 0.006],
                    ["Mars", 0.4, 13, 0xff3300, 0.004],
                    ["Jupiter", 1.2, 17, 0xffcc00, 0.002],
                    ["Saturn", 1.0, 21, 0xff9900, 0.0015],
                    ["Uranus", 0.8, 25, 0x66ccff, 0.001],
                    ["Neptune", 0.8, 28, 0x3399ff, 0.0008],
                ];

                planetsData.forEach(([name, radius, distance, color, speed]) => {
                    const geometry = new THREE.SphereGeometry(radius, 32, 32);
                    const material = new THREE.MeshPhongMaterial({
                        color,
                        shininess: 30,
                    });
                    const planet = new THREE.Mesh(geometry, material);

                    planet.userData = {
                        name,
                        distance,
                        speed,
                        angle: Math.random() * Math.PI * 2,
                    };

                    this.planets.push(planet);
                    this.scene.add(planet);
                });
            }

            createOrbits() {
                this.orbits = []; // Ensure orbits array is initialized

                this.planets.forEach((planet) => {
                    const orbitGeometry = new THREE.BufferGeometry();
                    const segments = 128;
                    const points = [];

                    // Generate points for the orbit circle
                    for (let i = 0; i <= segments; i++) {
                        const theta = (i / segments) * Math.PI * 2;
                        const x = planet.userData.distance * Math.cos(theta);
                        const z = planet.userData.distance * Math.sin(theta);
                        points.push(new THREE.Vector3(x, 0, z));
                    }

                    orbitGeometry.setFromPoints(points);

                    // Use a semi-transparent white color for orbits
                    const orbitMaterial = new THREE.MeshBasicMaterial({
                        color: 0x444444,
                        transparent: true,
                        opacity: 0.3,
                        side: THREE.DoubleSide
                    });
                    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
                    orbit.rotation.x = Math.PI / 2;
                    this.orbits.push(orbit);
                    this.scene.add(orbit);
                });
            }

            setupControls() {
                window.addEventListener("resize", () => {
                    this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
                    this.camera.updateProjectionMatrix();
                    this.renderer.setSize(
                        this.container.offsetWidth,
                        this.container.offsetHeight
                    );
                });
            }

            addEventListeners() {
                window.addEventListener('resize', this.handleWindowResize.bind(this));
            }

            handleWindowResize = () => {
                this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
            };

            animate = () => {
                requestAnimationFrame(this.animate);

                this.planets.forEach((planet) => {
                    planet.userData.angle += planet.userData.speed;
                    planet.position.set(
                        Math.cos(planet.userData.angle) * planet.userData.distance,
                        0,
                        Math.sin(planet.userData.angle) * planet.userData.distance
                    );
                });

                this.updateLabels();
                this.controls.update();
                this.renderer.render(this.scene, this.camera);
            };

            updateLabels = () => {
                this.labels.forEach(({ element, planet }) => {
                    const vector = new THREE.Vector3();
                    planet.getWorldPosition(vector);
                    vector.project(this.camera);

                    const x = (vector.x * 0.5 + 0.5) * this.container.offsetWidth;
                    const y = (-vector.y * 0.5 + 0.5) * this.container.offsetHeight;

                    element.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
                });
            };


            createOrbits() {
                this.planets.forEach((planet) => {
                    const orbitGeometry = new THREE.BufferGeometry();
                    const segments = 64;
                    const points = [];

                    // Generate points for the circle
                    for (let i = 0; i <= segments; i++) {
                        const theta = (i / segments) * Math.PI * 2;
                        const x = planet.userData.distance * Math.cos(theta);
                        const z = planet.userData.distance * Math.sin(theta);
                        points.push(new THREE.Vector3(x, 0, z));
                    }

                    orbitGeometry.setFromPoints(points);

                    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
                    const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
                    orbit.rotation.x = Math.PI / 2; // Rotate to match the horizontal plane
                    this.orbits.push(orbit);
                    this.scene.add(orbit);
                });
            }


            toggleOrbits(visible) {
                if (this.orbits) {
                    this.orbits.forEach((orbit) => {
                        orbit.visible = visible;
                    });
                }
            }
        }

        if (containerRef.current) {
            const solarSystem = new SolarSystem(containerRef.current);
            solarSystemRef.current = solarSystem;
        }

        return () => {
            if (containerRef.current) {
                while (containerRef.current.firstChild) {
                    containerRef.current.removeChild(containerRef.current.firstChild);
                }
            }
        };
    }, []);

    const handleToggleOrbits = () => {
        const newOrbitsVisibility = !orbitsVisible;
        setOrbitsVisible(newOrbitsVisibility);

        if (solarSystemRef.current) {
            solarSystemRef.current.toggleOrbits(newOrbitsVisibility);
        }
    };

    return (
        <div className="h-screen w-full bg-black flex flex-col justify-center items-center">
            <div ref={containerRef} className="w-full h-full" />
            <button
                onClick={handleToggleOrbits}
                className="absolute bottom-4 z-10 bg-white/20 text-white px-4 py-2 rounded"
            >
                {orbitsVisible ? 'Hide Orbits' : 'Show Orbits'}
            </button>
        </div>
    );
};

export default SolarSystem;