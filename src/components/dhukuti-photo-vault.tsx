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
  Zap,
  Ghost,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface DhukutiPhotoVaultProps {
  photos: string[];
  onChangePhotos: (photos: string[]) => void;
  verificationSelfie?: string;
  onChangeSelfie?: (selfieUrl: string) => void;
  mode?: "all" | "photos" | "selfie";
  className?: string;
}

const MAX_PHOTOS = 3;

export function DhukutiPhotoVault({
  photos,
  onChangePhotos,
  verificationSelfie = "",
  onChangeSelfie,
  mode = "all",
  className = "",
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

  const isHallwayActive = photos.length >= MAX_PHOTOS;
  const isFullCapacity = photos.length >= MAX_PHOTOS;

  const showPhotos = mode === "all" || mode === "photos";
  const showSelfie = mode === "all" || mode === "selfie";

  return (
    <div className={`flex flex-col gap-3.5 ${className}`}>
      {/* SECTION 1: Dhukuti Photo Showcase (Max 3 Pics) */}
      {showPhotos && (
        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-3.5 flex flex-col gap-3 shadow-xs">
          {/* Header & Hallway Status Badge */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-500">
              <Lock className="size-3.5" />
              <span>Dhukuti Photo Showcase</span>
              <span className="text-[11px] text-muted-foreground font-normal">
                ({photos.length}/{MAX_PHOTOS})
              </span>
            </div>
            {isHallwayActive ? (
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 gap-1 font-medium">
                <CheckCircle2 className="size-3" />
                <span>Hallway Active</span>
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-[10px] text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10 px-2 py-0.5 gap-1 font-medium"
              >
                <AlertCircle className="size-3" />
                <span>Need {MAX_PHOTOS - photos.length} more for Hallway</span>
              </Badge>
            )}
          </div>

          {/* Quiet Privacy Reassurance Banner */}
          <div className="flex items-start gap-2 p-2 rounded-xl bg-rose-500/5 border border-rose-500/15 text-[11px] leading-relaxed text-muted-foreground">
            <Lock className="size-3.5 text-rose-500 shrink-0 mt-0.5" />
            <span>
              Photos stay sealed in your private Dhukuti. Public sees your DiceBear avatar until you mutually match.
            </span>
          </div>

          {/* 3 Photo Slots Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            {[0, 1, 2].map((index) => {
              const photoUrl = photos[index];

              if (photoUrl) {
                return (
                  <div
                    key={`slot-${index}`}
                    className="relative aspect-square rounded-2xl overflow-hidden border border-border/80 bg-muted/40 group shadow-xs"
                  >
                    <Image
                      src={photoUrl}
                      alt={`Dhukuti Photo ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    {/* Dhukuti Seal Overlay */}
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-1.5 text-center gap-1.5">
                      <span className="text-[10px] text-foreground font-medium flex items-center gap-1 bg-background/80 px-2 py-0.5 rounded-full shadow-xs">
                        <Lock className="size-2.5 text-rose-500" />
                        Sealed
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="p-1.5 rounded-full bg-destructive text-destructive-foreground hover:opacity-90 shadow-sm transition-transform active:scale-95"
                        title="Remove Photo"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                    {/* Persistent lock pill on corner */}
                    <div className="absolute bottom-1.5 right-1.5 bg-black/60 backdrop-blur-md rounded-full px-1.5 py-0.5 text-[9px] text-white font-medium flex items-center gap-0.5">
                      <Lock className="size-2 text-rose-400" />
                      <span>#{index + 1}</span>
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={`empty-slot-${index}`}
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative aspect-square rounded-2xl border-2 border-dashed border-border/70 hover:border-rose-500/60 transition-all flex flex-col items-center justify-center gap-1 p-2 text-center bg-muted/20 hover:bg-rose-500/5 group active:scale-[0.98]"
                >
                  <div className="size-8 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground group-hover:text-rose-500 group-hover:bg-rose-500/10 transition-colors">
                    <Plus className="size-4" />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    Photo {index + 1}
                  </span>
                  <span className="text-[9px] text-rose-500/90 font-medium">
                    + Add
                  </span>
                </button>
              );
            })}
          </div>

          {/* Upload Action Bar */}
          {!isFullCapacity && (
            <div className="flex items-center gap-2 pt-0.5">
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
                className="text-xs h-8 rounded-xl flex-1 gap-1.5 border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 active:scale-[0.98] transition-transform"
              >
                <Upload className="size-3.5" />
                <span>Upload Showcase Photo</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-xs h-8 rounded-xl px-2.5 text-muted-foreground hover:text-foreground active:scale-[0.98] transition-transform"
              >
                <span>Add Link</span>
              </Button>
            </div>
          )}

          {showUrlInput && !isFullCapacity && (
            <form onSubmit={handleAddUrl} className="flex gap-2 items-center pt-0.5">
              <Input
                placeholder="Paste image URL (https://...)"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="h-8 text-xs bg-background/80 rounded-xl"
              />
              <Button
                type="submit"
                size="sm"
                className="h-8 text-xs bg-rose-500 hover:bg-rose-600 text-white rounded-xl active:scale-[0.97] transition-transform"
              >
                Add
              </Button>
            </form>
          )}
        </div>
      )}

      {/* SECTION 2: Maya's 1-on-1 Verification */}
      {showSelfie && (
        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-3.5 flex flex-col gap-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400">
              <ShieldCheck className="size-3.5" />
              <span>Identity Verification</span>
            </div>
            {verificationSelfie ? (
              <Badge
                variant="outline"
                className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 py-0 flex items-center gap-1 font-medium"
              >
                <CheckCircle2 className="size-3" />
                <span>Maya Checking 🛡️</span>
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-[10px] bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/30 py-0 flex items-center gap-1 font-semibold"
              >
                <Ghost className="size-3" />
                <span>Ghost Spectator Mode 👻</span>
              </Badge>
            )}
          </div>

          {/* Maya's Direct Whisper / Voice Card */}
          <div className="flex flex-col gap-2 p-3 rounded-2xl bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-rose-500/10 border border-violet-500/20 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-full bg-gradient-to-tr from-rose-500 to-violet-600 flex items-center justify-center text-white text-[10px] font-bold shadow-xs">
                  M
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-foreground text-xs">Maya</span>
                  <span className="text-[10px] text-muted-foreground">• Personal Matchmaker</span>
                </div>
              </div>
              <Badge variant="outline" className="text-[9px] bg-background/80 text-violet-600 dark:text-violet-400 border-violet-500/25 py-0 px-1.5">
                1-on-1 Check
              </Badge>
            </div>

            <div className="bg-background/80 dark:bg-slate-900/60 p-2.5 rounded-xl border border-violet-500/15 shadow-2xs">
              <p className="text-foreground/95 leading-relaxed text-xs font-medium">
                “Everyone sends me a quick selfie, and I check each one myself. Your selfie never shows on your profile, and I delete it once you’re verified.”
              </p>
            </div>

            <div className="flex items-start gap-1.5 text-[11px] leading-snug text-purple-950 dark:text-purple-200">
              <Ghost className="size-3.5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
              <span>
                Without verification, you&apos;re stuck as a <strong className="font-bold underline decoration-purple-500/50">ghost bot spectator 👻</strong>—you can look around, but you can&apos;t match, receive intros, or start Kura-Kani with anyone.
              </span>
            </div>
          </div>

          {verificationSelfie ? (
            <div className="flex items-center gap-3 p-2.5 bg-background/80 dark:bg-slate-900/60 rounded-xl border border-emerald-500/30">
              <div className="relative size-12 rounded-xl overflow-hidden bg-muted shrink-0 border border-emerald-500/25">
                <Image
                  src={verificationSelfie}
                  alt="Verification Selfie"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-violet-950/20 flex items-center justify-center">
                  <Lock className="size-3.5 text-white drop-shadow" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <FileCheck className="size-3.5 shrink-0" />
                  <span className="truncate">Sent to Maya for Review</span>
                </div>
                <p className="text-[10px] text-muted-foreground truncate">
                  Permanently deleted upon verification • 100% private
                </p>
              </div>
              {onChangeSelfie && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onChangeSelfie("")}
                  className="text-xs h-7 text-muted-foreground hover:text-destructive active:scale-[0.97]"
                >
                  Retake
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
                size="sm"
                onClick={() => selfieInputRef.current?.click()}
                className="w-full text-xs h-10 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-rose-600 hover:from-violet-500 hover:to-rose-500 text-white font-semibold gap-1.5 shadow-md shadow-violet-500/20 active:scale-[0.98] transition-all"
              >
                <Camera className="size-4" />
                <span>Send Maya Your Quick Selfie • Exit Ghost Mode 🔑</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
