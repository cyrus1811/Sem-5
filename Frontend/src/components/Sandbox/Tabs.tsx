import { motion } from "framer-motion";
import { BiPlanet, BiMoon, BiStar } from "react-icons/bi";
import { GiRingedPlanet } from "react-icons/gi";
import { TabsProps } from "@/types/types";

const Tabs = ({activeTab, setActiveTab}: TabsProps) => {
    return (
        <div className="flex mb-4 border-b border-gray-700">
            <motion.button
                className={`flex items-center px-4 py-2 ${activeTab === "planet" ? "text-purple-400 border-b-2 border-purple-400" : "text-gray-400"}`}
                onClick={() => setActiveTab("planet")}
                whileHover={{ y: -2 }}
            >
                <BiPlanet className="mr-1" />
                Planet
            </motion.button>
            <motion.button
                className={`flex items-center px-4 py-2 ${activeTab === "moon" ? "text-purple-400 border-b-2 border-purple-400" : "text-gray-400"}`}
                onClick={() => setActiveTab("moon")}
                whileHover={{ y: -2 }}
            >
                <BiMoon className="mr-1" />
                Moon
            </motion.button>
            <motion.button
                className={`flex items-center px-4 py-2 ${activeTab === "star" ? "text-purple-400 border-b-2 border-purple-400" : "text-gray-400"}`}
                onClick={() => setActiveTab("star")}
                whileHover={{ y: -2 }}
            >
                <BiStar className="mr-1" />
                Star
            </motion.button>
            <motion.button
                className={`flex items-center px-4 py-2 ${activeTab === "ring" ? "text-purple-400 border-b-2 border-purple-400" : "text-gray-400"}`}
                onClick={() => setActiveTab("ring")}
                whileHover={{ y: -2 }}
            >
                <GiRingedPlanet className="mr-1" />
                Rings
            </motion.button>
        </div>
    )
}

export default Tabs