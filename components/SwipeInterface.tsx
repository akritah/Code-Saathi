'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, X, MessageCircle, Settings, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Profile {
  id: number;
  name: string;
  bio: string;
  skills: string[];
  experience: string;
  goals: string[];
  matchPercentage: number;
  image: string;
}

interface SwipeInterfaceProps {
  onMatch: (profile: Profile) => void;
  onOpenMatches: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
}

// Mock profiles data
const mockProfiles: Profile[] = [
  {
    id: 1,
    name: "Riya",
    bio: "Full-stack developer passionate about AI and machine learning. Love building innovative solutions!",
    skills: ["Python", "React", "Machine Learning", "Django"],
    experience: "Intermediate",
    goals: ["Win", "Learn"],
    matchPercentage: 92,
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: 2,
    name: "Akshay",
    bio: "UI/UX designer with a knack for creating beautiful and functional interfaces. Always ready for a challenge!",
    skills: ["UI/UX", "Figma", "JavaScript", "CSS"],
    experience: "Advanced",
    goals: ["Chill", "Network"],
    matchPercentage: 87,
    image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: 3,
    name: "Aditi",
    bio: "Data scientist and ML engineer. Looking to build the next big thing in healthcare tech!",
    skills: ["Python", "TensorFlow", "Data Science", "SQL"],
    experience: "Expert",
    goals: ["Win", "Build Portfolio"],
    matchPercentage: 89,
    image: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: 4,
    name: "Aditya",
    bio: "Backend developer specializing in distributed systems. Love working on scalable solutions.",
    skills: ["Java", "Node.js", "AWS", "Docker"],
    experience: "Advanced",
    goals: ["Just Learn", "Win"],
    matchPercentage: 94,
    image: "https://www.rawpixel.com/image/18338022/young-indian-boy-student-happy-smile#eyJrZXlzIjoiaW5kaWFuIHN0dWRlbnQiLCJzb3J0ZWRLZXlzIjoiaW5kaWFuIHN0dWRlbnQifQ=="
  },
  {
    id: 5,
    name: "Ananya",
    bio: "Frontend developer with a passion for creating amazing user experiences. Flutter enthusiast!",
    skills: ["Flutter", "Dart", "React", "TypeScript"],
    experience: "Intermediate",
    goals: ["Chill", "Network"],
    matchPercentage: 85,
    image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400"
  }
];

export default function SwipeInterface({ onMatch, onOpenMatches, onOpenProfile, onLogout }: SwipeInterfaceProps) {
  const [profiles, setProfiles] = useState(mockProfiles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);

  const currentProfile = profiles[currentIndex];
  

  const handleSwipe = (direction: 'left' | 'right') => {
    setDragDirection(direction);
    
    if (direction === 'right' && currentProfile) {
      onMatch(currentProfile);
    }
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setDragDirection(null);
    }, 300);
  };

  const handleCardClick = (direction: 'left' | 'right') => {
    handleSwipe(direction);
  };

  if (currentIndex >= profiles.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">No more profiles!</h2>
          <p className="text-gray-400 mb-6">Check back later for more potential teammates</p>
          <Button 
            onClick={onOpenMatches}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
          >
            View Matches
          </Button>
        </div>
      </div>
    );
  }

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 max-w-md mx-auto">
        <Button variant="ghost" size="sm" onClick={onOpenProfile} className="text-gray-400 hover:text-white">
          <User className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold gradient-text">Code-Saathi</h1>
        <Button variant="ghost" size="sm" onClick={onOpenMatches} className="text-gray-400 hover:text-white">
          <MessageCircle className="w-5 h-5" />
        </Button>
        <Button
  onClick={onLogout}
  className="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
>
  Logout
</Button>

      </div>

      {/* Card Stack */}
      <div className="relative max-w-md mx-auto h-[600px]">
        <AnimatePresence>
          {currentProfile && (
            <motion.div
              key={currentProfile.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ 
                x: dragDirection === 'left' ? -300 : dragDirection === 'right' ? 300 : 0,
                opacity: 0,
                scale: 0.8,
                rotate: dragDirection === 'left' ? -20 : dragDirection === 'right' ? 20 : 0
              }}
              transition={{ duration: 0.3 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(event, info) => {
                const threshold = 100;
                if (info.offset.x > threshold) {
                  handleSwipe('right');
                } else if (info.offset.x < -threshold) {
                  handleSwipe('left');
                }
              }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              <Card className="h-full glass-effect border-gray-600 overflow-hidden">
                <div className="relative h-1/2">
                  <img
                    src={currentProfile.image}
                    alt={currentProfile.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-500 text-white font-bold">
                      {currentProfile.matchPercentage}% Match
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6 h-1/2 overflow-y-auto">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                        {currentProfile.name}
                      </h2>
                      <Badge variant="outline" className="border-cyan-400 text-cyan-400">
                        {currentProfile.experience}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-300 text-sm">{currentProfile.bio}</p>
                    
                    <div>
                      <h3 className="text-cyan-400 font-medium mb-2 text-sm">Skills</h3>
                      <div className="flex flex-wrap gap-1">
                        {currentProfile.skills.map(skill => (
                          <Badge key={skill} className="skill-tag text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-blue-400 font-medium mb-2 text-sm">Goals</h3>
                      <div className="flex flex-wrap gap-1">
                        {currentProfile.goals.map(goal => (
                          <Badge key={goal} variant="outline" className="border-blue-400 text-blue-400 text-xs">
                            {goal}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-6 mt-6">
        <Button
          onClick={() => handleCardClick('left')}
          className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg"
          disabled={!currentProfile}
        >
          <X className="w-6 h-6" />
        </Button>
        
        <Button
          onClick={() => handleCardClick('right')}
          className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg"
          disabled={!currentProfile}
        >
          <Heart className="w-6 h-6" />
        </Button>
      </div>

      {/* Swipe Instructions */}
      <div className="text-center mt-6">
        <p className="text-gray-400 text-sm">
          Swipe right to match • Swipe left to pass
        </p>
      </div>
    </div>
  );
}