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
 /* background: linear-gradient(90deg, #00ffff, #ff00ff, #ffff00, #00ffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${glow} 3s ease-in-out infinite;*/
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
  padding: 0.4rem 2rem;
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
const TermsOfService = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const sections = [
    {
      title: 'Acceptance of Terms',
      content: `By accessing or using StreamHub, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, you may not use our service.`
    },
    {
      title: 'User Accounts',
      content: `You must create an account to access certain features. Keep your login credentials secure. You are responsible for all activity on your account.`
    },
    {
      title: 'Content Usage',
      content: `All content available on StreamHub is for personal, non-commercial use. You may not redistribute, reproduce, or modify our content without explicit permission.`
    },
    {
      title: 'Subscriptions & Payments',
      content: `If you subscribe to premium services, you agree to provide accurate payment information. All fees are non-refundable unless required by law.`
    },
    {
      title: 'Prohibited Activities',
      content: `You may not:
- Attempt to hack or disrupt our services.
- Use bots or automation to access content.
- Share your account with unauthorized users.`
    },
    {
      title: 'Limitation of Liability',
      content: `StreamHub is provided "as is." We are not liable for any damages or losses arising from your use of the service.`
    },
    {
      title: 'Changes to Terms',
      content: `We may update these Terms of Service from time to time. Continued use of the service constitutes acceptance of the updated terms.`
    },
    {
      title: 'Contact Us',
      content: `For questions regarding these terms, please contact us at ${' '}
      <LinkStyled href="mailto:support@streamhub.com">support@streamhub.com</LinkStyled>.`
    },
  ];

  return (
    <PolicyContainermain>
      <PolicyContainer>
        <PolicyTitle id='TermsOfService' className='text-danger'>Terms of Service</PolicyTitle>
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

export default TermsOfService;
