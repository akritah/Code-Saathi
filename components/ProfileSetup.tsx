'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';


interface ProfileSetupProps {
  onComplete: () => void;
  onBack: () => void;
}

const skillCategories = {
  'Programming': ['Python', 'JavaScript', 'Java', 'C++', 'React', 'Node.js', 'Django', 'Flutter'],
  'Design': ['UI/UX', 'Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Sketch'],
  'Data': ['Machine Learning', 'Data Science', 'SQL', 'TensorFlow', 'PyTorch', 'Analytics'],
  'Other': ['Project Management', 'DevOps', 'AWS', 'Docker', 'Git', 'Blockchain']
};

const goals = ['Chill', 'Win', 'Just Learn', 'Network', 'Build Portfolio'];

export default function ProfileSetup({ onComplete, onBack }: ProfileSetupProps) {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [experience, setExperience] = useState('');
  const [customSkill, setCustomSkill] = useState('');

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleGoalToggle = (goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const addCustomSkill = () => {
    if (customSkill && !selectedSkills.includes(customSkill)) {
      setSelectedSkills(prev => [...prev, customSkill]);
      setCustomSkill('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault(); // prevent form refresh
    console.log("🚀 handleSubmit called");

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    console.error("User not found:", userError);
    return;
  }

  const user = userData.user;
    console.log("👤 User ID:", user.id);

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    username: name,            // 👈 match your DB schema column
    bio,
    skills: selectedSkills,
                    
  });

  if (error) {
    console.error("❌ Supabase insert error:", error);
  } else {
    console.log("✅ Profile saved!");
    onComplete(); // move to swipe screen
  }
};




  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="text-gray-400 hover:text-white mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-white">Create Profile</h1>
        </div>

        <Card className="glass-effect border-gray-600">
          <CardHeader>
            <CardTitle className="text-white text-center">Tell us about yourself</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name *
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-slate-800 border-gray-600 text-white"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bio
                  </label>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="bg-slate-800 border-gray-600 text-white"
                    placeholder="Tell others about yourself..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full bg-slate-800 border border-gray-600 rounded-md px-3 py-2 text-white"
                    required
                  >
                    <option value="">Select experience</option>
                    <option value="Beginner">Beginner (0-1 years)</option>
                    <option value="Intermediate">Intermediate (1-3 years)</option>
                    <option value="Advanced">Advanced (3-5 years)</option>
                    <option value="Expert">Expert (5+ years)</option>
                  </select>
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Skills *
                </label>
                
                {Object.entries(skillCategories).map(([category, skills]) => (
                  <div key={category} className="mb-4">
                    <h4 className="text-cyan-400 font-medium mb-2">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.map(skill => (
                        <Badge
                          key={skill}
                          variant={selectedSkills.includes(skill) ? "default" : "outline"}
                          className={`cursor-pointer transition-all ${
                            selectedSkills.includes(skill)
                              ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
                              : 'border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-cyan-400'
                          }`}
                          onClick={() => handleSkillToggle(skill)}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex gap-2 mt-4">
                  <Input
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    placeholder="Add custom skill..."
                    className="bg-slate-800 border-gray-600 text-white"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
                  />
                  <Button type="button" onClick={addCustomSkill} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Selected Skills */}
                {selectedSkills.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">Selected Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedSkills.map(skill => (
                        <Badge key={skill} className="bg-cyan-500 text-white">
                          {skill}
                          <X 
                            className="w-3 h-3 ml-1 cursor-pointer" 
                            onClick={() => handleSkillToggle(skill)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Goals */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Hackathon Goals
                </label>
                <div className="flex flex-wrap gap-2">
                  {goals.map(goal => (
                    <Badge
                      key={goal}
                      variant={selectedGoals.includes(goal) ? "default" : "outline"}
                      className={`cursor-pointer transition-all ${
                        selectedGoals.includes(goal)
                          ? 'bg-blue-500 hover:bg-blue-600 text-white'
                          : 'border-gray-600 text-gray-300 hover:border-blue-400 hover:text-blue-400'
                      }`}
                      onClick={() => handleGoalToggle(goal)}
                    >
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl transition-all duration-200"
                disabled={!name || selectedSkills.length === 0 || !experience}
              >
                Save Profile
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}