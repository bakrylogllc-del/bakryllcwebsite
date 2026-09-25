"use client";
import React, { useRef, useEffect, useState, useId } from "react";
import { motion } from "motion/react";

export const TextHoverEffect = ({
  text,
  duration,
  align = "center",
}: {
  text: string;
  duration?: number;
  align?: "center" | "left";
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });
  
  const id = useId().replace(/:/g, "");
  const gradientId = `textGradient_${id}`;
  const maskId = `revealMask_${id}`;
  const textMaskId = `textMask_${id}`;

  // --- التعديل السحري هنا --- 👇
  // بدل ما نثبت رقم، بنحسب العرض بناءً على عدد الحروف.
  // كل حرف هياخد حوالي 25 وحدة عرض، وبنزود مسافة أمان على الأطراف.
  const characterWidth = 22; 
  const calculatedWidth = text.length * characterWidth + 20; 
  // بنثبت الارتفاع والـ fontSize عشان الفونت ميبقاش "ممطوط"
  const calculatedHeight = 80;
  const currentViewBox = `0 0 ${calculatedWidth} ${calculatedHeight}`;
  // ------------------------- 👆

  const textX = align === "left" ? "2%" : "50%";
  const textAnchor = align === "left" ? "start" : "middle";

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      // التعديل: بنستخدم الـ ViewBox الديناميكي
      viewBox={currentViewBox} 
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      // overflow-visible عشان أي توهج على الأطراف ميبانش إنه مقطوع
      className="select-none overflow-visible"
      preserveAspectRatio={align === "left" ? "xMinYMid meet" : "xMidYMid meet"}
    >
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          {hovered && (
            <>
              <stop offset="0%" stopColor="#C6B28A" />
              <stop offset="50%" stopColor="#55624A" />
              <stop offset="100%" stopColor="#2A2A2A" />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id={maskId}
          gradientUnits="userSpaceOnUse"
          // التعديل: مساحة نور أكبر تغطي الحروف الأكبر
          r="25%" 
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>

        <mask id={textMaskId}>
          <rect x="0" y="0" width="100%" height="100%" fill={`url(#${maskId})`} />
        </mask>
      </defs>

      <text
        x={textX}
        y="50%"
        textAnchor={textAnchor}
        dominantBaseline="middle"
        strokeWidth="0.5"
        //fontSize ثابت، الفونت مش هيتمط بزيادة
        fontSize="36" 
        className="fill-transparent stroke-[#111111] font-sans font-bold"
        style={{ opacity: hovered ? 0.7 : 0 }}
      >
        {text}
      </text>

      <motion.text
        x={textX}
        y="50%"
        textAnchor={textAnchor}
        dominantBaseline="middle"
        strokeWidth="0.5"
        fontSize="36"
        className="fill-transparent stroke-[#111111] font-sans font-bold"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{ strokeDashoffset: 0, strokeDasharray: 1000 }}
        transition={{ duration: 4, ease: "easeInOut" }}
      >
        {text}
      </motion.text>

      <text
        x={textX}
        y="50%"
        textAnchor={textAnchor}
        dominantBaseline="middle"
        stroke={`url(#${gradientId})`}
        strokeWidth="0.5"
        fontSize="36"
        mask={`url(#${textMaskId})`}
        className="fill-transparent font-sans font-bold"
      >
        {text}
      </text>
    </svg>
  );
};