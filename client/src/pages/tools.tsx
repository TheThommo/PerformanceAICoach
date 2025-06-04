import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer, Target, CircleDot, Brain } from "lucide-react";
import { PreShotRoutineComponent } from "@/components/pre-shot-routine";
import { MentalSkillsXCheck } from "@/components/mental-skills-xcheck";
import { ControlCircles } from "@/components/control-circles";

export default function Tools() {
  const userId = 1; // Demo user ID

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Red2Blue Mental Performance Tools
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Professional coaching tools designed to develop elite mental performance. 
              These evidence-based methodologies help you transition from reactive "Red Head" 
              states to focused "Blue Head" performance.
            </p>
          </div>

          {/* Tools Tabs */}
          <Tabs defaultValue="pre-shot-routine" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
              <TabsTrigger value="pre-shot-routine" className="flex items-center space-x-2">
                <Timer className="h-4 w-4" />
                <span className="hidden sm:inline">Pre-Shot Routine</span>
                <span className="sm:hidden">Routine</span>
              </TabsTrigger>
              <TabsTrigger value="mental-skills" className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Mental Skills X-Check</span>
                <span className="sm:hidden">X-Check</span>
              </TabsTrigger>
              <TabsTrigger value="control-circles" className="flex items-center space-x-2">
                <CircleDot className="h-4 w-4" />
                <span className="hidden sm:inline">Control Circles</span>
                <span className="sm:hidden">Control</span>
              </TabsTrigger>
              <TabsTrigger value="mindset-map" className="flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">Mindset Map</span>
                <span className="sm:hidden">Mindset</span>
              </TabsTrigger>
            </TabsList>

            {/* Pre-Shot Routine */}
            <TabsContent value="pre-shot-routine" className="space-y-6">
              <div className="grid gap-6">
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-900">Pre-Shot Routine Playbook</CardTitle>
                    <CardDescription className="text-blue-700">
                      Master your 25-second routine for consistent performance under pressure. 
                      This systematic approach helps you enter the Blue Head state before every shot.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-blue-800">
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold mb-2">Key Benefits:</h4>
                        <ul className="space-y-1">
                          <li>• Consistent mental preparation</li>
                          <li>• Reduced anxiety and tension</li>
                          <li>• Improved focus and concentration</li>
                          <li>• Enhanced confidence and trust</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">When to Use:</h4>
                        <ul className="space-y-1">
                          <li>• Before every shot in competition</li>
                          <li>• During practice sessions</li>
                          <li>• High-pressure situations</li>
                          <li>• When feeling rushed or tense</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <PreShotRoutineComponent userId={userId} />
              </div>
            </TabsContent>

            {/* Mental Skills X-Check */}
            <TabsContent value="mental-skills" className="space-y-6">
              <div className="grid gap-6">
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-900">Mental Skills X-Check Tool</CardTitle>
                    <CardDescription className="text-green-700">
                      Track and evaluate your performance across the four core Red2Blue mental skills. 
                      Use this systematic review to identify strengths and areas for improvement.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-green-800">
                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold mb-2">Intensity Management</h4>
                        <p>Control your energy and arousal levels for optimal performance</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Decision Making</h4>
                        <p>Make clear, confident choices without second-guessing</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Managing Diversions</h4>
                        <p>Stay focused despite external distractions and interruptions</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Execution</h4>
                        <p>Trust your preparation and commit fully to each shot</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <MentalSkillsXCheck userId={userId} />
              </div>
            </TabsContent>

            {/* Control Circles */}
            <TabsContent value="control-circles" className="space-y-6">
              <div className="grid gap-6">
                <Card className="bg-purple-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-purple-900">R2B Control Circles Tool</CardTitle>
                    <CardDescription className="text-purple-700">
                      Focus your mental energy on what truly matters. This exercise helps you distinguish 
                      between what you can control, influence, or must accept, leading to better mental clarity.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-purple-800">
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-2"></div>
                        <h4 className="font-semibold mb-2">Can't Control</h4>
                        <p>External factors completely outside your influence - accept and let go</p>
                      </div>
                      <div className="text-center">
                        <div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto mb-2"></div>
                        <h4 className="font-semibold mb-2">Can Influence</h4>
                        <p>Factors you can partially affect through your actions and preparation</p>
                      </div>
                      <div className="text-center">
                        <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                        <h4 className="font-semibold mb-2">Can Control</h4>
                        <p>Your thoughts, actions, and responses - focus your energy here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <ControlCircles userId={userId} />
              </div>
            </TabsContent>

            {/* Mindset Map */}
            <TabsContent value="mindset-map" className="space-y-6">
              <Card className="bg-orange-50 border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-900">R2B Mindset Map</CardTitle>
                  <CardDescription className="text-orange-700">
                    Visual framework for understanding the journey from Red Head reactive states 
                    to Blue Head performance states. Use this as your mental performance compass.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Red Head State */}
                    <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                      <h3 className="text-lg font-bold text-red-800 mb-3 flex items-center">
                        <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                        Red Head State
                      </h3>
                      <div className="space-y-3 text-sm text-red-700">
                        <div>
                          <h4 className="font-semibold">Characteristics:</h4>
                          <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>Reactive and emotional</li>
                            <li>Overthinking and analysis paralysis</li>
                            <li>Tense and anxious</li>
                            <li>Focused on outcomes</li>
                            <li>Self-doubt and negative self-talk</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold">Triggers:</h4>
                          <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>Bad shots or mistakes</li>
                            <li>Pressure situations</li>
                            <li>External distractions</li>
                            <li>Performance expectations</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Blue Head State */}
                    <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                      <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
                        <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                        Blue Head State
                      </h3>
                      <div className="space-y-3 text-sm text-blue-700">
                        <div>
                          <h4 className="font-semibold">Characteristics:</h4>
                          <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>Calm and composed</li>
                            <li>Clear thinking and decision making</li>
                            <li>Relaxed confidence</li>
                            <li>Process-focused</li>
                            <li>Trust and commitment</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold">Enablers:</h4>
                          <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>Consistent routines</li>
                            <li>Present moment awareness</li>
                            <li>Positive self-talk</li>
                            <li>Clear intentions</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transition Strategies */}
                  <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Red to Blue Transition Strategies</h3>
                    <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
                      <div>
                        <h4 className="font-semibold text-blue-600 mb-2">Reset Techniques</h4>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>3-2-1 breathing reset</li>
                          <li>Physical movement routine</li>
                          <li>Positive anchor word</li>
                          <li>Refocus on process cues</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-600 mb-2">Mental Tools</h4>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>Visualization and imagery</li>
                          <li>Self-talk restructuring</li>
                          <li>Attention control</li>
                          <li>Confidence building</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-600 mb-2">Performance Anchors</h4>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>Pre-shot routine consistency</li>
                          <li>Target commitment</li>
                          <li>Tempo and rhythm</li>
                          <li>Trust in preparation</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}