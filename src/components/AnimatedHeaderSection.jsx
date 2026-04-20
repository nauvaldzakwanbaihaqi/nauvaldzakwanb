import React from 'react'
import gsap from "gsap";
import { useRef } from 'react';
import { useGSAP } from "@gsap/react";
import { AnimatedTextLines } from "../components/AnimatedTextLines";

const AnimatedHeaderSection = ({ subTitle, title, text, textColor, withScrollTrigger = false }) => {
    const contextRef = useRef(null);
    const headerRef = useRef(null);
    
    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: withScrollTrigger 
            ? {trigger : contextRef.current }
            : undefined
        });
        tl.from(contextRef.current, {
            y: "50vh",
            duration: 1,
            ease: "circ.out",
        });
        tl.from(
            headerRef.current,
            {
                opacity: 0,
                y: "200",
                duration: 1,
                ease: "circ.out",
            },
            "<+0.2",
        );
    }, []);
    return (
        <div ref={contextRef}>
            <div style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}>
                <div ref={headerRef} className="flex flex-col justify-center pt-16">
                    {/* Spacing antara label dan nama pakai mb, bukan gap di parent,
                    supaya h1 bisa mepet langsung ke border di bawahnya */}
                    <p className={`mb-10 sm:mb-14 text-sm font-light tracking-[0.5rem] uppercase px-10 ${textColor}`}>
                        {subTitle}
                    </p>

                    {/* overflow-hidden memotong descender space (ruang kosong di bawah baseline huruf)
                    sehingga bagian bawah teks pas menyentuh border di bawahnya */}
                    <div className="px-10">
                        <h1 className={`${textColor} uppercase banner-text-responsive`}>
                            {title}
                        </h1>
                    </div>

                    <div className={`relative px-10 ${textColor}`}>
                        {/* Garis border yang ingin ditempel oleh teks nama di atasnya */}
                        <div className="absolute inset-x-0 border-t-4" />
                        <div className="pt-6 pb-10 sm:pt-8 sm:pb-12 text-end">
                            <AnimatedTextLines
                                text={text}
                                className={`font-light uppercase value-text-responsive ${text}`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AnimatedHeaderSection