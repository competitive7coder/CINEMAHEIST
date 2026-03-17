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

const TermsOfService = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const sections = [
    {
      title: 'Acceptance of Terms',
      content: `By accessing or using StreamHub, you agree to be bound by these Terms of Service and all applicable laws and regulations.`
    },
    {
      title: 'User Accounts',
      content: `You are responsible for maintaining the confidentiality of your account credentials. You must be at least 18 years old to use our service.`
    },
    {
      title: 'Prohibited Conduct',
      content: `You agree not to:
- Use the service for any illegal purpose.
- Attempt to bypass any technical measure we use to access content.
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
      content: `For questions regarding these terms, please contact us at support@streamhub.com.`
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
                <p key={i}>
                  {line.includes('support@streamhub.com') ? (
                    <>
                      For questions regarding these terms, please contact us at{' '}
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

export default TermsOfService;