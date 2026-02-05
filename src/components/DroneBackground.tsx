import { useEffect, useState } from "react";

interface Drone {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  direction: number;
}

const DroneBackground = () => {
  const [drones, setDrones] = useState<Drone[]>([]);

  useEffect(() => {
    const initialDrones: Drone[] = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 20 + Math.random() * 30,
      speed: 0.02 + Math.random() * 0.03,
      opacity: 0.03 + Math.random() * 0.05,
      direction: Math.random() * Math.PI * 2,
    }));
    setDrones(initialDrones);

    const interval = setInterval(() => {
      setDrones((prev) =>
        prev.map((drone) => {
          let newX = drone.x + Math.cos(drone.direction) * drone.speed;
          let newY = drone.y + Math.sin(drone.direction) * drone.speed;
          let newDirection = drone.direction;

          // Bounce off edges smoothly
          if (newX < -5 || newX > 105) {
            newDirection = Math.PI - newDirection;
            newX = Math.max(-5, Math.min(105, newX));
          }
          if (newY < -5 || newY > 105) {
            newDirection = -newDirection;
            newY = Math.max(-5, Math.min(105, newY));
          }

          // Add slight random movement
          newDirection += (Math.random() - 0.5) * 0.02;

          return {
            ...drone,
            x: newX,
            y: newY,
            direction: newDirection,
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0d1d35] to-[#0a1628]" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34, 211, 238, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 211, 238, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating drones */}
      {drones.map((drone) => (
        <div
          key={drone.id}
          className="absolute transition-transform duration-1000 ease-linear"
          style={{
            left: `${drone.x}%`,
            top: `${drone.y}%`,
            opacity: drone.opacity,
            transform: `rotate(${(drone.direction * 180) / Math.PI + 45}deg)`,
          }}
        >
          <svg
            width={drone.size}
            height={drone.size}
            viewBox="0 0 100 100"
            fill="none"
            className="text-cyan-400"
          >
            {/* Drone body */}
            <ellipse cx="50" cy="50" rx="12" ry="8" fill="currentColor" />
            
            {/* Arms */}
            <line x1="50" y1="50" x2="20" y2="20" stroke="currentColor" strokeWidth="3" />
            <line x1="50" y1="50" x2="80" y2="20" stroke="currentColor" strokeWidth="3" />
            <line x1="50" y1="50" x2="20" y2="80" stroke="currentColor" strokeWidth="3" />
            <line x1="50" y1="50" x2="80" y2="80" stroke="currentColor" strokeWidth="3" />
            
            {/* Propellers */}
            <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" />
            <circle cx="80" cy="20" r="10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" />
            <circle cx="20" cy="80" r="10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" />
            <circle cx="80" cy="80" r="10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" />
          </svg>
        </div>
      ))}

      {/* Ambient glow spots */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/[0.03] rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-400/[0.02] rounded-full blur-3xl" />
    </div>
  );
};

export default DroneBackground;
