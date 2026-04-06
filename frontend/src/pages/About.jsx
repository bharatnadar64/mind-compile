import React from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const About = () => {
  return (
    <>
      <section className="min-h-screen bg-black text-green-400 font-mono px-6 sm:px-10 lg:px-20 relative overflow-hidden py-16">
        {/* Background scanlines */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.15) 3px)",
          }}
        />

        {/* Ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,255,0,0.08),transparent_60%)]" />

        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
          {/* Event Info */}
          <div className="space-y-6 lg:pr-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-widest text-green-400 drop-shadow-[0_0_15px_#00ff00]">
              About MindCompile
            </h1>

            <p className="text-green-500/70 text-sm sm:text-base lg:text-lg leading-relaxed">
              MindCompile is{" "}
              <strong>SIESCOMS’ flagship blind coding event</strong>, designed
              to test logic, precision, and problem-solving under pressure.
              Unlike regular coding competitions, participants must write
              error-free code without running or debugging, relying entirely on
              their understanding of concepts and syntax.
            </p>

            <p className="text-green-500/70 text-sm sm:text-base lg:text-lg leading-relaxed">
              Across three intense rounds, only those with real coding skills
              will succeed. Vibecoders won’t survive. MindCompile is where every
              line of code matters, and only true programmers rise to the
              challenge.
            </p>
          </div>

          {/* Team Lead Info */}
          <div className="space-y-6 lg:pl-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-widest text-green-400 drop-shadow-[0_0_10px_#00ff00]">
              Event In-Charge
            </h2>

            <div className="border border-green-500/30 bg-black/60 backdrop-blur-md p-6 shadow-[0_0_25px_rgba(0,255,0,0.15)]">
              <p className="text-green-400 text-lg sm:text-xl lg:text-2xl tracking-wide mb-2">
                Bharat Nadar
              </p>
              <p className="text-green-500/60 text-sm sm:text-base lg:text-lg leading-relaxed">
                Bharat Nadar leads the MindCompile event with meticulous
                planning and precision. As the head of this flagship blind
                coding challenge, he ensures every round is intense, fair, and
                tests the true coding abilities of each participant. Under his
                guidance, only real programmers thrive.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom scanline */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-40 animate-pulse" />
      </section>
    </>
  );
};

export default About;
