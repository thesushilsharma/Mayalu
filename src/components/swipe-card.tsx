"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import type { PanInfo } from "framer-motion";
import { Heart, X, Star, MapPin, Briefcase, GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  images: string[];
  interests: string[];
  occupation?: string;
  education?: string;
  distance: number;
  verified: boolean;
}

interface SwipeCardProps {
  profile: Profile;
  onSwipe: (direction: 'left' | 'right', profileId: string) => void;
  onSuperLike: (profileId: string) => void;
  style?: React.CSSProperties;
}

export function SwipeCard({ profile, onSwipe, onSuperLike, style }: SwipeCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [exitX, setExitX] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    
    if (Math.abs(info.offset.x) > threshold) {
      const direction = info.offset.x > 0 ? 'right' : 'left';
      setExitX(info.offset.x > 0 ? 1000 : -1000);
      onSwipe(direction, profile.id);
    }
  };

  const handleImageClick = (event: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const clickX = event.clientX - rect.left;
    const cardWidth = rect.width;
    
    if (clickX > cardWidth / 2) {
      // Right side - next image
      setCurrentImageIndex((prev) => 
        prev < profile.images.length - 1 ? prev + 1 : prev
      );
    } else {
      // Left side - previous image
      setCurrentImageIndex((prev) => prev > 0 ? prev - 1 : prev);
    }
  };

  const handleLike = () => {
    setExitX(1000);
    onSwipe('right', profile.id);
  };

  const handlePass = () => {
    setExitX(-1000);
    onSwipe('left', profile.id);
  };

  const handleSuperLike = () => {
    onSuperLike(profile.id);
  };

  return (
    <motion.div
      ref={cardRef}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{
        x,
        rotate,
        opacity,
        ...style,
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={exitX !== 0 ? { x: exitX } : {}}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full w-full overflow-hidden bg-white dark:bg-gray-900 shadow-2xl">
        {/* Image Section */}
        <div
          className="relative h-3/5 overflow-hidden cursor-pointer w-full" 
          onClick={handleImageClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              // Simulate a click in the center-right to go to next image
              const rect = cardRef.current?.getBoundingClientRect();
              if (rect) {
                const mockEvent = {
                  clientX: rect.left + (rect.width * 0.75),
                } as React.MouseEvent;
                handleImageClick(mockEvent);
              }
            }
          }}
          aria-label="Navigate through profile images"
        >
          <Image
            src={profile.images[currentImageIndex]}
            alt={`${profile.name} photo ${currentImageIndex + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 448px"
          />
          
          {/* Image indicators */}
          <div className="absolute top-4 left-4 right-4 flex gap-1">
            {profile.images.map((_, index) => (
              <button
                type="button"
                key={`${profile.id}-image-${index}`}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  index === currentImageIndex
                    ? 'bg-white'
                    : 'bg-white/30'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }
                }}
                aria-label={`View image ${index + 1} of ${profile.images.length}`}
              />
            ))}
          </div>

          {/* Verified badge */}
          {profile.verified && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-blue-500 hover:bg-blue-600">
                <Star className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>
          )}

          {/* Swipe indicators */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              opacity: useTransform(x, [50, 150], [0, 1]),
            }}
          >
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold text-xl transform rotate-12">
              LIKE
            </div>
          </motion.div>
          
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              opacity: useTransform(x, [-150, -50], [1, 0]),
            }}
          >
            <div className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold text-xl transform -rotate-12">
              NOPE
            </div>
          </motion.div>
        </div>

        {/* Profile Info */}
        <div className="h-2/5 p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {profile.name}, {profile.age}
              </h2>
              <div className="flex items-center text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{profile.distance} km away</span>
              </div>
            </div>

            {profile.occupation && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Briefcase className="h-4 w-4 mr-2" />
                <span className="text-sm">{profile.occupation}</span>
              </div>
            )}

            {profile.education && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <GraduationCap className="h-4 w-4 mr-2" />
                <span className="text-sm">{profile.education}</span>
              </div>
            )}

            <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
              {profile.bio}
            </p>

            <div className="flex flex-wrap gap-2">
              {profile.interests.slice(0, 3).map((interest) => (
                <Badge key={`${profile.id}-interest-${interest}`} variant="secondary" className="text-xs">
                  {interest}
                </Badge>
              ))}
              {profile.interests.length > 3 && (
                <Badge key={`${profile.id}-more-interests`} variant="outline" className="text-xs">
                  +{profile.interests.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center items-center gap-4 mt-4">
            <Button
              variant="outline"
              size="icon"
              className="h-14 w-14 rounded-full border-2 border-gray-300 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={handlePass}
            >
              <X className="h-6 w-6 text-gray-600 hover:text-red-500" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-2 border-blue-300 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950"
              onClick={handleSuperLike}
            >
              <Star className="h-5 w-5 text-blue-500" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="h-14 w-14 rounded-full border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950"
              onClick={handleLike}
            >
              <Heart className="h-6 w-6 text-gray-600 hover:text-green-500" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}