import React from "react";
import { Composition } from "remotion";
import { GlassWalletVideo } from "./GlassWalletVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="GlassWalletVideo"
        component={GlassWalletVideo}
        durationInFrames={3570}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
