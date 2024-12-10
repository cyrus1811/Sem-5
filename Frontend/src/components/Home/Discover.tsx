import { useRef } from "react";
import { Card } from "@/components/ui/card";

const Discover = () => {
  const timelineRef = useRef(null);

  const discoveries = [
    {
      year: "2024",
      title: "Kepler-442b Analysis",
      description: "New atmospheric data suggests potential for liquid water on the surface."
    },
    {
      year: "2023",
      title: "TRAPPIST-1 System Update",
      description: "Detailed analysis of the seven Earth-sized planets reveals promising habitability indicators."
    },
    {
      year: "2023",
      title: "Proxima Centauri b",
      description: "Advanced spectrographic analysis indicates possible atmospheric composition."
    }
  ];

  return (
    <section id="discover" className="p-20 px-4 relative overflow-hidden">
      <div className="relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-white to-blue-500 bg-clip-text text-transparent">
            Latest Discoveries
          </h2>
          <p className="text-lg text-gray-400 max-w-xl mx-auto mt-6">
            Explore our most recent findings in the search for habitable exoplanets.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative px-4" ref={timelineRef}>
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-500/20" />

          <div className="relative">
            {discoveries.map((discovery, index) => (
              <div
                key={index}
                className={`timeline-item opacity-0 translate-y-5 transition-all duration-700 ease-out 
                  mb-16 flex ${index % 2 === 0 ? "justify-end md:mr-[50%]" : "justify-start md:ml-[50%]"}`}
              >
                <Card
                  className={`relative w-full md:w-[85%] p-6 bg-[rgb(14,14,21,1)] transition-all duration-300 
                    backdrop-blur-xl border-gray-800 hover:scale-80 hover:-translate-y-2 shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 hover:border-blue-500 cursor-pointer
                    ${index % 2 === 0 ? "mr-6" : "ml-6"}`}
                >
                  {/* Timeline dot */}
                  <div className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 
                    bg-blue-500 rounded-full z-10
                    ${index % 2 === 0 ? "right-[-34px]" : "left-[-34px]"}`}>
                    <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-25" />
                  </div>

                  <div className="text-blue-500 font-semibold mb-2">{discovery.year}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{discovery.title}</h3>
                  <p className="text-gray-400">{discovery.description}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Discover;
