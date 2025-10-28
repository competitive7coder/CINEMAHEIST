import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

// ---------- KEYFRAMES ----------
const glow = keyframes`
  0% { text-shadow: 0 0 5px #00ffff, 0 0 10px #ff00ff; }
  50% { text-shadow: 0 0 10px #ff00ff, 0 0 20px #ffff00; }
  100% { text-shadow: 0 0 5px #00ffff, 0 0 10px #ff00ff; }
`;

// ---------- STYLED COMPONENTS ----------
const PolicyContainermain = styled.main`
  max-width: 100vw;
  background-color: #05080fff;
  
`;
const PolicyContainer = styled.div`
  padding: 4rem 2rem;
  max-width: 900px;
  margin: 0 auto;
  color: #ccc;
  font-family: 'Arial', sans-serif;
  background: #05080fff;
`;

const PolicyTitle = styled.h1`
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 900;
  text-align: center;
  margin-bottom: 2rem;
  /*color: #fff;*/ /*Applied bootstrap class text-danger instead
  background: linear-gradient(90deg, #00ffff, #ff00ff, #ffff00, #00ffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${glow} 3s ease-in-out infinite;
  */
`;

const AccordionSection = styled.div`
  margin-bottom: 1rem;
  border-radius: 10px;
  overflow: hidden;
  background: #111928b1;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const AccordionHeader = styled.div`

  padding: 1rem 1.5rem;
  font-size: clamp(1.2rem, 2.5vw, 1.5rem);
  font-weight: 600;
  color: #caceced0;
  cursor: pointer;
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.3s;
    &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const AccordionContent = styled.div`
  padding: .4rem 2rem;
  font-size: 1rem;
  color: #ccc;
  line-height: 1.7;
  max-height: ${({ open }) => (open ? '1000px' : '0')};
  overflow: hidden;
  transition: max-height 0.4s ease, padding 0.3s ease;
   & {
    background: #05080fff;
  }
`;

const AccordionArrow = styled.span`
  transition: transform 0.3s ease;
  transform: ${({ open }) => (open ? 'rotate(90deg)' : 'rotate(0deg)')};
`;

const LinkStyled = styled.a`
  color: #0d6efd;
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    color: #00ffff;
  }
`;

// ---------- COMPONENT ----------
const PrivacyPolicy = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const sections = [
    {
      title: 'Introduction',
      content: `StreamHub respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our service.`
    },
    {
      title: 'Information We Collect',
      content: `We may collect the following types of information:
      - Account information such as your name, email, and password.
      - Usage data, including movies you watch and your preferences.
      - Payment information for processing subscriptions and rentals.`
    },
    {
      title: 'How We Use Your Information',
      content: `Your information is used to provide and improve our services, including:
      - Personalizing your movie recommendations.
      - Processing payments and managing your account.
      - Sending important updates or offers (you may opt-out anytime).`
    },
    {
      title: 'Sharing Your Information',
      content: `We do not sell your personal information. We may share data with trusted service providers to help operate our service, but they are required to keep your data secure.`
    },
    {
      title: 'Cookies & Tracking',
      content: `We use cookies and similar technologies to enhance your browsing experience and analyze usage patterns. You can manage your cookie preferences in your browser settings.`
    },
    {
      title: 'Your Rights',
      content: `You have the right to access, update, or delete your personal data. You can also unsubscribe from communications at any time.`
    },
    {
      title: 'Contact Us',
      content: `If you have questions about this Privacy Policy, please contact us at ${' '}
      <LinkStyled href="mailto:support@streamhub.com">support@streamhub.com</LinkStyled>.`
    },
  ];

  return (
    <PolicyContainermain>
        <PolicyContainer>
      <PolicyTitle id='PrivacyPolicy' className='text-danger'>Privacy Policy</PolicyTitle>
      {sections.map((section, index) => (
        <AccordionSection key={index}>
          <AccordionHeader onClick={() => toggleAccordion(index)}>
            {section.title}
            <AccordionArrow open={openIndex === index}>▶</AccordionArrow>
          </AccordionHeader>
          <AccordionContent open={openIndex === index}>
            {section.content.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </AccordionContent>
        </AccordionSection>
      ))}
    </PolicyContainer>
    </PolicyContainermain>
    
  );
};

export default PrivacyPolicy;
