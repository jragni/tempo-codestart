/**
 * SuccessAnimation Component
 *
 * @description
 * Animated confetti and celebration effect for problem completion
 */
"use client";

import { useEffect, useState } from 'react';
import { FaTrophy, FaStar, FaCheckCircle } from 'react-icons/fa';

interface SuccessAnimationProps {
  show: boolean;
  onComplete?: () => void;
  problemTitle?: string;
}

export default function SuccessAnimation({
  show,
  onComplete,
  problemTitle = "Problem"
}: SuccessAnimationProps) {
  const [confettiPieces, setConfettiPieces] = useState<number[]>([]);

  useEffect(() => {
    if (show) {
      // Generate confetti pieces
      setConfettiPieces(Array.from({ length: 50 }, (_, i) => i));

      // Auto-hide after animation
      const timer = setTimeout(() => {
        setConfettiPieces([]);
        onComplete?.();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998] animate-fade-in"
        onClick={onComplete}
      />

      {/* Success Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
        <div
          className="card bg-gradient-to-br from-success/95 to-primary/95 shadow-2xl max-w-md w-full mx-4 pointer-events-auto animate-scale-in"
          style={{
            animation: 'scaleIn 0.5s ease-out, float 2s ease-in-out 0.5s infinite'
          }}
        >
          <div className="card-body items-center text-center space-y-6 p-8">
            {/* Trophy Icon with pulse */}
            <div className="relative">
              <div className="absolute inset-0 bg-warning/30 rounded-full animate-ping"></div>
              <div className="relative w-24 h-24 rounded-full bg-warning flex items-center justify-center shadow-xl">
                <FaTrophy className="text-6xl text-warning-content animate-bounce" />
              </div>
            </div>

            {/* Success Message */}
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-white drop-shadow-lg">
                Congratulations! 🎉
              </h2>
              <p className="text-xl text-white/90 font-semibold">
                {problemTitle} Solved!
              </p>
            </div>

            {/* Stars */}
            <div className="flex gap-3 justify-center">
              {[1, 2, 3].map((i) => (
                <FaStar
                  key={i}
                  className="text-3xl text-warning animate-pulse"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    filter: 'drop-shadow(0 0 10px rgba(255, 200, 0, 0.5))'
                  }}
                />
              ))}
            </div>

            {/* Progress Badge */}
            <div className="badge badge-lg badge-warning gap-2 shadow-lg">
              <FaCheckCircle />
              Problem Completed
            </div>

            {/* Close Button */}
            <button
              onClick={onComplete}
              className="btn btn-ghost btn-sm text-white hover:bg-white/20 mt-4"
            >
              Continue Coding
            </button>
          </div>
        </div>
      </div>

      {/* Confetti */}
      {confettiPieces.map((i) => {
        const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const randomLeft = Math.random() * 100;
        const randomDelay = Math.random() * 0.5;
        const randomDuration = 2 + Math.random() * 2;
        const randomRotation = Math.random() * 360;

        return (
          <div
            key={i}
            className="fixed w-3 h-3 z-[9999] pointer-events-none"
            style={{
              left: `${randomLeft}%`,
              top: '-20px',
              backgroundColor: randomColor,
              animation: `confettiFall ${randomDuration}s linear ${randomDelay}s forwards`,
              transform: `rotate(${randomRotation}deg)`,
              borderRadius: Math.random() > 0.5 ? '50%' : '0'
            }}
          />
        );
      })}

      {/* Animations */}
      <style jsx>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes scaleIn {
          0% {
            transform: scale(0.5) translateY(100px);
            opacity: 0;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </>
  );
}
