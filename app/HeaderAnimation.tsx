"use client";
import { motion } from "framer-motion";

export default function HeaderAnimation() {
  return (
    <div className="logo-and-title flex items-center gap-4">
      {/* 3D Rotating & Floating Logo */}
      <motion.div
        animate={{ 
          rotateY: 360, 
          y: [0, -10, 0] // Floating effect: အပေါ်အောက် လွင့်နေမယ်
        }}
        transition={{ 
          rotateY: { duration: 5, repeat: Infinity, ease: "linear" },
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{ perspective: "1000px" }}
        whileHover={{ scale: 1.1 }} // Mouse တင်ရင် ကြီးလာမယ်
      >
        <motion.img 
          src="/images/logo.png" 
          alt="KP Logo" 
          style={{ 
            height: '55px', 
            borderRadius: '15px', 
            border: '2px solid #00ff9d',
            cursor: 'pointer'
          }}
          // Glow effect: အလင်းရောင် ဝါးတားတားလေး လင်းနေမယ်
          animate={{ 
            boxShadow: ["0px 0px 5px #00ff9d", "0px 0px 20px #00ff9d", "0px 0px 5px #00ff9d"] 
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Scaling & Color Pulsing Title */}
      <motion.h1
        className="site-title"
        animate={{ 
          scale: [1, 1.05, 1],
          textShadow: ["0px 0px 0px #00ff9d", "0px 0px 10px #00ff9d", "0px 0px 0px #00ff9d"]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        style={{ color: "#00ff9d", fontWeight: "bold" }}
      >
        KP SHOP
      </motion.h1>
    </div>
  );
}