import { PlanetData } from "@/types/types";
import { Sparkles, Star, SatelliteDish, Rocket, Flame, Skull } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

const Gemini_Response = ({ planetData }: { planetData: PlanetData }) => {
    const [genResponse, setGenResponse] = useState<string | null>(null);

    useEffect(() => {
        const sendData = async () => {
            try {
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/gen-ai`, { planetData });
                setGenResponse(response.data.planet_analysis);
                console.log("Response from server:", response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        sendData();
    }, [planetData]);

    console.log(genResponse);

    return (
        <div className="max-w-3xl mx-auto p-6 bg-gray-900 shadow-lg rounded-lg border border-gray-700">
            <div className="flex items-center mb-4">
                <Sparkles className="h-6 w-6 text-purple-400 mr-2" />
                <h4 className="text-xl font-semibold text-purple-300">Exoplanet Analysis</h4>
            </div>

            {genResponse ? (
                <div className="space-y-6">
                    {/* Key Observations */}
                    {genResponse?.key_observations && (
                        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                            <div className="flex items-center mb-2">
                                <Star className="h-5 w-5 text-yellow-400 mr-2" />
                                <h5 className="text-yellow-300 font-medium">Key Observations</h5>
                            </div>
                            <ReactMarkdown className="text-gray-300">{genResponse.key_observations}</ReactMarkdown>
                        </div>
                    )}

                    {/* Planet Type */}
                    {genResponse?.planet_type && (
                        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                            <div className="flex items-center mb-2">
                                <SatelliteDish className="h-5 w-5 text-green-400 mr-2" />
                                <h5 className="text-green-300 font-medium">Planet Type</h5>
                            </div>
                            <ReactMarkdown className="text-gray-300">{genResponse.planet_type}</ReactMarkdown>
                        </div>
                    )}

                    {/* Suitability for Life */}
                    {genResponse?.habitability && (
                        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                            <div className="flex items-center mb-2">
                                <Rocket className="h-5 w-5 text-blue-400 mr-2" />
                                <h5 className="text-blue-300 font-medium">Suitability for Life</h5>
                            </div>
                            <ReactMarkdown className="text-gray-300">{genResponse.habitability}</ReactMarkdown>
                        </div>
                    )}

                    {/* Fire Risk Alert */}
                    {genResponse?.fire_risk && (
                        <div className="p-4 bg-gray-800 rounded-lg border border-red-700">
                            <div className="flex items-center mb-2">
                                <Flame className="h-5 w-5 text-red-500 mr-2" />
                                <h5 className="text-red-400 font-medium">🔥 Fire Risk Alert</h5>
                            </div>
                            <ReactMarkdown className="text-red-300">{genResponse.fire_risk}</ReactMarkdown>
                        </div>
                    )}

                    {/* Toxicity Alert */}
                    {genResponse?.toxicity && (
                        <div className="p-4 bg-gray-800 rounded-lg border border-red-700">
                            <div className="flex items-center mb-2">
                                <Skull className="h-5 w-5 text-red-500 mr-2" />
                                <h5 className="text-red-400 font-medium">☠️ Toxicity Warning</h5>
                            </div>
                            <ReactMarkdown className="text-red-300">{genResponse.toxicity}</ReactMarkdown>
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-gray-400">Loading response...</p>
            )}
        </div>
    );
};

export default Gemini_Response;
