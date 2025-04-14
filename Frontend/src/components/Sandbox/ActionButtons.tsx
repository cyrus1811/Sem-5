import { motion } from 'framer-motion'
import { MdDeleteForever, MdOutlineCancel, MdAdd, MdUpdate, MdImage, MdFileUpload } from "react-icons/md";
import { FaUndo } from "react-icons/fa";
import { GiAsteroid } from "react-icons/gi";
import gsap from 'gsap';
import { ActionButtonsProps, SandboxPlanetData, Asteroid } from '@/types/types';
import { useState, useRef } from 'react';

// Predefined texture options for planets and moons
const planetTextures = [
    { name: "Earth", url: "/3d-models/earth/textures/image.png" },
    { name: "Mars", url: "/3d-models/mars/textures/Material.001_baseColor.jpeg" },
    { name: "Jupiter", url: "/3d-models/jupiter/textures/Material_baseColor.jpeg" },
    { name: "Saturn", url: "/3d-models/saturn/textures/Material.002_baseColor.jpeg" },
    { name: "Neptune", url: "/3d-models/neptune/textures/moon_baseColor.jpeg" },
    { name: "Venus", url: "/3d-models/venus/textures/moon_baseColor.jpeg" },
    { name: "Mercury", url: "/3d-models/mercury/textures/mercurius_diffuse.png" },
    { name: "Uranus", url: "/3d-models/uranus/textures/Material.002_baseColor.jpeg" },
    { name: "Pluto", url: "/3d-models/pluto/textures/Scene_-_Root_baseColor.jpeg" },
    { name: "Moon", url: "/3d-models/moon/textures/Material.001_baseColor.jpeg" },
    { name: "Upload Image", url: "upload" }
];

const moonTextures = [
    { name: "Earth's Moon", url: "/3d-models/moon/textures/Material.001_baseColor.jpeg" },
    { name: "Europa", url: "/3d-models/europa/textures/moon_baseColor.jpeg" },
    { name: "Io", url: "/3d-models/Io/textures/moon_baseColor.jpeg" },
    { name: "Ganymede", url: "/3d-models/Ganymede/textures/material_baseColor.jpeg" },
    { name: "Titan", url: "/3d-models/titan/textures/material_baseColor.jpeg" },
    { name: "Phobos", url: "/3d-models/phobos/textures/Material_baseColor.jpeg" },
    { name: "Deimos", url: "/3d-models/deimos/textures/01_-_Default_baseColor.jpeg" },
    { name: "Upload Image", url: "upload" }
];

const ActionButtons = ({
    isEditing,
    resetForm,
    setPlanets,
    setPlanetPositions,
    selectedPlanetId,
    planets,
    planetColor,
    planetSize,
    planetDistance,
    planetSpeed,
    moonColor,
    moonSize,
    moonDistance,
    moonSpeed,
    starColor,
    starSize,
    starDistance,
    starSpeed,
    hasRings,
    ringSize,
    ringColor,
    ringInnerRadius,
    ringOuterRadius,
    setAsteroids,
    // New props for textures
    planetTexture = "",
    setPlanetTexture,
    moonTexture = "",
    setMoonTexture,
    planetBumpMap = "",
    moonBumpMap = "",
    planetSpecularMap = "",
    planetCloudTexture = "",
    setPlanetCloudTexture,
    planetAtmosphere = false,
    setPlanetAtmosphere
}: ActionButtonsProps) => {
    // State for textures
    const [showPlanetTextureOptions, setShowPlanetTextureOptions] = useState(false);
    const [showMoonTextureOptions, setShowMoonTextureOptions] = useState(false);
    
    // State for uploaded image files
    const [uploadedPlanetTexture, setUploadedPlanetTexture] = useState<string | null>(null);
    const [uploadedMoonTexture, setUploadedMoonTexture] = useState<string | null>(null);
    
    // References to file inputs
    const planetFileInputRef = useRef<HTMLInputElement>(null);
    const moonFileInputRef = useRef<HTMLInputElement>(null);

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

    // File upload handlers
    const handlePlanetFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setUploadedPlanetTexture(objectUrl);
            setPlanetTexture(objectUrl);
        }
    };

    const handleMoonFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setUploadedMoonTexture(objectUrl);
            setMoonTexture(objectUrl);
        }
    };

    const triggerPlanetFileUpload = () => {
        planetFileInputRef.current?.click();
    };

    const triggerMoonFileUpload = () => {
        moonFileInputRef.current?.click();
    };

    const handleUpdatePlanet = () => {
        if (selectedPlanetId === null) return;

        // GSAP animation for button press
        gsap.fromTo(".update-btn",
            { scale: 1 },
            { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1 }
        );

        // Use the uploaded texture or selected preset
        const finalPlanetTexture = planetTexture;
        const finalMoonTexture = moonTexture;

        const updatedPlanets = planets.map(planet => {
            if (planet.id === selectedPlanetId) {
                return {
                    ...planet,
                    color: planetColor,
                    size: planetSize,
                    distance: planetDistance,
                    speed: planetSpeed,
                    // Add texture properties
                    texture: finalPlanetTexture,
                    bumpMap: planetBumpMap,
                    specularMap: planetSpecularMap,
                    cloudTexture: planetCloudTexture,
                    hasAtmosphere: planetAtmosphere,
                    moons: [
                        {
                            color: moonColor,
                            size: moonSize,
                            distance: moonDistance,
                            speed: moonSpeed,
                            texture: finalMoonTexture,
                            bumpMap: moonBumpMap,
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

        // Use the uploaded texture or selected preset
        const finalPlanetTexture = planetTexture;
        const finalMoonTexture = moonTexture;

        const newPlanet: SandboxPlanetData = {
            id: Date.now(),
            color: planetColor,
            size: planetSize,
            distance: planetDistance,
            speed: planetSpeed,
            // Add texture properties
            texture: finalPlanetTexture,
            bumpMap: planetBumpMap,
            specularMap: planetSpecularMap,
            cloudTexture: planetCloudTexture,
            hasAtmosphere: planetAtmosphere,
            moons: [
                {
                    color: moonColor,
                    size: moonSize,
                    distance: moonDistance,
                    speed: moonSpeed,
                    texture: finalMoonTexture,
                    bumpMap: moonBumpMap,
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

    // Function to handle planet texture selection
    const handlePlanetTextureSelect = (url: string) => {
        if (url === "upload") {
            triggerPlanetFileUpload();
        } else {
            setPlanetTexture(url);
        }
        setShowPlanetTextureOptions(false);
    };

    // Function to handle moon texture selection
    const handleMoonTextureSelect = (url: string) => {
        if (url === "upload") {
            triggerMoonFileUpload();
        } else {
            setMoonTexture(url);
        }
        setShowMoonTextureOptions(false);
    };

    // Function to get display name for selected texture
    const getPlanetTextureDisplayName = () => {
        if (!planetTexture) return "Select Planet Texture";
        if (uploadedPlanetTexture && planetTexture === uploadedPlanetTexture) return "Uploaded Image";
        return planetTextures.find(t => t.url === planetTexture)?.name || "Selected Texture";
    };

    const getMoonTextureDisplayName = () => {
        if (!moonTexture) return "Select Moon Texture";
        if (uploadedMoonTexture && moonTexture === uploadedMoonTexture) return "Uploaded Image";
        return moonTextures.find(t => t.url === moonTexture)?.name || "Selected Texture";
    };

    return (
        <>
            {/* Hidden file inputs */}
            <input
                type="file"
                ref={planetFileInputRef}
                onChange={handlePlanetFileChange}
                accept="image/*"
                className="hidden"
            />
            <input
                type="file"
                ref={moonFileInputRef}
                onChange={handleMoonFileChange}
                accept="image/*"
                className="hidden"
            />

            {/* Texture Selection UI */}
            <div className="mt-4 space-y-4">
                <div className="flex flex-col space-y-2">
                    <label className="font-medium text-gray-200">Planet Texture</label>
                    <div className="relative">
                        <div
                            className="flex items-center justify-between p-2 bg-gray-700 rounded-lg cursor-pointer"
                            onClick={() => setShowPlanetTextureOptions(!showPlanetTextureOptions)}
                        >
                            <div className="flex items-center">
                                {uploadedPlanetTexture && planetTexture === uploadedPlanetTexture ? (
                                    <div className="w-8 h-8 mr-2 bg-cover rounded" style={{ backgroundImage: `url(${uploadedPlanetTexture})` }}></div>
                                ) : (
                                    <MdImage className="mr-2 text-blue-400" />
                                )}
                                {getPlanetTextureDisplayName()}
                            </div>
                            <span className="text-xs text-gray-400">▼</span>
                        </div>

                        {showPlanetTextureOptions && (
                            <div className="absolute z-10 w-full mt-1 bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {planetTextures.map((texture) => (
                                    <div
                                        key={texture.name}
                                        className="flex items-center p-2 hover:bg-gray-700 cursor-pointer"
                                        onClick={() => handlePlanetTextureSelect(texture.url)}
                                    >
                                        {texture.url && texture.url !== "upload" ? (
                                            <div className="w-8 h-8 mr-2 bg-cover rounded" style={{ backgroundImage: `url(${texture.url})` }}></div>
                                        ) : texture.url === "upload" ? (
                                            <div className="w-8 h-8 mr-2 bg-blue-600 rounded flex items-center justify-center">
                                                <MdFileUpload className="text-white" />
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 mr-2 bg-gray-600 rounded flex items-center justify-center">
                                                <MdImage className="text-gray-400" />
                                            </div>
                                        )}
                                        <span>{texture.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {uploadedPlanetTexture && planetTexture === uploadedPlanetTexture && (
                        <div className="flex items-center mt-2 p-2 bg-blue-900/30 rounded-lg">
                            <div className="w-8 h-8 mr-2 bg-cover rounded" style={{ backgroundImage: `url(${uploadedPlanetTexture})` }}></div>
                            <div className="flex-1 truncate text-sm">Uploaded image will be used as texture</div>
                            <button 
                                onClick={triggerPlanetFileUpload}
                                className="ml-2 p-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs"
                            >
                                Change
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex flex-col space-y-2">
                    <label className="font-medium text-gray-200">Moon Texture</label>
                    <div className="relative">
                        <div
                            className="flex items-center justify-between p-2 bg-gray-700 rounded-lg cursor-pointer"
                            onClick={() => setShowMoonTextureOptions(!showMoonTextureOptions)}
                        >
                            <div className="flex items-center">
                                {uploadedMoonTexture && moonTexture === uploadedMoonTexture ? (
                                    <div className="w-8 h-8 mr-2 bg-cover rounded" style={{ backgroundImage: `url(${uploadedMoonTexture})` }}></div>
                                ) : (
                                    <MdImage className="mr-2 text-gray-400" />
                                )}
                                {getMoonTextureDisplayName()}
                            </div>
                            <span className="text-xs text-gray-400">▼</span>
                        </div>

                        {showMoonTextureOptions && (
                            <div className="absolute z-10 w-full mt-1 bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {moonTextures.map((texture) => (
                                    <div
                                        key={texture.name}
                                        className="flex items-center p-2 hover:bg-gray-700 cursor-pointer"
                                        onClick={() => handleMoonTextureSelect(texture.url)}
                                    >
                                        {texture.url && texture.url !== "upload" ? (
                                            <div className="w-8 h-8 mr-2 bg-cover rounded" style={{ backgroundImage: `url(${texture.url})` }}></div>
                                        ) : texture.url === "upload" ? (
                                            <div className="w-8 h-8 mr-2 bg-blue-600 rounded flex items-center justify-center">
                                                <MdFileUpload className="text-white" />
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 mr-2 bg-gray-600 rounded flex items-center justify-center">
                                                <MdImage className="text-gray-400" />
                                            </div>
                                        )}
                                        <span>{texture.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {uploadedMoonTexture && moonTexture === uploadedMoonTexture && (
                        <div className="flex items-center mt-2 p-2 bg-blue-900/30 rounded-lg">
                            <div className="w-8 h-8 mr-2 bg-cover rounded" style={{ backgroundImage: `url(${uploadedMoonTexture})` }}></div>
                            <div className="flex-1 truncate text-sm">Uploaded image will be used as texture</div>
                            <button 
                                onClick={triggerMoonFileUpload}
                                className="ml-2 p-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs"
                            >
                                Change
                            </button>
                        </div>
                    )}
                </div>

                {/* Advanced Texture Options */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="planetAtmosphere"
                            checked={planetAtmosphere}
                            onChange={(e) => setPlanetAtmosphere(e.target.checked)}
                            className="mr-2"
                        />
                        <label htmlFor="planetAtmosphere" className="text-sm text-gray-300">Add Atmosphere</label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="planetClouds"
                            checked={!!planetCloudTexture}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setPlanetCloudTexture("/textures/earth_clouds.jpg");
                                } else {
                                    setPlanetCloudTexture("");
                                }
                            }}
                            className="mr-2"
                        />
                        <label htmlFor="planetClouds" className="text-sm text-gray-300">Add Cloud Layer</label>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
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
        </>
    )
}

export default ActionButtons