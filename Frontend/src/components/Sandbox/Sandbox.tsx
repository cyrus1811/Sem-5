import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { Asteroid as AsteroidType, SandboxPlanetData, PlanetPositionData } from "@/types/types";
import CanvasComponent from "./CanvasComponent";

import { BiPlanet } from "react-icons/bi";
import {  GiAsteroid } from "react-icons/gi";
import { VscDebugRestart } from "react-icons/vsc";
import Instructions from "./Instructions";
import ActionButtons from "./ActionButtons";
import PlanetForm from "./forms/PlanetForm";
import MoonForm from "./forms/MoonForm";
import StarForm from "./forms/StarForm";
import RingForm from "./forms/RingForm";
import Tabs from "./Tabs";

const Sandbox = () => {
    const [planets, setPlanets] = useState<SandboxPlanetData[]>([]);
    const [planetPositions, setPlanetPositions] = useState<PlanetPositionData[]>([]);
    const [selectedPlanetId, setSelectedPlanetId] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState("planet");
    const [isFormExpanded, setIsFormExpanded] = useState(true);
    const canvasRef = useRef(null);

    // State for new planet creation
    const [planetColor, setPlanetColor] = useState("#3b82f6");
    const [planetSize, setPlanetSize] = useState(1);
    const [planetDistance, setPlanetDistance] = useState(3);
    const [planetSpeed, setPlanetSpeed] = useState(0.01);

    // States for moons
    const [moonColor, setMoonColor] = useState("#d1d5db");
    const [moonSize, setMoonSize] = useState(0.2);
    const [moonDistance, setMoonDistance] = useState(1);
    const [moonSpeed, setMoonSpeed] = useState(0.02);

    // States for stars
    const [starColor, setStarColor] = useState("#ffffff");
    const [starSize, setStarSize] = useState(0.3);
    const [starDistance, setStarDistance] = useState(2);
    const [starSpeed, setStarSpeed] = useState(0.02);

    // States for rings
    const [hasRings, setHasRings] = useState(false);
    const [ringColor, setRingColor] = useState("#d1d5db");
    const [ringSize, setRingSize] = useState(0.1);
    const [ringInnerRadius, setRingInnerRadius] = useState(2.5);
    const [ringOuterRadius, setRingOuterRadius] = useState(3.5);

    const [asteroids, setAsteroids] = useState<AsteroidType[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [showIntro, setShowIntro] = useState(true);
    const [asteroidCount, setAsteroidCount] = useState(0);
    const [planetCount, setPlanetCount] = useState(0);
    const formRef = useRef(null);

    useEffect(() => {
        // Intro animation
        if (showIntro) {
            const timer = setTimeout(() => {
                setShowIntro(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showIntro]);

    useEffect(() => {
        // Background animation using GSAP
        if (canvasRef.current) {
            gsap.to(canvasRef.current, {
                background: "linear-gradient(45deg, #0a0a1a, #1a1a3a)",
                duration: 10,
                repeat: -1,
                yoyo: true
            });
        }
    }, []);

    useEffect(() => {
        // Update planet/asteroid counts
        setPlanetCount(planets.length);
        setAsteroidCount(asteroids.length);
    }, [planets, asteroids]);

    const loadPlanetForEditing = (id: number) => {
        const planet = planets.find(p => p.id === id);
        if (planet) {
            setPlanetColor(planet.color);
            setPlanetSize(planet.size);
            setPlanetDistance(planet.distance);
            setPlanetSpeed(planet.speed);

            // Load moon data if available
            if (planet.moons.length > 0) {
                setMoonColor(planet.moons[0].color);
                setMoonSize(planet.moons[0].size);
                setMoonDistance(planet.moons[0].distance);
                setMoonSpeed(planet.moons[0].speed);
            }

            // Load star data if available
            if (planet.stars.length > 0) {
                setStarColor(planet.stars[0].color);
                setStarSize(planet.stars[0].size);
                setStarDistance(planet.stars[0].distance);
                setStarSpeed(planet.stars[0].speed);
            }

            // Load ring data
            setHasRings(planet.hasRings);
            setRingColor(planet.ringColor);
            setRingSize(planet.ringSize);
            setRingInnerRadius(planet.ringInnerRadius);
            setRingOuterRadius(planet.ringOuterRadius);

            setSelectedPlanetId(id);
            setIsEditing(true);

            // Animation for form highlight
            if (formRef.current) {
                gsap.fromTo(
                    formRef.current,
                    { boxShadow: "0 0 0 rgba(59, 130, 246, 0)" },
                    { boxShadow: "0 0 20px rgba(59, 130, 246, 0.8)", duration: 0.5, repeat: 3, yoyo: true }
                );
            }
        }
    };

    const updatePlanetPosition = (index: number, x: number, z: number) => {
        setPlanetPositions(prevPositions => {
            const newPositions = [...prevPositions];
            if (newPositions[index]) {
                newPositions[index] = {
                    ...newPositions[index],
                    x,
                    z
                };
            }
            return newPositions;
        });
    };

    const handleAsteroidImpact = (id: number) => {
        console.log("Asteroid impacted with id:", id);
        setAsteroids((prev) => prev.filter((asteroid) => asteroid.id !== id));
    };

    const handlePlanetClick = (id: number) => {
        loadPlanetForEditing(id);
        // Set planet tab as active when a planet is clicked
        setActiveTab("planet");
    };

    const resetForm = () => {
        setSelectedPlanetId(null);
        setIsEditing(false);

        // Reset to default values
        setPlanetColor("#3b82f6");
        setPlanetSize(1);
        setPlanetDistance(3);
        setPlanetSpeed(0.01);
        setMoonColor("#d1d5db");
        setMoonSize(0.2);
        setMoonDistance(1);
        setMoonSpeed(0.02);
        setStarColor("#ffffff");
        setStarSize(0.3);
        setStarDistance(2);
        setStarSpeed(0.02);
        setHasRings(false);
        setRingColor("#d1d5db");
        setRingSize(0.1);
        setRingInnerRadius(2.5);
        setRingOuterRadius(3.5);
    };

    const clearAll = () => {
        // GSAP animation for button press
        gsap.fromTo(".reset-btn",
            { scale: 1 },
            { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1 }
        );

        setPlanets([]);
        setPlanetPositions([]);
        setAsteroids([]);
        resetForm();
    };

    const toggleForm = () => {
        setIsFormExpanded(!isFormExpanded);
    };

    // Intro animation
    if (showIntro) {
        return (
            <motion.div
                className="w-full h-screen bg-black flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1], rotate: [0, 0, 360] }}
                    transition={{ duration: 2, times: [0, 0.8, 1] }}
                    className="text-center"
                >
                    <motion.h1
                        className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"
                        animate={{
                            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                        }}
                        transition={{ duration: 5, repeat: Infinity }}
                    >
                        COSMIC CREATOR
                    </motion.h1>
                    <motion.p
                        className="text-gray-400 mt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        Build your own universe
                    </motion.p>
                </motion.div>
            </motion.div>
        );
    }

    return (
        <div className="w-full h-screen bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
            {/* Header */}
            <motion.div
                className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 p-4 shadow-lg"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
            >
                <div className="container mx-auto flex justify-between items-center">
                    <motion.h1
                        className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-red-400"
                        whileHover={{ scale: 1.05 }}
                    >
                        COSMIC CREATOR
                    </motion.h1>
                    <div className="flex space-x-2">
                        <div className="bg-gray-800 rounded-lg px-3 py-1 flex items-center">
                            <BiPlanet className="mr-1 text-blue-400" />
                            <span className="text-sm">{planetCount}</span>
                        </div>
                        <div className="bg-gray-800 rounded-lg px-3 py-1 flex items-center">
                            <GiAsteroid className="mr-1 text-purple-400" />
                            <span className="text-sm">{asteroidCount}</span>
                        </div>
                        <motion.button
                            className="bg-red-600 hover:bg-red-700 rounded-lg px-3 py-1 flex items-center reset-btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={clearAll}
                        >
                            <VscDebugRestart className="mr-1" />
                            <span className="text-sm">Reset</span>
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            <div className="flex h-[calc(100vh-64px)]">
                {/* Sidebar - Collapsible */}
                <motion.div
                    className="bg-gray-900 w-96 relative overflow-hidden shadow-xl border-r border-purple-900/30"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: isFormExpanded ? 0 : -352, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    ref={formRef}
                >
                    {/* Toggle button */}
                    <motion.button
                        className="absolute top-1/2 -right-6 w-6 h-12 bg-purple-600 rounded-r-md flex items-center justify-center z-10"
                        onClick={toggleForm}
                        whileHover={{ scale: 1.1 }}
                    >
                        <motion.div
                            animate={{ rotate: isFormExpanded ? 0 : 180 }}
                        >
                            ›
                        </motion.div>
                    </motion.button>

                    <div className="p-4 h-full overflow-auto">
                        <div className="mb-5">
                            <motion.h2
                                className="text-2xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                {isEditing ? "EDIT PLANET" : "CREATE PLANET"}
                            </motion.h2>
                        </div>

                        {/* Tabs */}
                        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

                        {/* Tab content */}
                        <div className="mb-4">
                            {activeTab === "planet" && <PlanetForm planetColor={planetColor} setPlanetColor={setPlanetColor} planetSize={planetSize} setPlanetSize={setPlanetSize} planetDistance={planetDistance} setPlanetDistance={setPlanetDistance} planetSpeed={planetSpeed} setPlanetSpeed={setPlanetSpeed} />}
                            {activeTab === "moon" && <MoonForm moonColor={moonColor} setMoonColor={setMoonColor} moonSize={moonSize} setMoonSize={setMoonSize} moonDistance={moonDistance} setMoonDistance={setMoonDistance} moonSpeed={moonSpeed} setMoonSpeed={setMoonSpeed} />}
                            {activeTab === "star" && <StarForm starColor={starColor} setStarColor={setStarColor} starSize={starSize} setStarSize={setStarSize} starDistance={starDistance} setStarDistance={setStarDistance} starSpeed={starSpeed} setStarSpeed={setStarSpeed} />}
                            {activeTab === "ring" && <RingForm hasRings={hasRings} setHasRings={setHasRings} ringColor={ringColor} setRingColor={setRingColor} ringSize={ringSize} setRingSize={setRingSize} ringInnerRadius={ringInnerRadius} setRingInnerRadius={setRingInnerRadius} ringOuterRadius={ringOuterRadius} setRingOuterRadius={setRingOuterRadius} />}
                        </div>

                        {/* Action buttons */}
                        <ActionButtons resetForm={resetForm} isEditing={isEditing} setPlanets={setPlanets} setPlanetPositions={setPlanetPositions} selectedPlanetId={selectedPlanetId} planets={planets} planetColor={planetColor} planetSize={planetSize} planetDistance={planetDistance} planetSpeed={planetSpeed} moonColor={moonColor} moonSize={moonSize} moonDistance={moonDistance} moonSpeed={moonSpeed} starColor={starColor} starSize={starSize} starDistance={starDistance} starSpeed={starSpeed} hasRings={hasRings} ringSize={ringSize} ringColor={ringColor} ringInnerRadius={ringInnerRadius} ringOuterRadius={ringOuterRadius} setAsteroids={setAsteroids} />

                        {/* Instructions */}
                        <Instructions />
                    </div>
                </motion.div>

                {/* Main canvas */}
                <motion.div
                    className="flex-1 relative"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    ref={canvasRef}
                >
                    <CanvasComponent asteroids={asteroids} planets={planets} planetPositions={planetPositions} handleAsteroidImpact={handleAsteroidImpact} updatePlanetPosition={updatePlanetPosition} handlePlanetClick={handlePlanetClick} selectedPlanetId={selectedPlanetId} />

                    {/* Floating Info Panel */}
                    <motion.div
                        className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg border border-purple-500/30 max-w-sm"
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8, type: "spring", stiffness: 120 }}
                    >
                        <h3 className="text-lg font-bold mb-2 text-purple-400">Universe Stats</h3>
                        <div className="flex justify-between text-sm">
                            <div>
                                <p className="text-gray-400">Planets: <span className="text-white">{planetCount}</span></p>
                                <p className="text-gray-400">Asteroids: <span className="text-white">{asteroidCount}</span></p>
                            </div>
                            <div>
                                <p className="text-gray-400">Selected: <span className="text-white">{selectedPlanetId ? `#${selectedPlanetId}` : "None"}</span></p>
                                <p className="text-gray-400 ms-2">Mode: <span className="text-white">{isEditing ? "Editing" : "Creating"}</span></p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Sandbox;