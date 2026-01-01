import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { useEffect } from 'react';

/**
 * Modern Parallax Background with floating blobs and noise texture
 * Theme: Deep Blue / Cyan Wave to match corporate tech aesthetic
 */
export default function ParallaxBackground() {
    const { scrollY } = useScroll();

    // Mouse interaction
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring animation for mouse following
    const springConfig = { damping: 25, stiffness: 50, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            // Normalize coordinates -1 to 1 (inverted for parallax feel)
            const x = (clientX / innerWidth) - 0.5;
            const y = (clientY / innerHeight) - 0.5;

            mouseX.set(x * 100);
            mouseY.set(y * 100);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    // Parallax transforms based on scroll
    const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
    const y2 = useTransform(scrollY, [0, 1000], [0, -150]);

    // Combined transforms
    const blob1Y = useTransform([springY, y1], ([mouse, scroll]) => mouse + scroll);
    const blob2Y = useTransform([springY, y2], ([mouse, scroll]) => (mouse * -1) + scroll);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Base deepest navy background */}
            <div className="absolute inset-0 bg-[#020617]" />

            {/* Noise texture overlay */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay z-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            {/* Main Cyan Wave - Streaking across center */}
            <motion.div
                className="absolute top-[30%] left-[-10%] w-[120vw] h-[60vw] bg-cyan-500/20 rounded-[100%] blur-[120px] mix-blend-screen"
                style={{
                    x: springX,
                    y: blob1Y,
                    rotate: -15
                }}
                animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.4, 0.6, 0.4]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            />

            {/* Deep Blue Bottom Depth */}
            <motion.div
                className="absolute bottom-[-30%] left-[20%] w-[80vw] h-[60vw] bg-blue-700/20 rounded-full blur-[130px] mix-blend-screen"
                style={{
                    x: useTransform(springX, val => val * -0.5),
                    y: blob2Y
                }}
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            />

            {/* Bright Electric Blue Highlight - Top Right */}
            <motion.div
                className="absolute top-[-20%] right-[-20%] w-[70vw] h-[70vw] bg-sky-500/10 rounded-full blur-[100px] mix-blend-screen"
                style={{
                    x: useTransform(springX, val => val * 0.5),
                    y: useTransform(springY, val => val * 0.5)
                }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            />

            {/* Subtle Cyan Glow */}
            <motion.div
                className="absolute top-[20%] left-[30%] w-[40vw] h-[40vw] bg-cyan-400/10 rounded-full blur-[80px] mix-blend-screen"
                style={{
                    x: useTransform(springX, val => val * 0.8),
                    y: useTransform(springY, val => val * 0.8)
                }}
                animate={{
                    scale: [0.9, 1.1, 0.9],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            />
        </div>
    );
}
