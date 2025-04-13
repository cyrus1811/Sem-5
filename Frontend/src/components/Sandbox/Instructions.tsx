import { motion } from 'framer-motion'

const Instructions = () => {
    return (
        <motion.div
            className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-purple-900/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
        >
            <h4 className="font-bold text-purple-400 mb-2">PRO TIPS:</h4>
            <ul className="text-sm space-y-2 text-gray-300">
                <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    Click planets to edit their properties
                </li>
                <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    Use tabs to customize different aspects
                </li>
                <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    Add asteroids to simulate impacts
                </li>
                <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    Drag to rotate, scroll to zoom
                </li>
            </ul>
        </motion.div>
    )
}

export default Instructions;