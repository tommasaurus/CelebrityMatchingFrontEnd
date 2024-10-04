// MatchPopup.js

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaYoutube,
  FaImdb,
  FaTiktok,
  FaTwitch,
} from "react-icons/fa";
import { SiOnlyfans } from "react-icons/si";
import { BsGlobe } from "react-icons/bs";
import "./MatchPopup.css";

const MatchPopup = ({ match, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [socialLinks, setSocialLinks] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    // Fetch the social links using the modelId
    const fetchSocialLinks = async () => {
      try {
        const response = await fetch(
          `https://${process.env.REACT_APP_BACKEND_IP}/get-social-links/${match.model_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch social links");
        }
        const data = await response.json();
        setSocialLinks(data.social_links);
      } catch (error) {
        console.error("Error fetching social links:", error);
      }
    };

    if (match.model_id) {
      fetchSocialLinks();
    }
  }, [match.model_id]);

  const adjustSimilarity = (similarity) => {
    // Add 50 to the similarity score
    const inflatedSimilarity = similarity * 100 + 50;

    // If the inflated similarity exceeds 100, set it to 100
    return inflatedSimilarity > 100 ? 100 : inflatedSimilarity.toFixed(2);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for the fade-out animation to complete
  };

  const socialPlatforms = [
    { name: "instagram", icon: FaInstagram, color: "#E1306C" },
    { name: "twitter", icon: FaTwitter, color: "#1DA1F2" },
    { name: "facebook", icon: FaFacebook, color: "#4267B2" },
    { name: "youtube", icon: FaYoutube, color: "#FF0000" },
    { name: "imdb", icon: FaImdb, color: "#F5C518" },
    { name: "onlyfans", icon: SiOnlyfans, color: "#00AFF0" },
    { name: "fansly", icon: BsGlobe, color: "#00AFF0" },
    { name: "tiktok", icon: FaTiktok, color: "#010101" },
    { name: "twitch", icon: FaTwitch, color: "#9146FF" },
    { name: "www", icon: BsGlobe, color: "#4A90E2" }, // General websites
    { name: "onlyfansfree", icon: SiOnlyfans, color: "#00AFF0" },
    { name: "mym", icon: BsGlobe, color: "#00AFF0" },
    { name: "x", icon: FaTwitter, color: "#000000" },
    { name: "other", icon: BsGlobe, color: "#4A90E2" },
  ];

  return (
    <div className={`match-popup-overlay ${isVisible ? "visible" : ""}`}>
      <div className={`match-popup-content ${isVisible ? "visible" : ""}`}>
        <button className='match-popup-close' onClick={handleClose}>
          <X size={"10vh"} color='red' />
        </button>
        <div className='match-popup-image'>
          {match.image_url ? (
            <img
              src={match.image_url}
              alt={`${match.name} full`}
              width={500}
              height={500}
            />
          ) : (
            <p>Loading image...</p>
          )}
        </div>
        <div className='match-popup-info'>
          <h2>{match.name}</h2>
          <p>Similarity: {adjustSimilarity(match.similarity)}%</p>
          <div className='match-popup-social-links'>
            {socialLinks &&
              socialPlatforms.map(
                (platform) =>
                  socialLinks[platform.name] && (
                    <a
                      key={platform.name}
                      href={socialLinks[platform.name]}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <button
                        className='social-button'
                        style={{ backgroundColor: platform.color }}
                      >
                        <platform.icon size={20} />
                        <span>{platform.name}</span>
                      </button>
                    </a>
                  )
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchPopup;
