import React from "react";
import { Composition } from "remotion";
import { GlassWalletVideo, GlassWalletShort, GlassWalletVertical } from "./GlassWalletVideo";

export const RemotionRoot: React.FC = () => {
  // Full video: 220 intro + (12 pages × 400 frames) + 300 outro = 5320 frames
  const FULL_DURATION = 220 + 12 * 400 + 300;

  // Short video: 90 intro + (6 pages × 200 frames) + 150 outro = 1440 frames (~48 seconds)
  const SHORT_DURATION = 90 + 6 * 200 + 150;

  // Vertical video: 75 intro + (6 pages × 180 frames) + 120 outro = 1275 frames (~42 seconds)
  const VERTICAL_DURATION = 75 + 6 * 180 + 120;

  return (
    <>
      {/* Full-length presentation video (16:9) */}
      <Composition
        id="GlassWalletVideo"
        component={GlassWalletVideo}
        durationInFrames={FULL_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* 60-second cut for Twitter/X (16:9) */}
      <Composition
        id="GlassWalletShort"
        component={GlassWalletShort}
        durationInFrames={SHORT_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Vertical for TikTok/Reels/Shorts (9:16) */}
      <Composition
        id="GlassWalletVertical"
        component={GlassWalletVertical}
        durationInFrames={VERTICAL_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
