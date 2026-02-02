import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";

const PAGES = [
  {
    image: "pages/page-01.jpg",
    title: "Meet Alex",
    subtitle: "A freelance developer navigating Solana DeFi",
  },
  {
    image: "pages/page-02.jpg",
    title: "The Problem Begins",
    subtitle: "Every transaction broadcasts to the public mempool",
  },
  {
    image: "pages/page-03.png",
    title: "The Cost of Transparency",
    subtitle: "MEV attacks cost users millions every month",
  },
  {
    image: "pages/page-04.png",
    title: "Real-World Consequences",
    subtitle: "Price discrimination, scams, and surveillance",
  },
  {
    image: "pages/page-05.jpg",
    title: "The Other Perspective",
    subtitle: "Total anonymity enables bad actors too",
  },
  {
    image: "pages/page-06.jpg",
    title: "The False Choice",
    subtitle: "Full transparency vs total anonymity - neither works",
  },
  {
    image: "pages/page-07.png",
    title: "Discovering the Solution",
    subtitle: "encrypt.trade: Selective privacy, not hiding",
  },
  {
    image: "pages/page-08.png",
    title: "How It Works",
    subtitle: "Your envelope is sealed, but verifiable",
  },
  {
    image: "pages/page-09.png",
    title: "Selective Privacy",
    subtitle: "Choose what to reveal, what to protect",
  },
  {
    image: "pages/page-10.png",
    title: "Privacy Meets Accountability",
    subtitle: "Compliance possible, exposure not default",
  },
  {
    image: "pages/page-11.jpg",
    title: "Privacy Is A Right",
    subtitle: "Trade privately on Solana with full liquidity",
  },
  {
    image: "pages/page-12.jpg",
    title: "The End",
    subtitle: "Privacy isn't hiding. It's choosing.",
  },
];

const FRAMES_PER_PAGE = 270;
const TRANSITION_FRAMES = 30;

const PageSlide: React.FC<{
  page: (typeof PAGES)[0];
  index: number;
}> = ({ page, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterProgress = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });

  const exitProgress = spring({
    frame: frame - (FRAMES_PER_PAGE - TRANSITION_FRAMES),
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });

  const scale = interpolate(enterProgress, [0, 1], [1.1, 1]);
  const opacity = interpolate(
    frame,
    [0, 20, FRAMES_PER_PAGE - 30, FRAMES_PER_PAGE],
    [0, 1, 1, 0]
  );

  const textY = interpolate(enterProgress, [0, 1], [50, 0]);
  const textOpacity = interpolate(
    frame,
    [20, 50, FRAMES_PER_PAGE - 40, FRAMES_PER_PAGE - 20],
    [0, 1, 1, 0]
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <AbsoluteFill
        style={{
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        <Img
          src={staticFile(page.image)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 30%, transparent 60%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 80,
          right: 80,
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            marginBottom: 16,
            textShadow: "0 4px 20px rgba(0,0,0,0.8)",
          }}
        >
          {page.title}
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 400,
            color: "#a0a0a0",
            fontFamily: "system-ui, -apple-system, sans-serif",
            textShadow: "0 2px 10px rgba(0,0,0,0.8)",
          }}
        >
          {page.subtitle}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 40,
          right: 60,
          fontSize: 24,
          color: "#666",
          fontFamily: "system-ui, -apple-system, sans-serif",
          opacity: textOpacity,
        }}
      >
        {index + 1} / {PAGES.length}
      </div>
    </AbsoluteFill>
  );
};

const IntroSequence: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });

  const subtitleSpring = spring({
    frame: frame - 40,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });

  const fadeOut = interpolate(frame, [120, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleY = interpolate(titleSpring, [0, 1], [100, 0]);
  const subtitleY = interpolate(subtitleSpring, [0, 1], [50, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 120,
            fontWeight: 800,
            color: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            transform: `translateY(${titleY}px)`,
            opacity: titleSpring,
            letterSpacing: -2,
          }}
        >
          The Glass Wallet
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 400,
            color: "#888",
            fontFamily: "system-ui, -apple-system, sans-serif",
            marginTop: 30,
            transform: `translateY(${subtitleY}px)`,
            opacity: subtitleSpring,
          }}
        >
          A story about privacy on Solana
        </div>
      </div>
    </AbsoluteFill>
  );
};

const OutroSequence: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const logoSpring = spring({
    frame: frame - 30,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });

  const ctaSpring = spring({
    frame: frame - 60,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeIn,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 80,
            fontWeight: 800,
            color: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            opacity: logoSpring,
            transform: `scale(${interpolate(logoSpring, [0, 1], [0.8, 1])})`,
          }}
        >
          encrypt.trade
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 500,
            color: "#10b981",
            fontFamily: "system-ui, -apple-system, sans-serif",
            marginTop: 40,
            opacity: ctaSpring,
            transform: `translateY(${interpolate(ctaSpring, [0, 1], [30, 0])}px)`,
          }}
        >
          Privacy isn't hiding. It's choosing.
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 400,
            color: "#666",
            fontFamily: "system-ui, -apple-system, sans-serif",
            marginTop: 60,
            opacity: ctaSpring,
          }}
        >
          Selective privacy on Solana
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const GlassWalletVideo: React.FC = () => {
  const INTRO_DURATION = 150;
  const OUTRO_DURATION = 180;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <Sequence from={0} durationInFrames={INTRO_DURATION}>
        <IntroSequence />
      </Sequence>

      {PAGES.map((page, index) => (
        <Sequence
          key={index}
          from={INTRO_DURATION + index * FRAMES_PER_PAGE}
          durationInFrames={FRAMES_PER_PAGE}
        >
          <PageSlide page={page} index={index} />
        </Sequence>
      ))}

      <Sequence
        from={INTRO_DURATION + PAGES.length * FRAMES_PER_PAGE}
        durationInFrames={OUTRO_DURATION}
      >
        <OutroSequence />
      </Sequence>
    </AbsoluteFill>
  );
};
