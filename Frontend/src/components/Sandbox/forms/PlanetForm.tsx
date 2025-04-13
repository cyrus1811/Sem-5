import React from 'react';
import { motion } from 'framer-motion';
import { PlanetFormProps } from '@/types/types';

const PlanetForm: React.FC<PlanetFormProps> = ({
    planetColor,
    setPlanetColor,
    planetSize,
    setPlanetSize,
    planetDistance,
    setPlanetDistance,
    planetSpeed,
    setPlanetSpeed
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            <div>
                <label className="block text-sm font-medium mb-1">Color</label>
                <input
                    type="color"
                    value={planetColor}
                    onChange={(e) => setPlanetColor(e.target.value)}
                    className="w-full h-10 rounded-lg cursor-pointer"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Size: {planetSize.toFixed(1)}</label>
                <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={planetSize}
                    onChange={(e) => setPlanetSize(parseFloat(e.target.value))}
                    className="w-full accent-purple-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Distance: {planetDistance.toFixed(1)}</label>
                <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.1"
                    value={planetDistance}
                    onChange={(e) => setPlanetDistance(parseFloat(e.target.value))}
                    className="w-full accent-purple-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Speed: {planetSpeed.toFixed(3)}</label>
                <input
                    type="range"
                    min="0.001"
                    max="0.05"
                    step="0.001"
                    value={planetSpeed}
                    onChange={(e) => setPlanetSpeed(parseFloat(e.target.value))}
                    className="w-full accent-purple-500"
                />
            </div>
        </motion.div>
    );
};

export default PlanetForm;