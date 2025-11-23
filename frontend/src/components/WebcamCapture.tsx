import React, { useRef, useEffect } from "react";

interface WebcamCaptureProps {
  onCapture: (imageData: string | null) => void;
  onCancel: () => void;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Request access to the media devices
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Webcam error:", err);
        alert('Error accessing webcam. Please ensure you have a webcam connected and have granted permission.');
        onCancel(); // If camera access fails, effectively cancel the capture flow
      });

    // Cleanup: stop the video stream when the component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [onCancel]); // Include onCancel in dependencies to ensure cleanup can call it if needed

  const handleCapture = () => {
    if (videoRef.current && videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.92); // 0.92 quality for good balance
        
        // Stop the video stream before calling onCapture
        if (videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach((track) => track.stop());
          videoRef.current.srcObject = null;
        }
        
        onCapture(dataUrl);
      } else {
        console.error("Failed to get canvas context");
        alert("Failed to capture image. Please try again.");
      }
    } else {
      console.error("Video not ready for capture");
      alert("Please wait for the camera to initialize before capturing.");
    }
  };

  return (
    <div className="webcam-capture">
      <video ref={videoRef} autoPlay playsInline className="webcam-video" />
      <div className="webcam-buttons">
        <button className="primary-btn" onClick={handleCapture}>Capture</button>
        <button className="secondary-btn" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default WebcamCapture;