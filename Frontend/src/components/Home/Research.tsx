import { Card } from "@/components/ui/card";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const Research = () => {
  const stats = [
    { number: 5000, label: "Exoplanets Analyzed" },
    { number: 50, label: "Potential Habitable Worlds" },
    { number: 200, label: "Research Papers" },
    { number: 25, label: "Partner Institutions" },
  ];

  const researchAreas = [
    {
      title: "Atmospheric Analysis",
      description: "Studying exoplanet atmospheres using advanced spectroscopic techniques.",
    },
    {
      title: "Habitability Index",
      description: "Developing new metrics to assess potential habitability of distant worlds.",
    },
    {
      title: "Biosignature Detection",
      description: "Investigating chemical signatures that could indicate the presence of life.",
    },
  ];

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section id="research" className="relative p-8 overflow-hidden">
      <div className="mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-white to-blue-500 bg-clip-text text-transparent">
            Our Research
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mt-6">
            Exploring the boundaries of exoplanet science through innovative research.
          </p>
        </div>

        {/* Stats Section */}
        <div
          ref={ref} // Attach the ref to the stats container
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="p-8 backdrop-blur-lg bg-[rgba(14,14,21,1)] border-gray-800 
              transition-all duration-300 hover:scale-80 hover:-translate-y-2 
              shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 
              hover:border-blue-500 cursor-pointer rounded-2xl"
            >
              <div className="text-4xl font-extrabold text-blue-500 mb-3 
                group-hover:scale-110 transition-transform duration-300">
                {inView ? ( // Start counting only when in view
                  <CountUp start={0} end={stat.number} duration={2.5} separator="," />
                ) : (
                  "0"
                )}
              </div>
              <p className="text-gray-300 font-medium">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Research Areas Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {researchAreas.map((area, index) => (
            <Card
              key={index}
              className="p-8 backdrop-blur-lg bg-[rgba(14,14,21,1)] border-gray-800 
              transition-all duration-300 hover:scale-105 hover:-translate-y-2 
              shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 
              hover:border-blue-500 cursor-pointer rounded-2xl"
            >
              <h3 className="text-2xl font-bold text-white mb-4 
                group-hover:text-blue-400 transition-colors duration-300">
                {area.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">{area.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Research;
