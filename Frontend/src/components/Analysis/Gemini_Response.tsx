import { PlanetData } from "@/types/types";
import { Sparkles, Star, SatelliteDish, Rocket, Flame, Skull, ChevronDown, AlertTriangle } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Gemini_Response = ({ planetData }: { planetData: PlanetData }) => {
    const [genResponse, setGenResponse] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedSection, setExpandedSection] = useState<string | null>("Key Observations");

    useEffect(() => {
        const sendData = async () => {
            try {
                setLoading(true);
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/gen-ai`, { planetData });

                // Parse the response which contains a JSON string with code blocks
                const rawResponse = response.data.planet_analysis;

                // Extract JSON content from markdown code block
                const jsonMatch = rawResponse.match(/```json\n([\s\S]*?)\n```/);

                if (jsonMatch && jsonMatch[1]) {
                    // Parse the extracted JSON string into an object
                    const parsedData = JSON.parse(jsonMatch[1]);
                    setGenResponse(parsedData);
                    console.log("Parsed data:", parsedData);
                } else {
                    setError("Could not parse the response format");
                }
            } catch (error) {
                console.error("Error fetching or parsing data:", error);
                setError("Failed to process the analysis");
            } finally {
                setLoading(false);
            }
        };

        sendData();
    }, [planetData]);

    const toggleSection = (section: string) => {
        if (expandedSection === section) {
            setExpandedSection(null);
        } else {
            setExpandedSection(section);
        }
    };

    // Determine danger level based on analysis
    const getDangerLevel = () => {
        if (!genResponse) return "unknown";

        const hasLethalGases = genResponse["Key Observations"] &&
            genResponse["Key Observations"]["Toxic and Greenhouse Gases"] &&
            genResponse["Key Observations"]["Toxic and Greenhouse Gases"].toLowerCase().includes("toxic");

        const hasHighOxygen = genResponse["Key Observations"] &&
            genResponse["Key Observations"]["Dominant Gases and Their Effects"] &&
            genResponse["Key Observations"]["Dominant Gases and Their Effects"]["Oxygen (O2)"] &&
            genResponse["Key Observations"]["Dominant Gases and Their Effects"]["Oxygen (O2)"].toLowerCase().includes("fire");

        if (hasLethalGases && hasHighOxygen) return "extreme";
        if (hasLethalGases || hasHighOxygen) return "high";

        // Check if planet is unsuitable for life
        const unsuitable = genResponse["Suitability for Life"] &&
            genResponse["Suitability for Life"]["Suitability"] &&
            genResponse["Suitability for Life"]["Suitability"].toLowerCase().includes("No");

        return unsuitable ? "moderate" : "low";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8 bg-gray-900/50 rounded-xl border border-purple-800/40 backdrop-blur-sm">
                <div className="flex flex-col items-center">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full border-4 border-purple-300/20 animate-spin"></div>
                        <div className="absolute inset-2 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                        <div className="absolute inset-4 rounded-full bg-purple-500/30 animate-pulse"></div>
                    </div>
                    <p className="mt-4 text-purple-300 font-medium">Analyzing planetary data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gradient-to-br from-red-900/30 to-red-950/40 backdrop-blur-sm border border-red-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                    <div className="bg-red-500/20 p-3 rounded-full">
                        <AlertTriangle className="h-6 w-6 text-red-400" />
                    </div>
                    <h4 className="text-xl font-bold text-red-300 ml-3">Analysis Failed</h4>
                </div>
                <p className="text-gray-300">{error}</p>
                <button className="mt-4 px-4 py-2 bg-red-800/30 hover:bg-red-700/40 text-red-300 rounded-lg transition-colors duration-200">
                    Retry Analysis
                </button>
            </div>
        );
    }

    // Get danger level styling
    const dangerLevel = getDangerLevel();
    const dangerStyles = {
        unknown: "bg-gray-800/50 border-gray-700",
        low: "bg-gradient-to-br from-green-900/20 to-green-950/30 border-green-800/60",
        moderate: "bg-gradient-to-br from-yellow-900/20 to-yellow-950/30 border-yellow-800/60",
        high: "bg-gradient-to-br from-orange-900/20 to-orange-950/30 border-orange-800/60",
        extreme: "bg-gradient-to-br from-red-900/20 to-red-950/30 border-red-800/60"
    };

    return (
        <div className="space-y-6">
            {genResponse ? (
                <>
                    {/* Dashboard Header with Danger Level */}
                    <div className={`p-6 rounded-xl shadow-lg backdrop-blur-sm border ${dangerStyles[dangerLevel]}`}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
                                Planet Analysis
                            </h3>
                            <div className={`px-4 py-1 rounded-full text-sm font-bold
                                ${dangerLevel === 'extreme' ? 'bg-red-900/50 text-red-200 border border-red-700 animate-pulse' : ''}
                                ${dangerLevel === 'high' ? 'bg-orange-900/50 text-orange-200 border border-orange-700' : ''}
                                ${dangerLevel === 'moderate' ? 'bg-yellow-900/50 text-yellow-200 border border-yellow-700' : ''}
                                ${dangerLevel === 'low' ? 'bg-green-900/50 text-green-200 border border-green-700' : ''}
                                ${dangerLevel === 'unknown' ? 'bg-gray-800/50 text-gray-300 border border-gray-700' : ''}
                            `}>
                                {dangerLevel.toUpperCase()} RISK
                            </div>
                        </div>

                        {/* Grid layout for top-level summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {/* Dominant Gas */}
                            {genResponse["Key Observations"] && genResponse["Key Observations"]["Dominant Gases and Their Effects"] && (
                                <div className="bg-gray-800/60 rounded-lg p-4 backdrop-blur-sm border border-gray-700/50 hover:border-purple-700/50 transition-colors">
                                    <div className="flex items-center mb-2">
                                        <div className="bg-purple-900/30 p-2 rounded-lg">
                                            <Sparkles className="h-5 w-5 text-purple-400" />
                                        </div>
                                        <h5 className="ml-2 text-purple-300 font-bold">Dominant Gas</h5>
                                    </div>
                                    <p className="text-gray-200 font-medium">
                                        {Object.keys(genResponse["Key Observations"]["Dominant Gases and Their Effects"])[0]?.split(" ")[0]}
                                    </p>
                                </div>
                            )}

                            {/* Life Suitability */}
                            {genResponse["Suitability for Life"] && (
                                <div className="bg-gray-800/60 rounded-lg p-4 backdrop-blur-sm border border-gray-700/50 hover:border-green-700/50 transition-colors">
                                    <div className="flex items-center mb-2">
                                        <div className="bg-green-900/30 p-2 rounded-lg">
                                            <Rocket className="h-5 w-5 text-green-400" />
                                        </div>
                                        <h5 className="ml-2 text-green-300 font-bold">Life Support</h5>
                                    </div>
                                    <p className={`font-medium ${genResponse["Suitability for Life"]["Suitability"]?.toLowerCase().includes("no") ? "text-red-300" : "text-green-300"}`}>
                                        {genResponse["Suitability for Life"]["Suitability"]?.includes("No") ? "Unsuitable" : "Suitable"}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Alert Boxes for Dangers */}
                        <div className="space-y-4">
                            {/* Check for toxic gases to display Toxicity Warning */}
                            {genResponse["Key Observations"] &&
                                genResponse["Key Observations"]["Toxic and Greenhouse Gases"] &&
                                genResponse["Key Observations"]["Toxic and Greenhouse Gases"].toLowerCase().includes("toxic") && (
                                    <div className="bg-gradient-to-r from-red-900/30 to-red-950/30 rounded-lg p-4 border-l-4 border-red-600 backdrop-blur-sm">
                                        <div className="flex items-center">
                                            <div className="p-2 rounded-full bg-red-800/40">
                                                <Skull className="h-5 w-5 text-red-400" />
                                            </div>
                                            <div className="ml-3">
                                                <h5 className="text-red-300 font-bold">Lethal Atmosphere</h5>
                                                <p className="text-gray-300 text-sm mt-1">
                                                    This planet contains toxic atmospheric components that would be lethal without protective equipment.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            {/* Check for high oxygen to display Fire Risk */}
                            {genResponse["Key Observations"] &&
                                genResponse["Key Observations"]["Dominant Gases and Their Effects"] &&
                                genResponse["Key Observations"]["Dominant Gases and Their Effects"]["Oxygen (O2)"] &&
                                genResponse["Key Observations"]["Dominant Gases and Their Effects"]["Oxygen (O2)"].toLowerCase().includes("fire") && (
                                    <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-lg p-4 border-l-4 border-orange-600 backdrop-blur-sm">
                                        <div className="flex items-center">
                                            <div className="p-2 rounded-full bg-orange-800/40">
                                                <Flame className="h-5 w-5 text-orange-400" />
                                            </div>
                                            <div className="ml-3">
                                                <h5 className="text-orange-300 font-bold">Extreme Fire Hazard</h5>
                                                <p className="text-gray-300 text-sm mt-1">
                                                    The high oxygen concentration creates severe fire risk. Any ignition source could cause rapid combustion.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>

                    {/* Key Observations Section */}
                    {genResponse["Key Observations"] && (
                        <div className="bg-gradient-to-br from-gray-900/70 to-black/60 rounded-3xl border border-yellow-900/20 overflow-hidden backdrop-blur-sm shadow-xl mb-6">
                            <button
                                className="w-full flex justify-between items-center p-4 text-left transition-colors"
                                onClick={() => toggleSection("Key Observations")}
                            >
                                <div className="flex items-center">
                                    <div className="bg-yellow-900/40 p-2 rounded-lg shadow-inner">
                                        <Star className="h-5 w-5 text-yellow-300" />
                                    </div>
                                    <h4 className="ml-3 text-lg font-bold text-yellow-200">Atmospheric Analysis</h4>
                                </div>
                                <motion.div
                                    animate={{ rotate: expandedSection === "Key Observations" ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ChevronDown className="h-5 w-5 text-yellow-400/70" />
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {expandedSection === "Key Observations" && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-5 bg-black/30 border-t border-yellow-900/20">
                                            {/* Atmospheric Composition Analysis */}
                                            {genResponse["Key Observations"]["Atmospheric Composition Analysis"] && (
                                                <div className="mb-6 bg-yellow-950/10 p-4 rounded-lg border border-yellow-900/20">
                                                    <h6 className="text-yellow-200 font-bold mb-2">Atmospheric Composition</h6>
                                                    <p className="text-gray-300 text-sm">{genResponse["Key Observations"]["Atmospheric Composition Analysis"]}</p>
                                                </div>
                                            )}

                                            {/* Dominant Gases */}
                                            {genResponse["Key Observations"]["Dominant Gases and Their Effects"] && (
                                                <div className="mb-6">
                                                    <h6 className="text-yellow-200 font-bold mb-3">Dominant Gases and Their Effects</h6>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {Object.entries(genResponse["Key Observations"]["Dominant Gases and Their Effects"]).map(
                                                            ([gas, effect], index) => (
                                                                <motion.div
                                                                    key={index}
                                                                    initial={{ opacity: 0, y: 10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    transition={{ delay: index * 0.1 }}
                                                                    className="bg-yellow-950/10 rounded-lg p-4 border border-yellow-900/30 hover:border-yellow-700/60 hover:bg-yellow-950/20 transition-all"
                                                                >
                                                                    <h6 className="font-bold text-yellow-100 mb-1">{gas}</h6>
                                                                    <p className="text-gray-300 text-sm">{String(effect)}</p>
                                                                </motion.div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Greenhouse and Toxic Gas Considerations */}
                                            {genResponse["Key Observations"]["Toxic and Greenhouse Gases"] && (
                                                <div className="bg-yellow-950/10 p-4 rounded-lg border border-yellow-900/20">
                                                    <h6 className="text-yellow-200 font-bold mb-2">Greenhouse and Toxic Gas Considerations</h6>
                                                    <p className="text-gray-300 text-sm">{genResponse["Key Observations"]["Toxic and Greenhouse Gases"]}</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Planet Type Section */}
                    {genResponse["Planet Type"] && (
                        <div className="bg-gradient-to-br from-gray-900/70 to-black/60 rounded-3xl border border-blue-900/20 overflow-hidden backdrop-blur-sm shadow-xl mb-6">
                            <button
                                className="w-full flex justify-between items-center p-4 text-left transition-colors"
                                onClick={() => toggleSection("Planet Type")}
                            >
                                <div className="flex items-center">
                                    <div className="bg-blue-900/40 p-2 rounded-lg shadow-inner">
                                        <SatelliteDish className="h-5 w-5 text-blue-300" />
                                    </div>
                                    <h4 className="ml-3 text-lg font-bold text-blue-200">Planet Classification</h4>
                                </div>
                                <motion.div
                                    animate={{ rotate: expandedSection === "Planet Type" ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ChevronDown className="h-5 w-5 text-blue-400/70" />
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {expandedSection === "Planet Type" && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-5 bg-black/30 border-t border-blue-900/20">
                                            {/* Classification */}
                                            {genResponse["Planet Type"]["Classification"] && (
                                                <div className="mb-6 bg-blue-950/10 p-4 rounded-lg border border-blue-900/20">
                                                    <h6 className="text-blue-200 font-bold mb-2">Classification</h6>
                                                    <p className="text-gray-300 text-sm">{genResponse["Planet Type"]["Classification"]}</p>
                                                </div>
                                            )}

                                            {/* Comparison */}
                                            {genResponse["Planet Type"]["Comparison to Known Planets"] && (
                                                <div className="bg-blue-950/10 p-4 rounded-lg border border-blue-900/20">
                                                    <h6 className="text-blue-200 font-bold mb-2">Comparison to Known Planets</h6>
                                                    <p className="text-gray-300 text-sm">{genResponse["Planet Type"]["Comparison to Known Planets"]}</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Suitability for Life Section */}
                    {genResponse["Suitability for Life"] && (
                        <div className="bg-gradient-to-br from-gray-900/70 to-black/60 rounded-3xl border border-green-900/20 overflow-hidden backdrop-blur-sm shadow-xl">
                            <button
                                className="w-full flex justify-between items-center p-4 text-left transition-colors"
                                onClick={() => toggleSection("Suitability")}
                            >
                                <div className="flex items-center">
                                    <div className="bg-green-900/40 p-2 rounded-lg shadow-inner">
                                        <Rocket className="h-5 w-5 text-green-300" />
                                    </div>
                                    <h4 className="ml-3 text-lg font-bold text-green-200">Habitability Assessment</h4>
                                </div>
                                <motion.div
                                    animate={{ rotate: expandedSection === "Suitability" ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ChevronDown className="h-5 w-5 text-green-400/70" />
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {expandedSection === "Suitability" && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-5 bg-black/30 border-t border-green-900/20">
                                            {/* Assessment */}
                                            {genResponse["Suitability for Life"]["Suitability"] && (
                                                <div className="mb-6 bg-green-950/10 p-4 rounded-lg border border-green-900/20">
                                                    <h6 className="text-green-200 font-bold mb-2">Assessment</h6>
                                                    <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-2 shadow-lg
                                    ${genResponse["Suitability for Life"]["Suitability"].toLowerCase().includes("not")
                                                            ? "bg-red-900/50 text-red-200 border border-red-700/60"
                                                            : "bg-green-900/50 text-green-200 border border-green-700/60"}`}>
                                                        {genResponse["Suitability for Life"]["Suitability"]}
                                                    </div>

                                                    {/* Add a visual indicator based on suitability */}
                                                    <motion.div
                                                        className="mt-3 h-2 rounded-full bg-gray-800"
                                                        initial={{ width: 0 }}
                                                        animate={{
                                                            width: '100%',
                                                            backgroundColor: genResponse["Suitability for Life"]["Suitability"].toLowerCase().includes("not")
                                                                ? ['#7f1d1d', '#b91c1c', '#7f1d1d']
                                                                : ['#064e3b', '#059669', '#064e3b']
                                                        }}
                                                        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                                                    />
                                                </div>
                                            )}

                                            {/* Explanation */}
                                            {genResponse["Suitability for Life"]["Explanation"] && (
                                                <div className="bg-green-950/10 p-4 rounded-lg border border-green-900/20">
                                                    <h6 className="text-green-200 font-bold mb-2">Detailed Explanation</h6>
                                                    <p className="text-gray-300 text-sm">{genResponse["Suitability for Life"]["Explanation"]}</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </>
            ) : (
                <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6 text-center backdrop-blur-sm">
                    <SatelliteDish className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400">No planetary analysis data available.</p>
                </div>
            )}
        </div>
    );
};

export default Gemini_Response;