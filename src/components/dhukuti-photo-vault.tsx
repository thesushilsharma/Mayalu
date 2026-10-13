"use client";

import * as React from "react";
import Image from "next/image";
import {
  Lock,
  Camera,
  Upload,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  EyeOff,
  AlertCircle,
  Plus,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface DhukutiPhotoVaultProps {
  photos: string[];
  onChangePhotos: (photos: string[]) => void;
  verificationSelfie?: string;
  onChangeSelfie?: (selfieUrl: string) => void;
}

const MAX_PHOTOS = 3;

export function DhukutiPhotoVault({
  photos,
  onChangePhotos,
  verificationSelfie = "",
  onChangeSelfie,
}: DhukutiPhotoVaultProps) {
  const [showUrlInput, setShowUrlInput] = React.useState(false);
  const [urlInput, setUrlInput] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const selfieInputRef = React.useRef<HTMLInputElement>(null);

  // Handle local file uploads (converts file to data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (photos.length >= MAX_PHOTOS) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onChangePhotos([...photos, dataUrl]);
      }
    };
    reader.readAsDataURL(file);

    // Reset input
    e.target.value = "";
  };

  const handleSelfieUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl && onChangeSelfie) {
        onChangeSelfie(dataUrl);
      }
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim() && photos.length < MAX_PHOTOS) {
      onChangePhotos([...photos, urlInput.trim()]);
      setUrlInput("");
      setShowUrlInput(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    const updated = [...photos];
    updated.splice(index, 1);
    onChangePhotos(updated);
  };

  const isFeedUnlocked = photos.length >= 1;
  const isFullCapacity = photos.length >= MAX_PHOTOS;

  return (
    <div className="space-y-4">
      {/* SECTION 1: Dhukuti Photo Showcase (Max 3 Pics) */}
      <div className="rounded-2xl border border-rose-500/25 bg-card/60 backdrop-blur-md p-3.5 space-y-3 shadow-sm">
        {/* Header & Feed Unlock Badge */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500">
            <Lock className="w-4 h-4" />
            <span>Private Dhukuti Showcase ({photos.length}/{MAX_PHOTOS} Pics)</span>
          </div>
          {isFeedUnlocked ? (
            <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] px-2 py-0.5 gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Swipe Feed Unlocked</span>
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-[10px] text-amber-500 border-amber-500/30 bg-amber-500/10 px-2 py-0.5"
            >
              Upload 1-3 to unlock feed
            </Badge>
          )}
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Your photos stay <strong className="text-foreground">sealed & blurred</strong> in Maya&apos;s Dhukuti until both of you mutually match and say yes 💘. Upload <strong>up to 3 photos max</strong> to unlock the Swipe Feed.
        </p>

        {/* 3 Photo Slots Grid */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          {[0, 1, 2].map((index) => {
            const photoUrl = photos[index];

            if (photoUrl) {
              return (
                <div
                  key={`slot-${index}`}
                  className="relative aspect-square rounded-2xl overflow-hidden border border-rose-500/30 bg-muted/40 group shadow-sm"
                >
                  <Image
                    src={photoUrl}
                    alt={`Dhukuti Photo ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {/* Dhukuti Seal Overlay */}
                  <div className="absolute inset-0 bg-background/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-1.5 text-center gap-1">
                    <span className="text-[10px] text-white font-semibold drop-shadow-md flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" />
                      Sealed
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="p-1 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-md transition-colors"
                      title="Remove Photo"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  {/* Persistent lock pill on corner */}
                  <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-md rounded-full px-1.5 py-0.5 text-[9px] text-white font-medium flex items-center gap-0.5">
                    <Lock className="w-2 h-2 text-rose-400" />
                    <span>#{index + 1}</span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={`empty-slot-${index}`}
                className="relative aspect-square rounded-2xl border-2 border-dashed border-border/80 hover:border-rose-500/60 transition-colors flex flex-col items-center justify-center gap-1 p-2 text-center bg-muted/20"
              >
                <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:text-rose-500 transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-muted-foreground font-medium">
                  Photo {index + 1}
                </span>
                <span className="text-[9px] text-rose-500/80">
                  {index === 0 ? "Required" : "Optional"}
                </span>
              </div>
            );
          })}
        </div>

        {/* Upload Action Bar */}
        {!isFullCapacity && (
          <div className="flex items-center gap-2 pt-1">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs h-8 rounded-xl flex-1 gap-1.5 border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Photo ({photos.length}/3)</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-xs h-8 rounded-xl px-2.5 text-muted-foreground"
            >
              <span>Add URL</span>
            </Button>
          </div>
        )}

        {showUrlInput && !isFullCapacity && (
          <form onSubmit={handleAddUrl} className="flex gap-2 items-center pt-1">
            <Input
              placeholder="Paste image link (https://...)"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="h-8 text-xs bg-background/80 rounded-xl"
            />
            <Button
              type="submit"
              size="sm"
              className="h-8 text-xs bg-rose-500 hover:bg-rose-600 text-white rounded-xl"
            >
              Add
            </Button>
          </form>
        )}
      </div>

      {/* SECTION 2: Admin-Only Verification Selfie */}
      <div className="rounded-2xl border border-violet-500/25 bg-violet-500/5 p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-violet-600 dark:text-violet-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Human Verification Selfie</span>
          </div>
          <Badge
            variant="outline"
            className="text-[10px] bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30 py-0"
          >
            🔒 Admin Only • Never Public
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          As per our safety policy, our admin team conducts a <strong className="text-foreground">manual review of your selfie</strong> to grant your verified checkmark. This selfie is private in your Dhukuti, <strong className="text-foreground">never shown on your public card</strong>, and used strictly for identity authentication.
        </p>

        {verificationSelfie ? (
          <div className="flex items-center gap-3 p-2 bg-background/70 rounded-xl border border-violet-500/30">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-muted shrink-0">
              <Image
                src={verificationSelfie}
                alt="Verification Selfie"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-violet-900/30 flex items-center justify-center">
                <Lock className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500">
                <FileCheck className="w-3.5 h-3.5" />
                <span>Selfie Submitted for Admin Review</span>
              </div>
              <p className="text-[10px] text-muted-foreground truncate">
                Encrypted in Dhukuti • Reviewed within 24h
              </p>
            </div>
            {onChangeSelfie && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChangeSelfie("")}
                className="text-xs h-7 text-muted-foreground hover:text-red-500"
              >
                Change
              </Button>
            )}
          </div>
        ) : (
          <div>
            <input
              type="file"
              ref={selfieInputRef}
              accept="image/*"
              capture="user"
              className="hidden"
              onChange={handleSelfieUpload}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => selfieInputRef.current?.click()}
              className="w-full text-xs h-8.5 rounded-xl border-violet-500/30 text-violet-600 dark:text-violet-400 hover:bg-violet-500/10 gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Upload or Snap Verification Selfie</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
