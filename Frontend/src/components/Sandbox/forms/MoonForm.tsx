import React from 'react';
import { motion } from 'framer-motion';
import { MoonFormProps } from '@/types/types';

const MoonForm: React.FC<MoonFormProps> = ({
    moonColor,
    setMoonColor,
    moonSize,
    setMoonSize,
    moonDistance,
    setMoonDistance,
    moonSpeed,
    setMoonSpeed
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            <div>
                <label className="block text-sm font-medium mb-1">Moon Color</label>
                <input
                    type="color"
                    value={moonColor}
                    onChange={(e) => setMoonColor(e.target.value)}
                    className="w-full h-10 rounded-lg cursor-pointer"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Moon Size: {moonSize.toFixed(1)}</label>
                <input
                    type="range"
                    min="0.05"
                    max="0.5"
                    step="0.05"
                    value={moonSize}
                    onChange={(e) => setMoonSize(parseFloat(e.target.value))}
                    className="w-full accent-purple-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Moon Distance: {moonDistance.toFixed(1)}</label>
                <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={moonDistance}
                    onChange={(e) => setMoonDistance(parseFloat(e.target.value))}
                    className="w-full accent-purple-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Moon Speed: {moonSpeed.toFixed(3)}</label>
                <input
                    type="range"
                    min="0.001"
                    max="0.05"
                    step="0.001"
                    value={moonSpeed}
                    onChange={(e) => setMoonSpeed(parseFloat(e.target.value))}
                    className="w-full accent-purple-500"
                />
            </div>
        </motion.div>
    );
};

export default MoonForm;