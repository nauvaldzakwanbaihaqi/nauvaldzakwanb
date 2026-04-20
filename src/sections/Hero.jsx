import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Float, Lightformer } from "@react-three/drei";
import { Planet } from "../components/Planet";
import { useMediaQuery } from "react-responsive";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";

const Hero = () => {
  const isMobile = useMediaQuery({ maxWidth: 853 });
  const text = `I help growing brands and startups gain an
unfair advantage through premium
results driven webs/apps`

  return (
    <section
      id="home"
      className="relative flex flex-col justify-end min-h-screen"
    >
      <AnimatedHeaderSection subTitle={'404 BUGS NOT FOUND'} title={'Nauval Dzakwan'} text={text} />
      <figure className="absolute inset-0 -z-10">
        <Canvas
          shadows
          camera={{ position: [0, 0, 10], fov: 35, near: 1, far: 20 }}
        >
          <ambientLight intensity={0.5} />
          <Suspense>
            <Float speed={0.5}>
              <Planet scale={isMobile ? 1.0 : 1.4} />
            </Float>
            <Environment preset="city" resolution={256}>
              <group rotation={[-Math.PI / 3, 4, 1]}>
                <Lightformer
                  form={"circle"}
                  intensity={2}
                  position={[0, 5, -9]}
                  scale={10}
                />
                <Lightformer
                  form={"circle"}
                  intensity={2}
                  position={[0, 3, 1]}
                  scale={10}
                />
                <Lightformer
                  form={"circle"}
                  intensity={2}
                  position={[-5, -1, -1]}
                  scale={10}
                />
                <Lightformer
                  form={"circle"}
                  intensity={2}
                  position={[10, 1, 0]}
                  scale={16}
                />
              </group>
            </Environment>
          </Suspense>
        </Canvas>
      </figure>
    </section>
  );
};

export default Hero;
