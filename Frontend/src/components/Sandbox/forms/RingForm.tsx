import React from 'react';
import { motion } from 'framer-motion';
import { RingFormProps } from '@/types/types';

const RingForm: React.FC<RingFormProps> = ({
    hasRings,
    setHasRings,
    ringColor,
    setRingColor,
    ringSize,
    setRingSize,
    ringInnerRadius,
    setRingInnerRadius,
    ringOuterRadius,
    setRingOuterRadius
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            <div className="flex items-center">
                <input
                    type="checkbox"
                    checked={hasRings}
                    onChange={(e) => setHasRings(e.target.checked)}
                    className="w-5 h-5 mr-2 accent-purple-500"
                />
                <label className="text-sm font-medium">Enable Rings</label>
            </div>

            {hasRings && (
                <>
                    <div>
                        <label className="block text-sm font-medium mb-1">Ring Color</label>
                        <input
                            type="color"
                            value={ringColor}
                            onChange={(e) => setRingColor(e.target.value)}
                            className="w-full h-10 rounded-lg cursor-pointer"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Ring Size: {ringSize.toFixed(2)}</label>
                        <input
                            type="range"
                            min="0.01"
                            max="0.2"
                            step="0.01"
                            value={ringSize}
                            onChange={(e) => setRingSize(parseFloat(e.target.value))}
                            className="w-full accent-purple-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Inner Radius: {ringInnerRadius.toFixed(1)}</label>
                        <input
                            type="range"
                            min="1.5"
                            max={ringOuterRadius - 0.5}
                            step="0.1"
                            value={ringInnerRadius}
                            onChange={(e) => setRingInnerRadius(parseFloat(e.target.value))}
                            className="w-full accent-purple-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Outer Radius: {ringOuterRadius.toFixed(1)}</label>
                        <input
                            type="range"
                            min={ringInnerRadius + 0.5}
                            max="5"
                            step="0.1"
                            value={ringOuterRadius}
                            onChange={(e) => setRingOuterRadius(parseFloat(e.target.value))}
                            className="w-full accent-purple-500"
                        />
                    </div>
                </>
            )}
        </motion.div>
    );
};

export default RingForm;