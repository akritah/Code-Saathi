'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MessageCircle } from 'lucide-react';

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

interface MatchesScreenProps {
  matches: Profile[];
  onBack: () => void;
  onStartChat: (profile: Profile) => void;
}

export default function MatchesScreen({ matches, onBack, onStartChat }: MatchesScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="text-gray-400 hover:text-white mr-4"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-white">Matched</h1>
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💫</div>
            <h2 className="text-xl font-semibold text-white mb-2">No matches yet</h2>
            <p className="text-gray-400">Keep swiping to find your perfect teammate!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <Card key={match.id} className="glass-effect border-gray-600">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={match.image}
                      alt={match.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white truncate">
                          {match.name}
                        </h3>
                        <Badge className="bg-green-500 text-white text-xs">
                          {match.matchPercentage}%
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {match.skills.slice(0, 3).map(skill => (
                          <Badge key={skill} className="skill-tag text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {match.skills.length > 3 && (
                          <Badge variant="outline" className="border-gray-500 text-gray-400 text-xs">
                            +{match.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                      
                      <Button
                        onClick={() => onStartChat(match)}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-sm"
                        size="sm"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Start Chat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}