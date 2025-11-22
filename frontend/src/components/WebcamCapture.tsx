import React, { useState, useRef, useCallback } from 'react';

const WebcamCapture: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing webcam: ", err);
      alert('Error accessing webcam. Please ensure you have a webcam connected and have granted permission.');
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImage(dataUrl);
        stopCamera();
      }
    }
  };

  const handleAnalyzeClick = () => {
    if (image) {
      console.log('Base64 Image for Analysis:', image);
      // TODO: Send 'image' (base64 string) to backend/Gemini Vision
    } else {
      alert('Please capture an image first.');
    }
  };

  const resetCapture = () => {
    setImage(null);
    startCamera();
  };

  return (
    <div className="webcam-capture-container">
      <h2>Or use your webcam</h2>
      {!stream && !image && (
        <button onClick={startCamera}>Start Camera</button>
      )}
      {stream && !image && (
        <div className="video-container">
          <video ref={videoRef} autoPlay playsInline muted />
          <button onClick={captureFrame}>Capture Photo</button>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {image && (
        <div className="image-preview">
          <h3>Preview:</h3>
          <img src={image} alt="Skin Selfie" style={{ maxWidth: '300px', maxHeight: '300px' }} />
          <button onClick={handleAnalyzeClick}>Analyze Skin</button>
          <button onClick={resetCapture}>Retake</button>
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;
