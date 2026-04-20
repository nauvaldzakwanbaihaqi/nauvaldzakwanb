import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { AnimatedTextLines } from "../components/AnimatedTextLines";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import gsap from "gsap";

const About = () => {
  const text =
    "True digital craftsmanship exists at the intersection of aesthetic minimalism and technical complexity. By adhering to the principles of clean architecture, every solution is built to be as maintainable as it is powerful. It is a commitment to creating digital assets that don't just function, but thrive under the pressure of rapid scaling.";
  const aboutText = `
As a freelance web developer, I help businesses turn ideas into reliable digital solutions.

• Fullstack web development
  Build modern, responsive websites and applications from frontend to backend, tailored to your needs.
• DevOps & cloud deployment
  Set up automated workflows and deploy your projects securely to the cloud for maximum uptime.
• Security and performance optimization
  Ensure your site runs fast and stays protected from threats with best practices and regular audits.
`;

  const imgRef = useRef(null);

  useGSAP(() => {
    gsap.to("#about", {
      scale: 0.95,
      scrollTrigger: {
        trigger: "#about",
        start: "bottom 80%",
        end: "bottom 20%",
        scrub: true,
      },
      ease: "power1.inOut",
    });

    if (imgRef.current) {
      gsap.set(imgRef.current, {
        y: 50,
        opacity: 0,
      });
      gsap.to(imgRef.current, {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: imgRef.current,
          start: "top 80%",
        },
      });
    }
  });

  return (
    <section id="about" className="min-h-screen bg-black rounded-b-4xl">
      <AnimatedHeaderSection
        subTitle={"Precision Logic, Fluid Experience, Structural Integrity"}
        title={"About Me"}
        text={text}
        textColor={"text-white"}
        withScrollTrigger={true}
      />
      <div className="flex flex-col items-center justify-between gap-16 px-10 pb-16 text-xl font-light tracking-wide lg:flex-row md:text-2xl lg:text-3xl text-white/60">
        <img
          ref={imgRef}
          src="images/Foto Bebas.jpg"
          alt="man"
          className="w-md rounded-3xl"
        />
        <AnimatedTextLines text={aboutText} className={"w-full text-2xl"} />
      </div>
    </section>
  );
};

export default About;
