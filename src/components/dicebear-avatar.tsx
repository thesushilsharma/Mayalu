"use client";

import * as React from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "cn";
import {
  type DiceBearStyleName,
  getDiceBearUrl,
} from "@/lib/dicebear";

interface DiceBearAvatarProps {
  seed: string;
  styleName?: DiceBearStyleName;
  alt?: string;
  size?: "sm" | "default" | "lg" | "xl";
  className?: string;
  showBorder?: boolean;
}

const SIZE_MAP = {
  sm: { px: 32, class: "size-8" },
  default: { px: 48, class: "size-12" },
  lg: { px: 64, class: "size-16" },
  xl: { px: 96, class: "size-24" },
};

export function DiceBearAvatar({
  seed,
  styleName = "initial-face",
  alt,
  size = "default",
  className,
  showBorder = false,
}: DiceBearAvatarProps) {
  const avatarUrl = React.useMemo(() => {
    return getDiceBearUrl(seed, styleName);
  }, [seed, styleName]);

  const initials = (seed || "M")
    .slice(0, 2)
    .toUpperCase();

  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.default;

  return (
    <Avatar
      className={cn(
        sizeConfig.class,
        "relative shrink-0 overflow-hidden rounded-2xl bg-muted/40",
        showBorder && "ring-2 ring-rose-500/40 shadow-sm",
        className
      )}
    >
      <AvatarImage
        src={avatarUrl}
        alt={alt || `${seed}'s Avatar`}
        className="size-full object-cover rounded-2xl"
      />
      <AvatarFallback className="rounded-2xl bg-rose-500/10 font-bold text-rose-500">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
