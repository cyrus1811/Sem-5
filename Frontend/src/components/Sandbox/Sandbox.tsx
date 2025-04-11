import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Asteroid as AsteroidType, SandboxPlanetData, PlanetPositionData } from "@/types/types";

import Star from "./Star";
import Planet from "./Planet";
import Asteroid from "./Asteroid";
import PlanetForm from "./forms/PlanetForm";
import StarForm from "./forms/StarForm";
import RingForm from "./forms/RingForm";
import MoonForm from "./forms/MoonForm";

const Sandbox: React.FC = () => {
    const [planets, setPlanets] = useState<SandboxPlanetData[]>([]);
    const [planetPositions, setPlanetPositions] = useState<PlanetPositionData[]>([]);
    const [selectedPlanetId, setSelectedPlanetId] = useState<number | null>(null);

    // State for new planet creation
    const [planetColor, setPlanetColor] = useState("blue");
    const [planetSize, setPlanetSize] = useState(1);
    const [planetDistance, setPlanetDistance] = useState(3);
    const [planetSpeed, setPlanetSpeed] = useState(0.01);

    // States for moons (optional)
    const [moonColor, setMoonColor] = useState("gray");
    const [moonSize, setMoonSize] = useState(0.2);
    const [moonDistance, setMoonDistance] = useState(1);
    const [moonSpeed, setMoonSpeed] = useState(0.02);

    // States for stars orbiting the planet (optional)
    const [starColor, setStarColor] = useState("white");
    const [starSize, setStarSize] = useState(0.3);
    const [starDistance, setStarDistance] = useState(2);
    const [starSpeed, setStarSpeed] = useState(0.02);

    // States for rings (optional)
    const [hasRings, setHasRings] = useState(false);
    const [ringColor, setRingColor] = useState("lightgray");
    const [ringSize, setRingSize] = useState(0.1);
    const [ringInnerRadius, setRingInnerRadius] = useState(2.5);
    const [ringOuterRadius, setRingOuterRadius] = useState(3.5);

    const [asteroids, setAsteroids] = useState<AsteroidType[]>([]);
    const [isEditing, setIsEditing] = useState(false);

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

    const handleAddAsteroid = () => {
        const newAsteroid: AsteroidType = {
            id: Date.now(),
            position: [Math.random() * 10 - 5, 0, Math.random() * 10 - 5],
            velocity: [(Math.random() - 0.5) * 0.05, 0, (Math.random() - 0.5) * 0.05],
        };

        setAsteroids((prev) => [...prev, newAsteroid]);
    };

    const handleAsteroidImpact = (id: number) => {
        console.log("Asteroid impacted with id:", id);
        setAsteroids((prev) => prev.filter((asteroid) => asteroid.id !== id));
    };

    const handlePlanetClick = (id: number) => {
        loadPlanetForEditing(id);
    };

    const handleAddPlanet = () => {
        const newPlanet: SandboxPlanetData = {
            id: Date.now(),
            color: planetColor,
            size: planetSize,
            distance: planetDistance,
            speed: planetSpeed,
            moons: [
                {
                    color: moonColor,
                    size: moonSize,
                    distance: moonDistance,
                    speed: moonSpeed,
                },
            ],
            stars: [
                {
                    color: starColor,
                    size: starSize,
                    distance: starDistance,
                    speed: starSpeed,
                },
            ],
            hasRings,
            ringSize,
            ringColor,
            ringInnerRadius,
            ringOuterRadius,
        };

        setPlanets(prev => [...prev, newPlanet]);

        // Initialize planet position for collision detection
        const initialX = planetDistance;
        const initialZ = 0;
        setPlanetPositions(prev => [...prev, { x: initialX, z: initialZ, size: planetSize }]);

        // Reset form
        resetForm();
    };

    // Update existing planet
    const handleUpdatePlanet = () => {
        if (selectedPlanetId === null) return;

        const updatedPlanets = planets.map(planet => {
            if (planet.id === selectedPlanetId) {
                return {
                    ...planet,
                    color: planetColor,
                    size: planetSize,
                    distance: planetDistance,
                    speed: planetSpeed,
                    moons: [
                        {
                            color: moonColor,
                            size: moonSize,
                            distance: moonDistance,
                            speed: moonSpeed,
                        },
                    ],
                    stars: [
                        {
                            color: starColor,
                            size: starSize,
                            distance: starDistance,
                            speed: starSpeed,
                        },
                    ],
                    hasRings,
                    ringSize,
                    ringColor,
                    ringInnerRadius,
                    ringOuterRadius,
                };
            }
            return planet;
        });

        setPlanets(updatedPlanets);

        // Update planet position data size as well
        const planetIndex = planets.findIndex(p => p.id === selectedPlanetId);
        if (planetIndex !== -1) {
            setPlanetPositions(prev => {
                const newPositions = [...prev];
                if (newPositions[planetIndex]) {
                    newPositions[planetIndex] = {
                        ...newPositions[planetIndex],
                        size: planetSize
                    };
                }
                return newPositions;
            });
        }

        // Reset editing state
        resetForm();
    };

    // Delete selected planet
    const handleDeletePlanet = () => {
        if (selectedPlanetId === null) return;

        const planetIndex = planets.findIndex(p => p.id === selectedPlanetId);

        setPlanets(prev => prev.filter(p => p.id !== selectedPlanetId));
        setPlanetPositions(prev => {
            const newPositions = [...prev];
            newPositions.splice(planetIndex, 1);
            return newPositions;
        });

        resetForm();
    };

    const resetForm = () => {
        setSelectedPlanetId(null);
        setIsEditing(false);

        // Reset to default values
        setPlanetColor("blue");
        setPlanetSize(1);
        setPlanetDistance(3);
        setPlanetSpeed(0.01);
        setMoonColor("gray");
        setMoonSize(0.2);
        setMoonDistance(1);
        setMoonSpeed(0.02);
        setStarColor("white");
        setStarSize(0.3);
        setStarDistance(2);
        setStarSpeed(0.02);
        setHasRings(false);
        setRingColor("lightgray");
        setRingSize(0.1);
        setRingInnerRadius(2.5);
        setRingOuterRadius(3.5);
    };

    // Undo last added planet
    const handleUndoPlanet = () => {
        setPlanets((prevPlanets) => prevPlanets.slice(0, -1));
        setPlanetPositions((prevPositions) => prevPositions.slice(0, -1));
    };

    return (
        <div className="w-full h-screen">
            <h1 className="text-2xl font-bold mb-2">Interactive Solar System Creator</h1>
            <p className="mb-4">{isEditing ? "Edit Planet (Click Update when done)" : "Create a New Planet"}</p>

            <div className="flex gap-5">
                <div className="flex-1 max-w-md overflow-y-auto max-h-[calc(100vh-200px)]">
                    {/* Planet Form Component */}
                    <PlanetForm
                        planetColor={planetColor}
                        setPlanetColor={setPlanetColor}
                        planetSize={planetSize}
                        setPlanetSize={setPlanetSize}
                        planetDistance={planetDistance}
                        setPlanetDistance={setPlanetDistance}
                        planetSpeed={planetSpeed}
                        setPlanetSpeed={setPlanetSpeed}
                    />

                    {/* Moon Form Component */}
                    <MoonForm
                        moonColor={moonColor}
                        setMoonColor={setMoonColor}
                        moonSize={moonSize}
                        setMoonSize={setMoonSize}
                        moonDistance={moonDistance}
                        setMoonDistance={setMoonDistance}
                        moonSpeed={moonSpeed}
                        setMoonSpeed={setMoonSpeed}
                    />

                    {/* Star Form Component */}
                    <StarForm
                        starColor={starColor}
                        setStarColor={setStarColor}
                        starSize={starSize}
                        setStarSize={setStarSize}
                        starDistance={starDistance}
                        setStarDistance={setStarDistance}
                        starSpeed={starSpeed}
                        setStarSpeed={setStarSpeed}
                    />

                    {/* Ring Form Component */}
                    <RingForm
                        hasRings={hasRings}
                        setHasRings={setHasRings}
                        ringColor={ringColor}
                        setRingColor={setRingColor}
                        ringSize={ringSize}
                        setRingSize={setRingSize}
                        ringInnerRadius={ringInnerRadius}
                        setRingInnerRadius={setRingInnerRadius}
                        ringOuterRadius={ringOuterRadius}
                        setRingOuterRadius={setRingOuterRadius}
                    />

                    {/* Action Buttons */}
                    <div className="flex gap-2 p-2 justify-between">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleUpdatePlanet}
                                    className="flex-1 p-2 bg-green-500 text-white border-none rounded"
                                >
                                    Update Planet
                                </button>
                                <button
                                    onClick={handleDeletePlanet}
                                    className="flex-1 p-2 bg-red-500 text-white border-none rounded"
                                >
                                    Delete Planet
                                </button>
                                <button
                                    onClick={resetForm}
                                    className="flex-1 p-2 bg-gray-600 text-white border-none rounded"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleAddPlanet}
                                    className="flex-1 p-2 bg-blue-500 text-white border-none rounded"
                                >
                                    Add Planet
                                </button>
                                <button
                                    onClick={handleUndoPlanet}
                                    className="flex-1 p-2 bg-yellow-600 text-white border-none rounded"
                                >
                                    Undo Last
                                </button>
                                <button
                                    onClick={handleAddAsteroid}
                                    className="flex-1 p-2 bg-purple-600 text-white border-none rounded"
                                >
                                    Add Asteroid
                                </button>
                            </>
                        )}
                    </div>

                    {/* Instructions */}
                    <div className="p-2 mt-4 bg-gray-100 rounded">
                        <h4 className="font-bold">Instructions:</h4>
                        <ul className="list-disc pl-5">
                            <li>Click on a planet to edit its properties</li>
                            <li>Selected planets appear with a wireframe effect</li>
                            <li>Add asteroids to see them interact with planets</li>
                            <li>Use mouse to rotate and zoom the view</li>
                        </ul>
                    </div>
                </div>

                <div className="flex-2">
                    <Canvas camera={{ position: [0, 10, 20], fov: 50 }}>
                        <OrbitControls target={[0, 0, 0]} />
                        <ambientLight intensity={1} />
                        <directionalLight position={[10, 10, 5]} intensity={2} />

                        {/* Background stars */}
                        <Stars />

                        {/* Render star */}
                        <Star size={3} color="yellow" />

                        {/* Render asteroids */}
                        {asteroids.map((asteroid) => (
                            <Asteroid
                                key={asteroid.id}
                                id={asteroid.id}
                                position={asteroid.position}
                                velocity={asteroid.velocity}
                                planets={planetPositions}
                                onImpact={handleAsteroidImpact}
                            />
                        ))}

                        {/* Render planets */}
                        {planets.map((planet, index) => (
                            <Planet
                                key={planet.id}
                                planetData={planet}
                                index={index}
                                updatePlanetPosition={updatePlanetPosition}
                                onPlanetClick={handlePlanetClick}
                                isSelected={selectedPlanetId === planet.id}
                            />
                        ))}
                    </Canvas>
                </div>
            </div>
        </div>
    )
}

export default Sandbox;