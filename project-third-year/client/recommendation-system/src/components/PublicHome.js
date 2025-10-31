import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import styled, { keyframes } from "styled-components";

// ---------------- ANIMATIONS ----------------
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeInScale = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const floatCard = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

// ---------------- STYLED COMPONENTS ----------------
const PageWrapper = styled.div`
  background-color: #000000ff;
  overflow-x: hidden;
`;

const HeroContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 4rem 2rem;
`;

const HeroText = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  animation: ${fadeInUp} 1s ease-out;
`;

const gradientMove = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 5vw, 3.8rem);
  font-weight: 700;
  margin-bottom: 1rem;
 background: linear-gradient(90deg, #00ffff, #ff00ff, #ffff00, #00ffff);
  background-size: 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${gradientMove} 6s linear infinite;
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.6), 0 0 10px rgba(255, 0, 255, 0.6);
`;

const HeroSubtitle = styled.p`
padding-top: 0.5rem;
  font-size: clamp(1.4rem, 2.5vw, 1.6rem); /* increased min, preferred, and max size */
  max-width: 500px;
  color: #d3d0d0ff;
  font-weight: 500;
`;


const PosterCollage = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 15px;
  transform: rotate(5deg) scale(1.1);
  height: 350px;
  animation: ${fadeInScale} 1.2s ease-out;
`;

const PosterImage = styled.img`
  width: 80%;   
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &.poster1 { grid-column: 1 / 3; grid-row: 1 / 2; }
  &.poster2 { grid-column: 2 / 4; grid-row: 1 / 2; }

  &:hover {
    transform: scale(1.05); // add hover zoom
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.6);
  }
`;


const FeatureTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  margin-bottom: 1rem;
  position: relative;
  z-index: 2;
  text-align: center;
`;

const HowItWorksSection = styled.section`
  padding: 80px 45px;
  color: white;

  .col {
    overflow: visible !important;
  }
`;

const HowItWorksCard = styled.div`
  background: rgba(16, 24, 39, 0.7);
  backdrop-filter: blur(10px);
  padding: 2.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  height: 100%;
  text-align: center;
  position: relative;
  overflow: visible;
  animation: ${fadeInUp} 1s ease-out both, ${floatCard} 6s ease-in-out infinite;
  animation-delay: ${(props) => props.delay || "0s"};
  transition: transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease;
  will-change: transform;

  &:hover {
    cursor: pointer;
    transform: scale(1.2) translateY(20px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
    border-color: rgba(255, 255, 255, 0.4);
    z-index: 3;
  }
`;

const StepNumber = styled.div`
  position: absolute;
  right: 1.5rem;
  top: 0.5rem;
  font-size: 6rem;
  font-weight: 800;
  line-height: 1;
  color: rgba(255, 255, 255, 0.05);
  z-index: 1;
`;

const HowItWorksIcon = styled.i`
  font-size: 3.5rem;
  color: #0d6efd;
  margin-bottom: 1.5rem;
  text-shadow: 0 0 15px rgba(13, 110, 253, 0.4);
  position: relative;
  z-index: 2;
`;

const HowItWorksTitle = styled.h3`
  font-size: clamp(1.3rem, 3vw, 1.5rem);
  font-weight: 600;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 2;
`;

const HowItWorksText = styled.p`
  font-size: clamp(1rem, 2.5vw, 1.1rem);
  color: #aaa;
  max-width: 300px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const FinalCtaSection = styled.section`
  padding: 80px 40px;
  background-color: transparent;
  text-align: center;
  color: white;
`;

const HeroButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const ButtonShadow = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: hsl(226, 25%, 69%);
  border-radius: 8px;
  filter: blur(2px);
  will-change: transform;
  transform: translateY(2px);
  transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
`;

const ButtonEdge = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border-radius: 8px;
`;

const ButtonFront = styled.span`
  display: block;
  position: relative;
  border-radius: 8px;
  padding: 16px 32px;
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-size: 1rem;
  transform: translateY(-4px);
  transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
`;

const PushableButton = styled(Link)`
  position: relative;
  background: transparent;
  padding: 0;
  border: none;
  cursor: pointer;
  outline-offset: 4px;
  transition: filter 250ms;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  text-decoration: none;
  display: inline-block;

  &:hover {
    filter: brightness(110%);
  }
  &:hover ${ButtonFront} {
    transform: translateY(-6px);
    transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
  }
  &:active ${ButtonFront} {
    transform: translateY(-2px);
    transition: transform 34ms;
  }
  &:hover ${ButtonShadow} {
    transform: translateY(4px);
    transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
  }
  &:active ${ButtonShadow} {
    transform: translateY(1px);
    transition: transform 34ms;
  }

  &.btn-color-primary ${ButtonFront} {
    background: hsl(211, 100%, 50%);
  }
  &.btn-color-primary ${ButtonEdge} {
    background: linear-gradient(
      to right,
      hsl(211, 100%, 30%) 0%,
      hsl(211, 100%, 35%) 8%,
      hsl(211, 100%, 35%) 92%,
      hsl(211, 100%, 25%) 100%
    );
  }
  &.btn-color-primary ${ButtonShadow} {
    background: hsl(211, 50%, 60%);
  }

  &.btn-color-secondary ${ButtonFront} {
    background: hsl(210, 20%, 96%);
    color: #333;
  }
  &.btn-color-secondary ${ButtonEdge} {
    background: linear-gradient(
      to right,
      hsl(210, 10%, 60%) 0%,
      hsl(210, 10%, 75%) 8%,
      hsl(210, 10%, 75%) 92%,
      hsl(210, 10%, 55%) 100%
    );
  }
  &.btn-color-secondary ${ButtonShadow} {
    background: hsl(210, 10%, 75%);
  }
`;


const GlowingText = styled.p`
  font-weight: bold;
  font-size: 1.8rem;
  background: linear-gradient(90deg, #00ffff, #ff00ff, #ffff00, #00ffff);
  background-size: 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${gradientMove} 6s linear infinite;
  /*text-shadow: 0 0 5px rgba(0, 255, 255, 0.6), 0 0 10px rgba(255, 0, 255, 0.6);*/
`;

// ---------------- COMPONENT ----------------
const PublicHome = () => {
  const posters = [
    "https://cityonfire.com/wp-content/uploads/2024/11/RIP-Poster.jpg",
    "https://www.tallengestore.com/cdn/shop/products/Extraction-ChrisHemsworth-NetflixHollywoodBlockbusterEnglishMoviePoster_918abf51-4d5f-46af-8e8f-834af68e0d20_large.jpg?v=1589272008",
  ];

  return (
    <PageWrapper>
      <HeroContainer>
        <Container>
          <Row className="align-items-center">
            <HeroText lg={6} md={12}>
              <HeroTitle>Movie rentals on StreamHub</HeroTitle>
              <HeroSubtitle>
                Early Access to new movies, before digital subscription.
              </HeroSubtitle>
            </HeroText>
            <Col lg={6} md={12} className="d-none d-lg-block">
              <PosterCollage>
                <PosterImage
                  src={posters[0]}
                  alt="poster 1"
                  className="poster1"
                />
                <PosterImage
                  src={posters[1]}
                  alt="poster 2"
                  className="poster2"
                />
              </PosterCollage>
            </Col>
          </Row>
        </Container>
      </HeroContainer>

      <HowItWorksSection>
        <Container>
          <FeatureTitle className="mb-5">How StreamHub Works</FeatureTitle>
          <Row>
            <Col md={4} className="mb-4" style={{ overflow: "visible" }}>
              <HowItWorksCard delay="0s">
                <StepNumber>01</StepNumber>
                <HowItWorksIcon className="bi bi-person-plus-fill" />
                <HowItWorksTitle>Create Account</HowItWorksTitle>
                <HowItWorksText>
                  Sign up for free with just an email and password.
                </HowItWorksText>
              </HowItWorksCard>
            </Col>
            <Col md={4} className="mb-4" style={{ overflow: "visible" }}>
              <HowItWorksCard delay="0.2s">
                <StepNumber>02</StepNumber>
                <HowItWorksIcon className="bi bi-eye-fill" />
                <HowItWorksTitle>Browse Movies</HowItWorksTitle>
                <HowItWorksText>
                  Explore thousands of titles across all your favorite genres.
                </HowItWorksText>
              </HowItWorksCard>
            </Col>
            <Col md={4} className="mb-4" style={{ overflow: "visible" }}>
              <HowItWorksCard delay="0.4s">
                <StepNumber>03</StepNumber>
                <HowItWorksIcon className="bi bi-plus-circle-fill" />
                <HowItWorksTitle>Build Your Watchlist</HowItWorksTitle>
                <HowItWorksText>
                  Add any movie to your personal list to watch later.
                </HowItWorksText>
              </HowItWorksCard>
            </Col>
          </Row>
        </Container>
      </HowItWorksSection>

      <FinalCtaSection>
        <div
          style={{
            textAlign: "center",
            color: "#fff",
            padding: "4px"
          }}
        >
          <GlowingText>
            Ready to watch? Log in or create an account to get started.
          </GlowingText>
        </div>

        <HeroButtonContainer>
          <PushableButton to="/login" className="btn-color-primary">
            <ButtonShadow />
            <ButtonEdge />
            <ButtonFront>Log In</ButtonFront>
          </PushableButton>
          <PushableButton to="/signup" className="btn-color-secondary">
            <ButtonShadow />
            <ButtonEdge />
            <ButtonFront>Sign Up</ButtonFront>
          </PushableButton>
        </HeroButtonContainer>
      </FinalCtaSection>
    </PageWrapper>
  );
};

export default PublicHome;
