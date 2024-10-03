import React, { useState, useEffect } from "react";
import { Send } from "lucide-react";
import Confetti from "react-confetti";
import "./Contact.css";
import useContactForm from "./useContactForm.js";

const Contact = () => {
  const {
    formData,
    handleChange,
    handleSubmit,
    isSubmitted,
    submitError,
    isSending,
  } = useContactForm();

  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccessButton, setShowSuccessButton] = useState(false);

  useEffect(() => {
    if (isSubmitted) {
      setShowSuccessButton(true);
      setTimeout(() => setShowSuccessButton(false), 5000);
    }
  }, [isSubmitted]);

  return (
    <div className='contact-page'>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.5}
        />
      )}
      <div className='contact-content'>
        <h1 className='contact-title'>Contact</h1>
        <p className='contact-subtitle'>We'd love to hear from you!</p>
        <form className='contact-form' onSubmit={handleSubmit}>
          <div className='input-wrapper'>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              required
              className='form-input'
              placeholder='Email'
            />
          </div>
          <div className='input-wrapper'>
            <textarea
              name='message'
              value={formData.message}
              onChange={handleChange}
              required
              className='form-input'
              placeholder='Message'
              rows='4'
            />
          </div>
          {showSuccessButton ? (
            <button type='button' className='success-button' disabled>
              Message Sent!
            </button>
          ) : (
            <button
              type='submit'
              className='submit-button'
              disabled={isSending}
            >
              <Send size={20} />
              {isSending ? "Sending..." : "Send Message"}
            </button>
          )}
          {submitError && <div className='error-message'>{submitError}</div>}
        </form>
      </div>
    </div>
  );
};

export default Contact;
