import { useRef, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { NewsApiResponse, NewsArticle } from "@/types/types";
import axios from "axios";

const Discover = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/news`);
        
        if (!response.data.ok) {
          throw new Error('Failed to fetch news');
        }
        
        const data: NewsApiResponse = await response.data.json();
        
        // Check if we have articles in the response
        if (!data.articles || !Array.isArray(data.articles) || data.articles.length === 0) {
          throw new Error('No articles found in the response');
        }
        
        console.log("Fetched news data:", data); // Debug log
        
        // Format the articles to match our component structure
        const formattedArticles: NewsArticle[] = data.articles.slice(0, 5).map(article => ({
          year: new Date(article.publishedAt).toLocaleDateString(),
          title: article.title,
          description: article.description || "No description available",
          url: article.url
        }));
        
        console.log("Formatted articles:", formattedArticles); // Debug log
        setNewsArticles(formattedArticles);
      } catch (err) {
        console.error("Error fetching news:", err); // Debug log
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        // Fallback to sample data in case of error
        setNewsArticles([
          {
            year: "2025",
            title: "SpaceX Crew-10 folds traits, hopes into origami crane zero-g indicator",
            description: "What do you get when you fold together the ambitions and contributions of four space station-bound astronauts from the United States, Japan and Russia? A zero-gravity indicator in the form of a crocheted origami crane named \"Droog.\""
          },
          {
            year: "2025",
            title: "Moon turns 'bloody': Watch epic lunar lander footage of last night's total eclipse",
            description: "While millions of Earthlings watched the \"blood moon\" total lunar eclipse on March 13-14, the private Blue Ghost spacecraft caught an ultra-rare view of Earth blocking out the sun from the surface of the moon."
          },
          {
            year: "2024",
            title: "'Poppy seeds' and 'leopard spots' on Mars could hint at ancient microbial life",
            description: "A rock on Mars that may hold clues about ancient microbial life on the Red Planet continues to puzzle scientists."
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Set up intersection observer in a separate useEffect to ensure it runs after articles are loaded
  useEffect(() => {
    if (loading || newsArticles.length === 0) return;

    // Observer for animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Make sure to actually add the classes that make the items visible
            entry.target.classList.remove('opacity-0', 'translate-y-5');
            entry.target.classList.add('opacity-100', 'translate-y-0');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );

    // Use a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const timelineItems = document.querySelectorAll('.timeline-item');
      console.log("Found timeline items:", timelineItems.length);
      timelineItems.forEach(item => observer.observe(item));
    }, 300);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [loading, newsArticles]);

  return (
    <section id="discover" className="p-4 md:p-20 relative overflow-hidden">
      <div className="relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-white to-blue-500 bg-clip-text text-transparent">
            Latest Space News
          </h2>
          <p className="text-lg text-gray-400 max-w-xl mx-auto mt-6">
            Stay updated with the latest discoveries and breakthroughs in space exploration.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            <p>Error loading news: {error}</p>
          </div>
        ) : newsArticles.length === 0 ? (
          <div className="text-center text-gray-400">
            <p>No news articles found.</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto relative px-4" ref={timelineRef}>
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-500/20" />

            <div className="relative">
              {newsArticles.map((article, index) => (
                <div
                  key={index}
                  className={`timeline-item opacity-0 translate-y-5 transition-all duration-700 ease-out
                  mb-16 flex ${index % 2 === 0 ? "justify-end md:mr-[50%]" : "justify-start md:ml-[50%]"}`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <Card
                    className={`relative w-full md:w-[85%] p-6 bg-[rgb(14,14,21,1)] transition-all duration-300
                    backdrop-blur-xl border-gray-800 hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 hover:border-blue-500 cursor-pointer
                    ${index % 2 === 0 ? "mr-6" : "ml-6"}`}
                    onClick={() => article.url && window.open(article.url, '_blank')}
                  >
                    {/* Timeline dot */}
                    <div className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4
                    bg-blue-500 rounded-full z-10
                    ${index % 2 === 0 ? "right-[-34px]" : "left-[-34px]"}`}>
                      <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-25" />
                    </div>

                    <div className="text-blue-500 font-semibold mb-2">{article.year}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{article.title}</h3>
                    <p className="text-gray-400">{article.description}</p>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Discover;