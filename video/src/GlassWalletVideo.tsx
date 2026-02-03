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
  Audio,
  Easing,
} from "remotion";

const PAGES = [
  {
    image: "pages/page-01.jpg",
    title: "Meet Alex",
    subtitle: "A freelance developer navigating Solana DeFi",
    keywords: ["Solana", "DeFi"],
    narrator: "Meet Alex. Freelance developer. Solana DeFi user. Not a whale. Not a criminal. Just someone trying to build wealth.",
  },
  {
    image: "pages/page-02.jpg",
    title: "The Problem Begins",
    subtitle: "Every transaction broadcasts to the public mempool",
    keywords: ["mempool", "MEV bots"],
    narrator: "The moment you submit, everyone sees. MEV bots are watching. Always watching.",
  },
  {
    image: "pages/page-03.png",
    title: "The Cost of Transparency",
    subtitle: "MEV attacks cost users millions every month",
    keywords: ["MEV attacks", "sandwich attack"],
    narrator: "They see your trade before it lands. They sandwich you. You get the worse price.",
  },
  {
    image: "pages/page-04.png",
    title: "Real-World Consequences",
    subtitle: "Price discrimination, scams, and surveillance",
    keywords: ["Solscan", "price discrimination"],
    narrator: "Your wallet is public. Anyone can look it up. Your landlord, your employer, scammers who know exactly who to target.",
  },
  {
    image: "pages/page-05.jpg",
    title: "The Other Perspective",
    subtitle: "Total anonymity enables bad actors too",
    keywords: ["anonymity", "compliance"],
    narrator: "When we can't trace anything, bad actors thrive. Privacy coins delisted. Regulatory pressure mounting.",
  },
  {
    image: "pages/page-06.jpg",
    title: "The False Choice",
    subtitle: "Full transparency vs total anonymity - neither works",
    keywords: ["transparency", "anonymity"],
    narrator: "This is the choice we've been given. Expose everything. Or look like a criminal. Neither extreme works.",
  },
  {
    image: "pages/page-07.png",
    title: "Discovering the Solution",
    subtitle: "encrypt.trade: Selective privacy, not hiding",
    keywords: ["encrypt.trade", "selective privacy"],
    narrator: "It's not about hiding. It's about choosing who sees what.",
  },
  {
    image: "pages/page-08.png",
    title: "How It Works",
    subtitle: "Your envelope is sealed, but verifiable",
    keywords: ["encrypted", "verified"],
    narrator: "Your envelope is sealed. The network can verify it's valid. But they can't see what's inside.",
  },
  {
    image: "pages/page-09.png",
    title: "Selective Privacy",
    subtitle: "Choose what to reveal, what to protect",
    keywords: ["selective privacy", "consent"],
    narrator: "Total transparency leaves you vulnerable. Total anonymity raises red flags. Selective privacy? That's just normal.",
  },
  {
    image: "pages/page-10.png",
    title: "Privacy Meets Accountability",
    subtitle: "Compliance possible, exposure not default",
    keywords: ["compliance", "accountability"],
    narrator: "Privacy and accountability. Not opposites. A balance. I decide who sees what.",
  },
  {
    image: "pages/page-11.jpg",
    title: "Privacy Is A Right",
    subtitle: "Trade privately on Solana with full liquidity",
    keywords: ["privacy", "Jupiter", "liquidity"],
    narrator: "Privacy is a human right. Not a criminal trait. Trade privately on Solana. Full Jupiter liquidity. Zero exposure.",
  },
  {
    image: "pages/page-12.png",
    title: "The End",
    subtitle: "Privacy isn't hiding. It's choosing.",
    keywords: ["choosing"],
    narrator: "Privacy isn't hiding. It's choosing. Selective privacy on Solana.",
  },
];

const FRAMES_PER_PAGE = 400; // ~13.3 seconds at 30fps
const TRANSITION_FRAMES = 45;

// Particle effect component
const Particles: React.FC<{ count: number; color: string }> = ({ count, color }) => {
  const frame = useCurrentFrame();
  const particles = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.2,
      delay: Math.random() * 100,
    }));
  }, [count]);

  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      {particles.map((p, i) => {
        const y = (p.y + (frame + p.delay) * p.speed * 0.1) % 120 - 10;
        const opacity = interpolate(y, [0, 50, 100], [0, 0.6, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${y}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: color,
              opacity: opacity * 0.5,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Progress bar component
const ProgressBar: React.FC<{ current: number; total: number; progress: number }> = ({
  current,
  total,
  progress,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 30,
        left: 80,
        right: 80,
        height: 4,
        backgroundColor: "rgba(255,255,255,0.2)",
        borderRadius: 2,
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${((current + progress) / total) * 100}%`,
          backgroundColor: "#10b981",
          borderRadius: 2,
          transition: "width 0.1s ease-out",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -25,
          right: 0,
          fontSize: 14,
          color: "rgba(255,255,255,0.5)",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {current + 1} / {total}
      </div>
    </div>
  );
};

// Keyword highlight component
const HighlightedText: React.FC<{
  text: string;
  keywords: string[];
  frame: number;
}> = ({ text, keywords, frame }) => {
  const highlightOpacity = interpolate(frame, [60, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  let result = text;
  keywords.forEach((keyword) => {
    result = result.replace(
      new RegExp(`(${keyword})`, "gi"),
      `<mark>$1</mark>`
    );
  });

  return (
    <div
      style={{
        fontSize: 32,
        fontWeight: 400,
        color: "#a0a0a0",
        fontFamily: "system-ui, -apple-system, sans-serif",
        textShadow: "0 2px 10px rgba(0,0,0,0.8)",
      }}
      dangerouslySetInnerHTML={{
        __html: result.replace(
          /<mark>/g,
          `<span style="color: #10b981; font-weight: 600; opacity: ${highlightOpacity}">`
        ).replace(/<\/mark>/g, "</span>"),
      }}
    />
  );
};

// Logo watermark
const LogoWatermark: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: 40,
        left: 60,
        display: "flex",
        alignItems: "center",
        gap: 10,
        opacity: 0.7,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: 700,
          color: "#fff",
        }}
      >
        E
      </div>
      <span
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: "#fff",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        encrypt.trade
      </span>
    </div>
  );
};

const PageSlide: React.FC<{
  page: (typeof PAGES)[0];
  index: number;
  totalPages: number;
}> = ({ page, index, totalPages }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterProgress = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 150, mass: 0.8 },
  });

  const scale = interpolate(
    frame,
    [0, FRAMES_PER_PAGE],
    [1.08, 1],
    { easing: Easing.out(Easing.cubic) }
  );

  const opacity = interpolate(
    frame,
    [0, 30, FRAMES_PER_PAGE - 45, FRAMES_PER_PAGE],
    [0, 1, 1, 0],
    { easing: Easing.inOut(Easing.cubic) }
  );

  const textY = interpolate(enterProgress, [0, 1], [40, 0]);
  const textOpacity = interpolate(
    frame,
    [30, 60, FRAMES_PER_PAGE - 60, FRAMES_PER_PAGE - 30],
    [0, 1, 1, 0]
  );

  const pageProgress = interpolate(frame, [0, FRAMES_PER_PAGE], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <Particles count={30} color="#10b981" />

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
            "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 25%, transparent 50%)",
        }}
      />

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 15%)",
        }}
      />

      <LogoWatermark />

      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 80,
          right: 80,
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            marginBottom: 16,
            textShadow: "0 4px 20px rgba(0,0,0,0.8)",
            letterSpacing: -1,
          }}
        >
          {page.title}
        </div>
        <HighlightedText
          text={page.subtitle}
          keywords={page.keywords}
          frame={frame}
        />
      </div>

      <ProgressBar current={index} total={totalPages} progress={pageProgress} />
    </AbsoluteFill>
  );
};

const IntroSequence: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame: frame - 30,
    fps,
    config: { damping: 80, stiffness: 150, mass: 0.8 },
  });

  const subtitleSpring = spring({
    frame: frame - 60,
    fps,
    config: { damping: 80, stiffness: 150, mass: 0.8 },
  });

  const taglineSpring = spring({
    frame: frame - 90,
    fps,
    config: { damping: 80, stiffness: 150, mass: 0.8 },
  });

  const fadeOut = interpolate(frame, [180, 220], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const titleY = interpolate(titleSpring, [0, 1], [80, 0]);
  const subtitleY = interpolate(subtitleSpring, [0, 1], [50, 0]);
  const taglineY = interpolate(taglineSpring, [0, 1], [30, 0]);

  const glowPulse = interpolate(
    Math.sin(frame * 0.05),
    [-1, 1],
    [0.3, 0.6]
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      <Particles count={50} color="#10b981" />

      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(16, 185, 129, ${glowPulse}) 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />

      <div style={{ textAlign: "center", zIndex: 1 }}>
        <div
          style={{
            fontSize: 28,
            fontWeight: 500,
            color: "#10b981",
            fontFamily: "system-ui, -apple-system, sans-serif",
            marginBottom: 20,
            transform: `translateY(${taglineY}px)`,
            opacity: taglineSpring,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          Privacy Chronicles Presents
        </div>
        <div
          style={{
            fontSize: 110,
            fontWeight: 800,
            color: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            transform: `translateY(${titleY}px)`,
            opacity: titleSpring,
            letterSpacing: -3,
            textShadow: "0 0 80px rgba(16, 185, 129, 0.5)",
          }}
        >
          The Glass Wallet
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 400,
            color: "#888",
            fontFamily: "system-ui, -apple-system, sans-serif",
            marginTop: 25,
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

  const fadeIn = interpolate(frame, [0, 45], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const logoSpring = spring({
    frame: frame - 30,
    fps,
    config: { damping: 80, stiffness: 150, mass: 0.8 },
  });

  const ctaSpring = spring({
    frame: frame - 70,
    fps,
    config: { damping: 80, stiffness: 150, mass: 0.8 },
  });

  const qrSpring = spring({
    frame: frame - 110,
    fps,
    config: { damping: 80, stiffness: 150, mass: 0.8 },
  });

  const glowPulse = interpolate(
    Math.sin(frame * 0.03),
    [-1, 1],
    [0.4, 0.8]
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeIn,
      }}
    >
      <Particles count={60} color="#10b981" />

      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(16, 185, 129, ${glowPulse * 0.3}) 0%, transparent 60%)`,
          filter: "blur(100px)",
        }}
      />

      <div style={{ textAlign: "center", zIndex: 1 }}>
        <div
          style={{
            fontSize: 90,
            fontWeight: 800,
            color: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            opacity: logoSpring,
            transform: `scale(${interpolate(logoSpring, [0, 1], [0.8, 1])})`,
            textShadow: "0 0 60px rgba(16, 185, 129, 0.6)",
          }}
        >
          encrypt.trade
        </div>
        <div
          style={{
            fontSize: 38,
            fontWeight: 600,
            color: "#10b981",
            fontFamily: "system-ui, -apple-system, sans-serif",
            marginTop: 35,
            opacity: ctaSpring,
            transform: `translateY(${interpolate(ctaSpring, [0, 1], [25, 0])}px)`,
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
            marginTop: 20,
            opacity: ctaSpring,
          }}
        >
          Selective privacy on Solana
        </div>

        <div
          style={{
            marginTop: 60,
            opacity: qrSpring,
            transform: `translateY(${interpolate(qrSpring, [0, 1], [20, 0])}px)`,
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              backgroundColor: "#fff",
              borderRadius: 12,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              color: "#0a0a0a",
              fontWeight: 600,
            }}
          >
            QR CODE
          </div>
          <div
            style={{
              fontSize: 16,
              color: "#555",
              marginTop: 15,
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            Scan to visit encrypt.trade
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 40,
          fontSize: 16,
          color: "#444",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        Privacy Chronicles | glass-wallet-comic.vercel.app
      </div>
    </AbsoluteFill>
  );
};

// Main full-length video
export const GlassWalletVideo: React.FC = () => {
  const INTRO_DURATION = 220;
  const OUTRO_DURATION = 300;

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
          <PageSlide page={page} index={index} totalPages={PAGES.length} />
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

// 60-second cut for social media
export const GlassWalletShort: React.FC = () => {
  const SHORT_PAGES = [0, 2, 5, 6, 8, 11]; // Key story beats
  const FRAMES_PER_SHORT_PAGE = 200; // ~6.6 seconds
  const INTRO_DURATION = 90;
  const OUTRO_DURATION = 150;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <Sequence from={0} durationInFrames={INTRO_DURATION}>
        <IntroSequence />
      </Sequence>

      {SHORT_PAGES.map((pageIndex, i) => (
        <Sequence
          key={i}
          from={INTRO_DURATION + i * FRAMES_PER_SHORT_PAGE}
          durationInFrames={FRAMES_PER_SHORT_PAGE}
        >
          <PageSlide
            page={PAGES[pageIndex]}
            index={i}
            totalPages={SHORT_PAGES.length}
          />
        </Sequence>
      ))}

      <Sequence
        from={INTRO_DURATION + SHORT_PAGES.length * FRAMES_PER_SHORT_PAGE}
        durationInFrames={OUTRO_DURATION}
      >
        <OutroSequence />
      </Sequence>
    </AbsoluteFill>
  );
};

// Vertical version for TikTok/Reels
export const GlassWalletVertical: React.FC = () => {
  const SHORT_PAGES = [0, 2, 5, 6, 8, 11];
  const FRAMES_PER_SHORT_PAGE = 180;
  const INTRO_DURATION = 75;
  const OUTRO_DURATION = 120;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <Sequence from={0} durationInFrames={INTRO_DURATION}>
        <VerticalIntro />
      </Sequence>

      {SHORT_PAGES.map((pageIndex, i) => (
        <Sequence
          key={i}
          from={INTRO_DURATION + i * FRAMES_PER_SHORT_PAGE}
          durationInFrames={FRAMES_PER_SHORT_PAGE}
        >
          <VerticalPageSlide
            page={PAGES[pageIndex]}
            index={i}
            totalPages={SHORT_PAGES.length}
          />
        </Sequence>
      ))}

      <Sequence
        from={INTRO_DURATION + SHORT_PAGES.length * FRAMES_PER_SHORT_PAGE}
        durationInFrames={OUTRO_DURATION}
      >
        <VerticalOutro />
      </Sequence>
    </AbsoluteFill>
  );
};

// Vertical intro for mobile
const VerticalIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 80, stiffness: 150, mass: 0.8 },
  });

  const fadeOut = interpolate(frame, [55, 75], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      <Particles count={40} color="#10b981" />
      <div style={{ textAlign: "center", padding: 40 }}>
        <div
          style={{
            fontSize: 18,
            fontWeight: 500,
            color: "#10b981",
            marginBottom: 15,
            letterSpacing: 3,
            textTransform: "uppercase",
            opacity: titleSpring,
          }}
        >
          Privacy Chronicles
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#ffffff",
            opacity: titleSpring,
            letterSpacing: -2,
            lineHeight: 1.1,
          }}
        >
          The Glass Wallet
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Vertical page slide for mobile
const VerticalPageSlide: React.FC<{
  page: (typeof PAGES)[0];
  index: number;
  totalPages: number;
}> = ({ page, index, totalPages }) => {
  const frame = useCurrentFrame();
  const DURATION = 180;

  const scale = interpolate(frame, [0, DURATION], [1.15, 1]);
  const opacity = interpolate(frame, [0, 20, DURATION - 30, DURATION], [0, 1, 1, 0]);
  const textOpacity = interpolate(frame, [20, 40, DURATION - 40, DURATION - 20], [0, 1, 1, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <Particles count={20} color="#10b981" />

      <AbsoluteFill style={{ opacity, transform: `scale(${scale})` }}>
        <Img
          src={staticFile(page.image)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 40%, transparent 70%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 30,
          right: 30,
          opacity: textOpacity,
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: "#fff",
            marginBottom: 10,
            textShadow: "0 2px 20px rgba(0,0,0,0.8)",
          }}
        >
          {page.title}
        </div>
        <div style={{ fontSize: 20, color: "#aaa" }}>{page.subtitle}</div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 30,
          right: 30,
          height: 3,
          backgroundColor: "rgba(255,255,255,0.2)",
          borderRadius: 2,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${((index + 1) / totalPages) * 100}%`,
            backgroundColor: "#10b981",
            borderRadius: 2,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// Vertical outro for mobile
const VerticalOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeIn,
      }}
    >
      <Particles count={40} color="#10b981" />
      <div style={{ textAlign: "center", padding: 40 }}>
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "#fff",
            textShadow: "0 0 40px rgba(16, 185, 129, 0.5)",
          }}
        >
          encrypt.trade
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 600,
            color: "#10b981",
            marginTop: 20,
          }}
        >
          Privacy isn't hiding.
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 600,
            color: "#10b981",
          }}
        >
          It's choosing.
        </div>
      </div>
    </AbsoluteFill>
  );
};
