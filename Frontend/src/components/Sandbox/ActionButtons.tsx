import { motion } from 'framer-motion'
import { MdDeleteForever, MdOutlineCancel, MdAdd, MdUpdate } from "react-icons/md";
import { FaUndo } from "react-icons/fa";
import { GiAsteroid } from "react-icons/gi";
import gsap from 'gsap';
import { ActionButtonsProps, SandboxPlanetData, Asteroid } from '@/types/types';

const ActionButtons = ({ isEditing, resetForm, setPlanets, setPlanetPositions, selectedPlanetId, planets, planetColor, planetSize, planetDistance, planetSpeed, moonColor, moonSize, moonDistance, moonSpeed, starColor, starSize, starDistance, starSpeed, hasRings, ringSize, ringColor, ringInnerRadius, ringOuterRadius, setAsteroids }: ActionButtonsProps) => {

    const handleUndoPlanet = () => {
        // GSAP animation for button press
        gsap.fromTo(".undo-btn",
            { scale: 1 },
            { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1 }
        );

        setPlanets((prevPlanets) => prevPlanets.slice(0, -1));
        setPlanetPositions((prevPositions) => prevPositions.slice(0, -1));
    };

    const handleDeletePlanet = () => {
        if (selectedPlanetId === null) return;

        // GSAP animation for button press
        gsap.fromTo(".delete-btn",
            { scale: 1 },
            { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1 }
        );

        const planetIndex = planets.findIndex(p => p.id === selectedPlanetId);

        setPlanets(prev => prev.filter(p => p.id !== selectedPlanetId));
        setPlanetPositions(prev => {
            const newPositions = [...prev];
            newPositions.splice(planetIndex, 1);
            return newPositions;
        });

        resetForm();
    };

    const handleUpdatePlanet = () => {
        if (selectedPlanetId === null) return;

        // GSAP animation for button press
        gsap.fromTo(".update-btn",
            { scale: 1 },
            { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1 }
        );

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

    const handleAddPlanet = () => {
        // GSAP animation for button press
        gsap.fromTo(".add-btn",
            { scale: 1 },
            { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1 }
        );

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

    const handleAddAsteroid = () => {
        // GSAP animation for button press
        gsap.fromTo(".asteroid-btn",
            { scale: 1 },
            { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1 }
        );

        const newAsteroid: Asteroid = {
            id: Date.now(),
            position: [Math.random() * 10 - 5, 0, Math.random() * 10 - 5],
            velocity: [(Math.random() - 0.5) * 0.05, 0, (Math.random() - 0.5) * 0.05],
        };

        setAsteroids((prev) => [...prev, newAsteroid]);
    };

    return (
        <div className="mt-6">
            {isEditing ? (
                <div className="flex gap-2">
                    <motion.button
                        className="flex-1 p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center update-btn"
                        onClick={handleUpdatePlanet}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <MdUpdate className="mr-1" />
                        Update
                    </motion.button>
                    <motion.button
                        className="flex-1 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center delete-btn"
                        onClick={handleDeletePlanet}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <MdDeleteForever className="mr-1" />
                        Delete
                    </motion.button>
                    <motion.button
                        className="flex-1 p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center justify-center"
                        onClick={resetForm}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <MdOutlineCancel className="mr-1" />
                        Cancel
                    </motion.button>
                </div>
            ) : (
                <div className="flex gap-2">
                    <motion.button
                        className="flex-1 p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center justify-center add-btn"
                        onClick={handleAddPlanet}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <MdAdd className="mr-1" />
                        Add Planet
                    </motion.button>
                    <motion.button
                        className="flex-1 p-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg flex items-center justify-center undo-btn"
                        onClick={handleUndoPlanet}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <FaUndo className="mr-1" />
                        Undo
                    </motion.button>
                    <motion.button
                        className="flex-1 p-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg flex items-center justify-center asteroid-btn"
                        onClick={handleAddAsteroid}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <GiAsteroid className="mr-1" />
                        Asteroid
                    </motion.button>
                </div>
            )}
        </div>
    )
}

export default ActionButtons