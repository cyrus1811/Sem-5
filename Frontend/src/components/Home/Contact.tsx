import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Rocket, Send } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill out all fields');
      return;
    }

    console.log('Form submitted:', formData);

    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center p-4  overflow-hidden">
      {/* Starry background effect */}
      <div className="absolute inset-0 bg-stars opacity-30 pointer-events-none"></div>

      {/* Cosmic decorative elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-900/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-900/30 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

      <div className="relative z-10 w-full max-w-xl">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
            Explore Cosmic Frontiers
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mt-4">
            Connect with our interstellar research team
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-2xl shadow-2xl p-1">
          <Card className="bg-transparent border-none shadow-none">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-3">
                <Rocket className="w-8 h-8 text-blue-400 animate-pulse" />
                <span className="text-2xl bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                  Mission Control
                </span>
              </CardTitle>
              <CardDescription className="text-gray-400 text-sm">
                Your bridge to astronomical discoveries
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white/80">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full 
                      bg-white/10 
                      border-white/20 
                      text-white 
                      placeholder-gray-400 
                      focus:ring-2 
                      focus:ring-blue-500 
                      rounded-xl 
                      transition-all 
                      duration-300 
                      hover:bg-white/15"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/80">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full 
                      bg-white/10 
                      border-white/20 
                      text-white 
                      placeholder-gray-400 
                      focus:ring-2 
                      focus:ring-blue-500 
                      rounded-xl 
                      transition-all 
                      duration-300 
                      hover:bg-white/15"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-white/80">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Share your cosmic insights..."
                    className="min-h-[120px] 
                      bg-white/10 
                      border-white/20 
                      text-white 
                      placeholder-gray-400 
                      focus:ring-2 
                      focus:ring-blue-500 
                      rounded-xl 
                      transition-all 
                      duration-300 
                      hover:bg-white/15"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="
                    w-full 
                    py-6 
                    rounded-xl 
                    bg-gradient-to-r 
                    from-blue-600/70 
                    to-purple-600/70 
                    text-white 
                    hover:from-blue-700/80 
                    hover:to-purple-700/80 
                    transition-all 
                    duration-300 
                    flex 
                    items-center 
                    justify-center 
                    space-x-2 
                    group"
                >
                  <Send className="w-5 h-5 group-hover:animate-pulse" />
                  <span>Transmit Message</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
