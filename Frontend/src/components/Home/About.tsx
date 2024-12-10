import { Globe, Moon, SunMedium } from "lucide-react";
import { Card } from "../ui/card";

const About = () => {

  const features = [
    {
      icon: (
        <Globe className="w-12 h-12 text-blue-500" />
      ),
      title: "Advanced AI Analysis",
      description: "Utilizing machine learning algorithms to process vast amounts of astronomical data."
    },
    {
      icon: (
        <Moon className="w-12 h-12 text-blue-500" />
      ),
      title: "Atmospheric Composition",
      description: "Analyzing chemical signatures to detect potential biosignatures."
    },
    {
      icon: (
        <SunMedium className="w-12 h-12 text-blue-500" />
      ),
      title: "Solar Analysis",
      description: "Evaluating stellar characteristics to determine habitable zones."
    }
  ];

  return (
    <section id="about" className="p-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-white to-blue-500 bg-clip-text text-transparent">
          Exploring New Frontiers
        </h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto mt-6">
          Discover how we're using cutting-edge technology to identify
          potentially habitable worlds beyond our solar system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
        {features.map((feature, index) => (
          <Card 
            key={index}
            className="p-8 backdrop-blur-lg bg-[rgba(14,14,21,1)] border-gray-800 
            transition-all duration-300 hover:scale-105 hover:-translate-y-2 
            shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 
            hover:border-blue-500 cursor-pointer rounded-2xl"
          >
            <div className="flex flex-col items-start">
              <div className="transform transition-transform group-hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mt-6 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-400">
                {feature.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default About;
