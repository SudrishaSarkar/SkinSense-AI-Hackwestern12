import React, { useState } from 'react';

const ImageUpload: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // For now, this button will just log the base64 string.
  // Later, it will send the image to Gemini Vision.
  const handleAnalyzeClick = () => {
    if (image) {
      console.log('Base64 Image for Analysis:', image);
      // TODO: Send 'image' (base64 string) to backend/Gemini Vision
    } else {
      alert('Please upload an image first.');
    }
  };

  return (
    <div className="image-upload-container">
      <h2>Upload your skin selfie</h2>
      <input type="file" accept="image/jpeg,image/png" onChange={handleImageChange} />
      {image && (
        <div className="image-preview">
          <h3>Preview:</h3>
          <img src={image} alt="Skin Selfie" style={{ maxWidth: '300px', maxHeight: '300px' }} />
          <button onClick={handleAnalyzeClick}>Analyze Skin</button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;