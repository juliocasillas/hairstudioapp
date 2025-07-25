import React, { useEffect, useRef } from 'react';

const JCNeonAnimation = () => {
  const jRef = useRef<SVGPathElement>(null);
  const cRef = useRef<SVGPathElement>(null);
  const nameRef = useRef<SVGTextElement>(null);
  const subtitleRef = useRef<SVGTextElement>(null);
  const squareRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const animatePath = (path: SVGPathElement | null, duration: number, delay = 0) => {
      if (!path) return;
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
      path.style.transition = 'none';
      // Force reflow
      path.getBoundingClientRect();
      setTimeout(() => {
        path.style.transition = `stroke-dashoffset ${duration}s ease`;
        path.style.strokeDashoffset = '0';
      }, delay * 1000);
    };

    // Animate JC paths
    animatePath(jRef.current, 2, 0);
    animatePath(cRef.current, 2, 0);

    // Animate texts with staggered delay
    if (nameRef.current) {
      const length = nameRef.current.getComputedTextLength();
      nameRef.current.style.strokeDasharray = `${length}`;
      nameRef.current.style.strokeDashoffset = `${length}`;
      nameRef.current.style.transition = 'none';
      nameRef.current.getBoundingClientRect();
      setTimeout(() => {
        nameRef.current!.style.transition = 'stroke-dashoffset 2.5s ease';
        nameRef.current!.style.strokeDashoffset = '0';
      }, 2.2 * 1000);
    }
    if (subtitleRef.current) {
      const length = subtitleRef.current.getComputedTextLength();
      subtitleRef.current.style.strokeDasharray = `${length}`;
      subtitleRef.current.style.strokeDashoffset = `${length}`;
      subtitleRef.current.style.transition = 'none';
      subtitleRef.current.getBoundingClientRect();
      setTimeout(() => {
        subtitleRef.current!.style.transition = 'stroke-dashoffset 2.5s ease';
        subtitleRef.current!.style.strokeDashoffset = '0';
      }, 3 * 1000);
    }

    // Animate square after 17 seconds delay
    if (squareRef.current) {
      const length = squareRef.current.getTotalLength();
      squareRef.current.style.strokeDasharray = `${length}`;
      squareRef.current.style.strokeDashoffset = `${length}`;
      squareRef.current.style.opacity = '0';
      squareRef.current.style.transition = 'none';
      squareRef.current.getBoundingClientRect();

      setTimeout(() => {
        squareRef.current!.style.opacity = '1';
        squareRef.current!.style.transition = 'stroke-dashoffset 8s linear, opacity 0.3s ease';
        squareRef.current!.style.strokeDashoffset = '0';
      }, 17000);
    }
  }, []);

  return (
    <div className="flex justify-center items-center bg-black h-screen">
      <svg
        viewBox="0 0 400 250"
        role="img"
        aria-label="JC Julio Casillas Hair Studio neon animation with square"
        className="w-[400px] h-[250px]"
      >
        <defs>
          <filter
            id="neon-glow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
            colorInterpolationFilters="sRGB"
          >
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="white" floodOpacity="0.9" />
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="white" floodOpacity="0.6" />
            <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="white" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* JC letters */}
        <path
          id="j"
          ref={jRef}
          d="M 90 40 L 90 120 Q 90 140 50 140"
          stroke="white"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#neon-glow)"
        />
        <path
          id="c"
          ref={cRef}
          d="M 140 50 Q 100 50 100 95 Q 100 140 140 140"
          stroke="white"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#neon-glow)"
        />

        {/* Text lines */}
        <text
          id="name"
          ref={nameRef}
          x="35"
          y="180"
          className="font-semibold text-[22px]"
          stroke="white"
          fill="none"
          filter="url(#neon-glow)"
        >
          Julio Casillas
        </text>

        <text
          id="subtitle"
          ref={subtitleRef}
          x="100"
          y="210"
          className="text-[14px] tracking-wider"
          stroke="white"
          fill="none"
          filter="url(#neon-glow)"
          textAnchor="middle"
        >
          Hair Studio
        </text>

        {/* Square outline */}
        <path
          id="square"
          ref={squareRef}
          d="M 25 160 L 170 160 L 170 30 L 25 30 L 25 220 L 170 220 L 170 160"
          stroke="white"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#neon-glow)"
          style={{ opacity: 0 }}
        />
      </svg>
    </div>
  );
};

export default JCNeonAnimation;