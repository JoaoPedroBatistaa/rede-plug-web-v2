// components/LoadingOverlay.tsx
import React from "react";
import Lottie from "react-lottie";
import animationData from "../../../public/animation/Animation - 1710953246441.json";

interface LoadingOverlayProps {
  isLoading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
  if (!isLoading) {
    return null;
  }

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000, // Garantir que esteja acima de outros elementos
      }}
    >
      <div
        style={{
          width: "128px",
          height: "128px",
          borderRadius: "70px", // Ajuste conforme necessário
          overflow: "hidden",
        }}
      >
        <Lottie options={defaultOptions} height={128} width={128} />
      </div>
    </div>
  );
};

export default LoadingOverlay;
