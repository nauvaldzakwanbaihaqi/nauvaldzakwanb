import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

export const AnimatedTextLines = ({ text, className }) => {
  const containerRef = useRef(null);
  const linesRefs = useRef([]);
  const lines = text.split("\n").filter((line) => line.trim() !== "");

  useGSAP(() => {
    if (linesRefs.current.length > 0) {
      gsap.from(linesRefs.current, {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        ease: "back.out",
        scrollTrigger: {
          trigger: containerRef.current,
        },
      });
    }
  });

  return (
    <div ref={containerRef} className={className}>
      {lines.map((line, index) => {
        return (
          <span
            key={index}
            ref={(el) => (linesRefs.current[index] = el)}
            className="block leading-relaxed tracking-wide text-pretty"
          >
            {line}
          </span>
        );
      })}
    </div>
  );
};
