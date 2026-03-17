import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const glow = keyframes`
  0% { text-shadow: 0 0 5px #00ffff, 0 0 10px #ff00ff; }
  50% { text-shadow: 0 0 10px #ff00ff, 0 0 20px #ffff00; }
  100% { text-shadow: 0 0 5px #00ffff, 0 0 10px #ff00ff; }
`;

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
  animation: ${glow} 3s infinite alternate;
`;

const AccordionSection = styled.div`
  border-bottom: 1px solid #1a1a1a;
  margin-bottom: 0.5rem;
`;

const AccordionHeader = styled.button`
  width: 100%;
  padding: 1.5rem;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 700;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const AccordionArrow = styled.span`
  font-size: 0.8rem;
  transition: transform 0.3s;
  transform: ${({ open }) => (open ? 'rotate(90deg)' : 'rotate(0deg)')};
`;

const AccordionContent = styled.div`
  max-height: ${({ open }) => (open ? '500px' : '0')};
  overflow: hidden;
  transition: max-height 0.4s ease-in-out, padding 0.4s;
  padding: ${({ open }) => (open ? '0 1.5rem 1.5rem' : '0 1.5rem')};
  color: #aaa;
  line-height: 1.6;
`;

const LinkStyled = styled.a`
  color: #ff0000;
  text-decoration: none;
  font-weight: bold;
  &:hover {
    text-decoration: underline;
  }
`;

const PrivacyPolicy = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const sections = [
    {
      title: 'Information We Collect',
      content: `We collect personal information that you provide to us, such as your name, email address, and payment information when you sign up for our services.`
    },
    {
      title: 'How We Use Your Information',
      content: `We use your information to provide and improve our services, process payments, and communicate with you about your account.`
    },
    {
      title: 'Data Security',
      content: `We implement industry-standard security measures to protect your data. Our third-party payment processors are required to keep your data secure.`
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
      content: `If you have questions about this Privacy Policy, please contact us at support@streamhub.com.`
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
                <p key={i}>
                  {line.includes('support@streamhub.com') ? (
                    <>
                      If you have questions about this Privacy Policy, please contact us at{' '}
                      <LinkStyled href="mailto:support@streamhub.com">support@streamhub.com</LinkStyled>.
                    </>
                  ) : line}
                </p>
              ))}
            </AccordionContent>
          </AccordionSection>
        ))}
      </PolicyContainer>
    </PolicyContainermain>
  );
};

export default PrivacyPolicy;