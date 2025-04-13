import React from 'react';
import { motion } from 'framer-motion';
import { StarFormProps } from '@/types/types';

const StarForm: React.FC<StarFormProps> = ({
    starColor,
    setStarColor,
    starSize,
    setStarSize,
    starDistance,
    setStarDistance,
    starSpeed,
    setStarSpeed
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            <div>
                <label className="block text-sm font-medium mb-1">Star Color</label>
                <input
                    type="color"
                    value={starColor}
                    onChange={(e) => setStarColor(e.target.value)}
                    className="w-full h-10 rounded-lg cursor-pointer"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Star Size: {starSize.toFixed(1)}</label>
                <input
                    type="range"
                    min="0.1"
                    max="0.5"
                    step="0.05"
                    value={starSize}
                    onChange={(e) => setStarSize(parseFloat(e.target.value))}
                    className="w-full accent-purple-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Star Distance: {starDistance.toFixed(1)}</label>
                <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={starDistance}
                    onChange={(e) => setStarDistance(parseFloat(e.target.value))}
                    className="w-full accent-purple-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Star Speed: {starSpeed.toFixed(3)}</label>
                <input
                    type="range"
                    min="0.001"
                    max="0.05"
                    step="0.001"
                    value={starSpeed}
                    onChange={(e) => setStarSpeed(parseFloat(e.target.value))}
                    className="w-full accent-purple-500"
                />
            </div>
        </motion.div>
    );
};

export default StarForm;