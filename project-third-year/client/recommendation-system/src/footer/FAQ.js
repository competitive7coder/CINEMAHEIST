import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const glow = keyframes`
  0% { text-shadow: 0 0 5px #00ffff, 0 0 10px #ff00ff; }
  50% { text-shadow: 0 0 10px #ff00ff, 0 0 20px #ffff00; }
  100% { text-shadow: 0 0 5px #00ffff, 0 0 10px #ff00ff; }
`;

const FaqSectionWrapper = styled.section`
  padding: 80px 45px;
  background-color: #05080fff;
  color: #caceced0;
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  margin-bottom: 3rem;
  text-align: center;
 /* background: linear-gradient(90deg, #00ffff, #ff00ff, #ffff00, #00ffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${glow} 3s ease-in-out infinite;*/
`;

const AccordionWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
`;
const AccordionItemWrapper = styled.div`
  background: #111928b1;
  border-radius: 10px;
  border-bottom: ${({ $isLast }) => ($isLast ? 'none' : '1px solid rgba(255, 255, 255, 0.1)')};
  margin-bottom: ${({ $isLast }) => ($isLast ? '0' : '1rem')};
`;

const AccordionHeader = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1.5rem;
  background: transparent;
  border: none;
  text-align: left;
  color: #caceced0;
  font-size: clamp(1.2rem, 2.5vw, 1.5rem);
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const AccordionIcon = styled.span`
  font-size: 1.5rem;
  font-weight: 300;
  color: #caceced0;
  transition: transform 0.3s ease;
  transform: ${({ open }) => (open ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

const AccordionContent = styled.div`
  max-height: ${({ open }) => (open ? '500px' : '0')};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
  background-color: #0a0f18;
`;

const AccordionAnswer = styled.p`
  padding: 1.5rem;
  margin: 0;
  color: #ccc;
  font-size: clamp(1rem, 2.5vw, 1.1rem);
  line-height: 1.6;
`;

const faqData = [
  {
    question: 'How do movie rentals work?',
    answer:
      'Once you rent a movie, you have 30 days to start watching it. After you start watching, you have 48 hours to finish it. You can watch the movie as many times as you like within this 48-hour window.'
  },
  {
    question: 'What is "Early Access"?',
    answer:
      'Early Access allows you to rent new-release movies that are still in theaters or have just left. This gives you the chance to watch them at home, often weeks or months before they are available on subscription streaming services.'
  },
  {
    question: 'What devices can I watch on?',
    answer:
      'You can watch StreamHub on your computer, smartphone, tablet, and smart TV. Our web app is fully responsive, and we also have native apps for iOS, Android, and popular smart TV platforms.'
  },
  {
    question: 'Do I need a subscription?',
    answer:
      'No! StreamHub is a pay-as-you-go service. You only pay for the movies you want to rent. There are no monthly subscription fees.'
  },
  {
    question: 'What video quality is available?',
    answer:
      'Most of our movies are available in Full HD (1080p) and 4K Ultra HD with HDR. The available quality may vary depending on the movie and your internet connection speed.'
  },
  {
    question: 'Can I download movies to watch offline?',
    answer:
      'Yes! On our mobile (iOS and Android) and tablet apps, you can download most rented movies to watch later without an internet connection. Perfect for flights or commutes.'
  }
];

// ---------- FAQ ITEM COMPONENT ----------
const FaqItem = ({ item, index, openIndex, setOpenIndex, $isLast }) => {
  const isOpen = index === openIndex;

  const toggleOpen = () => {
    setOpenIndex(isOpen ? null : index);
  };

  return (
    <AccordionItemWrapper $isLast={$isLast}>
      <AccordionHeader onClick={toggleOpen}>
        {item.question}
        <AccordionIcon open={isOpen}>{isOpen ? '−' : '+'}</AccordionIcon>
      </AccordionHeader>
      <AccordionContent open={isOpen}>
        <AccordionAnswer>{item.answer}</AccordionAnswer>
      </AccordionContent>
    </AccordionItemWrapper>
  );
};

// ---------- MAIN FAQ COMPONENT ----------
const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <FaqSectionWrapper id="faq">
      <SectionTitle className='text-danger'>Frequently Asked Questions</SectionTitle>
      <AccordionWrapper>
        {faqData.map((item, index) => (
          <FaqItem
  key={index}
  item={item}
  index={index}
  openIndex={openIndex}
  setOpenIndex={setOpenIndex}
  $isLast={index === faqData.length - 1}
/>

        ))}
      </AccordionWrapper>
    </FaqSectionWrapper>
  );
};

export default FaqSection;
