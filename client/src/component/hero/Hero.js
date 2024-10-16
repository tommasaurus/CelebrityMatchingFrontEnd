import React, { useState, useEffect, useRef } from "react";
import heic2any from 'heic2any';
import imageCompression from 'browser-image-compression';
import axios from "axios";
import {
  Upload,
  FileText,
  Zap,
  Lock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  X,
  ChevronDownCircle,
  ChevronUpCircle,
  Scan,
} from "lucide-react";
import "./Hero.css";
import MatchPopup from "../MatchPopup/MatchPopup";
import Contact from "../contact/Contact";

const Hero = ({ navigateTo }) => {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [matches, setMatches] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showAllMatches, setShowAllMatches] = useState(false);
  const [conversionCount, setConversionCount] = useState(0);
  const [fileSize, setFileSize] = useState(579);
  const [showViewMatchesButton, setShowViewMatchesButton] = useState(false);
  const [matchesLoaded, setMatchesLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);
  const matchesRef = useRef(null);
  const galleryRef = useRef(null);

  const [currentImage, setCurrentImage] = useState(0);
  const [isHoveringCaption, setIsHoveringCaption] = useState(false);
  const carouselImages = [
    { src: "emma.png", name: "Emma Watson" },
    { src: "emily.png", name: "Emily Ratajkowski" },
    { src: "sabrina.png", name: "Sabrina Carpenter" },
  ];

  const [uploadingText, setUploadingText] = useState("Uploading");

  useEffect(() => {
    const fetchConversionCount = async () => {
      try {
        const response = await axios.get(`https://${process.env.REACT_APP_BACKEND_IP}/get-conversion-count`);
        setConversionCount(response.data.conversion_count);
      } catch (error) {
        console.error("Error fetching conversion count:", error);
      }
    };
  
    fetchConversionCount();
  
    // Set interval to fetch updated conversion count from backend every hour
    const interval = setInterval(() => {
      fetchConversionCount();
    }, 3600000); // every hour
  
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval;
    if (uploading) {
      let animationState = 0;
      const animationSequence = [
        "Uploading",
        "Uploading.",
        "Uploading..",
        "Uploading...",
      ];
      interval = setInterval(() => {
        setUploadingText(animationSequence[animationState]);
        animationState = (animationState + 1) % animationSequence.length;
      }, 500);
    }
    return () => clearInterval(interval);
  }, [uploading]);

  const compressAndSetFile = async (fileToCompress) => {
    // console.log("Compressing File Type:", fileToCompress.type);
    // console.log("Compressing File Size:", fileToCompress.size / 1024 / 1024, "MB");
  
    const options = {
      maxSizeMB: 1, // Target size in MB
      maxWidthOrHeight: 1024, // Max width or height in pixels
      useWebWorker: true,
    };
  
    try {
      const compressedFile = await imageCompression(fileToCompress, options);
      // console.log("Compressed File Size:", compressedFile.size / 1024 / 1024, "MB");
  
      setFile(compressedFile);
      setFilePreview(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.error("Error compressing image:", error);
      alert("Failed to compress image. Please try a different image.");
    }
  };

  const handleFileChange = async (event) => {
    if (event.target.files && event.target.files[0]) {
      let uploadedFile = event.target.files[0];
      // console.log("Original File Type:", uploadedFile.type);
      // console.log("Original File Size:", uploadedFile.size / 1024 / 1024, "MB");
  
      // Check if the file is HEIC or HEIF
      if (
        uploadedFile.type === 'image/heic' ||
        uploadedFile.type === 'image/heif' ||
        uploadedFile.name.toLowerCase().endsWith('.heic') ||
        uploadedFile.name.toLowerCase().endsWith('.heif')
      ) {
        try {
          // Convert HEIC to JPEG
          const conversionResult = await heic2any({ blob: uploadedFile, toType: 'image/jpeg' });
  
          // heic2any may return a Blob or an array of Blobs
          let convertedBlob;
          if (Array.isArray(conversionResult)) {
            convertedBlob = conversionResult[0];
          } else {
            convertedBlob = conversionResult;
          }
  
          uploadedFile = new File(
            [convertedBlob],
            uploadedFile.name.replace(/\.[^/.]+$/, ".jpg"),
            { type: 'image/jpeg' }
          );
          // console.log("Converted File Type:", uploadedFile.type);
          // console.log("Converted File Size:", uploadedFile.size / 1024 / 1024, "MB");
        } catch (error) {
          console.error("Error converting HEIC image:", error);
          alert("Failed to process HEIC image. Please try a different image.");
          return;
        }
      }
  
      // Proceed to compress the image
      await compressAndSetFile(uploadedFile);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setFilePreview(URL.createObjectURL(droppedFile));
    }
  };

  const handleDeleteFile = () => {
    setFile(null);
    setFilePreview(null);
    setShowViewMatchesButton(false);
    setMatchesLoaded(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadFile = async () => {
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      setUploading(true);
      setShowViewMatchesButton(false);
      setErrorMessage(""); // Clear any previous error messages
  
      const response = await axios.post(
        `https://${process.env.REACT_APP_BACKEND_IP}/upload-image/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMatches(response.data.matches);
      setShowViewMatchesButton(true);
      setMatchesLoaded(true);
    } catch (error) {
      console.error("Error uploading image:", error);
      if (error.response && error.response.status === 400) {
        setErrorMessage("Upload an image with a face clearly visible");
      } else {
        setErrorMessage("Upload an image with a face clearly visible");
      }
    } finally {
      setUploading(false);
    }
  };
  

  const toggleShowAllMatches = () => {
    setShowAllMatches(!showAllMatches);
  };

  const handleMatchClick = (match) => {
    setSelectedMatch(match);
  };

  const closeMatchPopup = () => {
    setSelectedMatch(null);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % carouselImages.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentImage(
      (prev) => (prev - 1 + carouselImages.length) % carouselImages.length
    );
  };

  const handleCarouselImageClick = async (imageSrc, imageName) => {
    if (!isHoveringCaption) {
      try {
        setUploading(true);
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        const file = new File(
          [blob],
          `${imageName.toLowerCase().replace(" ", "_")}.png`,
          { type: "image/png" }
        );
        setFile(file);
        setFilePreview(URL.createObjectURL(file));
        await handleUploadFile();
      } catch (error) {
        console.error("Error uploading carousel image:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleGalleryClick = () => {
    navigateTo("scroll");
  };

  const scrollToMatches = () => {
    if (matchesRef.current) {
      matchesRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const adjustSimilarity = (similarity) => {    
    const inflatedSimilarity = similarity * 100 * 2;

    // If the inflated similarity exceeds 100, set it to 100
    return inflatedSimilarity > 100 ? 100 : inflatedSimilarity.toFixed(2);
  };

  return (
    <>
      <div className='hero-container'>
        <img src={"/OFlogo.png"} alt='Logo' className='hero-logo' />
        <p className='hero-subtitle'>
          Find your celebrity lookalike
        </p>

        {errorMessage && (
        <div className="error-message-no-picture">
          <p>{errorMessage}</p>
        </div>
        )}

        {!filePreview ? (
          <div className='hero-content'>
            <div className='upload-section'>
              <div
                className={`upload-area ${isDragging ? "dragging" : ""}`}
                onClick={handleUploadClick}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className='upload-icon'>
                  <Upload size={48} />
                </div>
                <p className='upload-text'>Upload your photo</p>
                <p className='upload-subtext'>
                  Click to browse or drag and drop
                </p>
                <input
                  type="file"
                  className="file-input"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/heic,image/heif"
                  style={{ display: "none" }}
                />
              </div>
            </div>

            <div className='or-divider'>
              <div className='or-line'></div>
              <div className='or-text'>OR</div>
              <div className='or-line'></div>
            </div>

            <div className='carousel-section'>
              <div className='carousel'>
                <div
                  className='carousel-item active'
                  onClick={() =>
                    handleCarouselImageClick(
                      carouselImages[currentImage].src,
                      carouselImages[currentImage].name
                    )
                  }
                >
                  <img
                    src={carouselImages[currentImage].src}
                    alt={`Carousel ${currentImage + 1}`}
                    className='carousel-image'
                  />
                  <div
                    className='carousel-caption'
                    onMouseEnter={() => setIsHoveringCaption(true)}
                    onMouseLeave={() => setIsHoveringCaption(false)}
                  >
                    <button className='carousel-btn' onClick={handlePrev}>
                      <ChevronLeft size={24} />
                    </button>
                    <span className='carousel-name'>
                      {carouselImages[currentImage].name}
                    </span>
                    <button className='carousel-btn' onClick={handleNext}>
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='uploaded-image-container'>
            <h3 className='uploaded-image-title'>Your uploaded image:</h3>
            <img
              src={filePreview}
              alt='Uploaded Preview'
              className='uploaded-image'
            />
            <div className='file-name-container'>
              <span className='file-name'>{file.name}</span>
              <button className='delete-file' onClick={handleDeleteFile}>
                <X size={16} />
              </button>
            </div>
          </div>
        )}
        <div className='action-buttons'>
          {file && !filePreview && (
            <div className='selected-file'>
              <span>{file.name}</span>
            </div>
          )}
          {file && (
            <button
              className={`upload-button ${
                matchesLoaded ? "matches-loaded" : ""
              }`}
              onClick={matchesLoaded ? scrollToMatches : handleUploadFile}
              disabled={uploading}
            >
              {uploading
                ? uploadingText
                : matchesLoaded
                ? "Matches"
                : "Find Model"}
            </button>
          )}
        </div>
        <div className='features'>
          <div className='feature'>
            <FileText size={20} />
            <span>No data saved</span>
          </div>
          <div className='feature'>
            <Zap size={20} />
            <span>AI processing</span>
          </div>
          <div className='feature'>
            <Lock size={20} />
            <span>Private & Secure</span>
          </div>
        </div>
        {matches.length > 0 && (
          <div className='top-matches' ref={matchesRef}>
            <h2>Your Top Matches</h2>
            <div className='matches-container'>
              {matches.slice(0, showAllMatches ? 5 : 3).map((match, index) => (
                <div key={index} className={`match match-${index + 1}`}>
                  <img
                    src={match.image_url}
                    alt={`${match.name} preview`}
                    width={300}
                    height={300}
                    onClick={() => handleMatchClick(match)}
                    className='match-image'
                  />
                  <div className='match-content'>
                    <p>{match.name}</p>
                    <p>Similarity: {adjustSimilarity(match.similarity)}%</p>
                  </div>
                </div>
              ))}
            </div>
            {matches.length > 3 && (
              <button
                className='view-more-button'
                onClick={toggleShowAllMatches}
              >
                {showAllMatches ? (
                  <>
                    <ChevronUpCircle size={20} />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDownCircle size={20} />
                    View More
                  </>
                )}
              </button>
            )}
          </div>
        )}
        <div className='stats-container'>
          <div className='conversion-stats'>
            <p>
              We've already converted{" "}
              <span className='animated-number'>
                {conversionCount.toLocaleString()}
              </span>{" "}
              files with a total size of{" "}
              <span className='animated-number'>
                {fileSize.toLocaleString()}
              </span>{" "}
              GB.
            </p>
          </div>
          <div className='gallery-stats'>
            <p>
              View our gallery with{" "}
              <span className='animated-number'>100,000+</span> images{" "}
              <button className='gallery-button' onClick={handleGalleryClick}>
                Gallery
              </button>
            </p>
          </div>
        </div>

        <div className='instruction-section'>
          <h2 className='instruction-title'>How It Works</h2>
          <div className='instruction-blocks'>
            {[
              {
                icon: <Upload size={32} />,
                title: "Upload a photo",
                description:
                  "Use a clear frontal photo with only one person. Face should be clearly visible for best results.",
              },
              {
                icon: <Scan size={32} />,
                title: "Face Detection",
                description:
                  "Our system detects facial features including eyebrows, eyes, nose, and mouth.",
              },
              {
                icon: <CheckCircle size={32} />,
                title: "Enjoy the result!",
                description:
                  "Our Neural Network compares your face with celebrities and suggests the most similar ones.",
              },
            ].map((instruction, index) => (
              <div key={index} className='instruction-block'>
                <div className='instruction-icon'>{instruction.icon}</div>
                <h3 className='instruction-block-title'>{instruction.title}</h3>
                <p className='instruction-block-description'>
                  {instruction.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className='beta-info-section'>
          <h3 className='beta-info-title'>
            <AlertCircle size={24} /> Beta Version
          </h3>
          <p className='beta-info-text'>
            We're currently in beta, constantly improving our recognition
            algorithm. We're committed to high accuracy and our team works daily
            to refine the system and correct any errors.
          </p>
          <p className='beta-info-highlight'>
            Exciting news: New celebrities added weekly!
          </p>
        </div>

        {selectedMatch && (
          <MatchPopup match={selectedMatch} onClose={closeMatchPopup} />
        )}
      </div>

      <Contact />
    </>
  );
};

export default Hero;
