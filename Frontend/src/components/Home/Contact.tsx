// @ts-nocheck

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Rocket } from 'lucide-react';

const ContactForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <section className="relative p-8 overflow-hidden mt-4">
      <div className="max-w-2xl mx-auto text-center mb-10">
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-white to-blue-500 bg-clip-text text-transparent">
            Our Research
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mt-6">
            Exploring the boundaries of exoplanet science through innovative research.
          </p>
      </div>

      <Card className="max-w-xl mx-auto rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <Rocket className="w-6 h-6" />
            <span className="text-xl">Contact Us</span>
          </CardTitle>
          <CardDescription className="text-center text-md">
            Send us a message and join our space exploration journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Share your thoughts with us..."
                className="min-h-[120px]"
                required
              />
            </div>

            <Button type="submit" className="px-8 w-full py-6 rounded-xl font-bold border-white/20 text-white/90 hover:bg-white/10 transition-all duration-300">
              <Rocket className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default ContactForm;