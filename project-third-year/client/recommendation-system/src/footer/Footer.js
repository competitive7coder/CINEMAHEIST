import React from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";


const glow = keyframes`
  0%, 100% { text-shadow: 0 0 10px rgba(229, 9, 20, 0.5); }
  50% { text-shadow: 0 0 20px rgba(229, 9, 20, 0.8), 0 0 30px rgba(229, 9, 20, 0.4); }
`;

const FooterWrapper = styled.footer`
  background: linear-gradient(to top, #000000, #080808);
  border-top: 1px solid rgba(255, 255, 255, 0.03);
  font-family: 'Inter', 'Poppins', sans-serif;
  color: rgba(255, 255, 255, 0.5);
  padding: 100px 0 40px;
  margin-top: auto;
  position: relative;
  
  /* Top accent line */
  &::before {
    content: '';
    position: absolute;
    top: -1px; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(229, 9, 20, 0.5), transparent);
  }
`;

const Inner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 30px;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 40px;
  margin-bottom: 80px;
  align-items: start;

  @media (max-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
  }
`;

const BrandSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 992px) {
    grid-column: 1 / -1; 
    text-align: center;
    align-items: center;
    margin-bottom: 40px;
  }
`;

const BrandName = styled(Link)`
  text-decoration: none;
  font-size: 2.2rem;
  font-weight: 900;
  letter-spacing: -1.5px;
  color: #fff;
  white-space: nowrap;
  transition: all 0.3s ease;

  span { 
    color: #e50914; 
    animation: ${glow} 3s ease-in-out infinite;
  }

  &:hover {
    transform: scale(1.02);
  }
`;

const Tagline = styled.p`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.35);
  line-height: 1.7;
  max-width: 320px;
  margin: 0;
  font-weight: 400;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 10px;
`;

const SocialIcon = styled.a`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 1.1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: rgba(229, 9, 20, 0.1);
    border-color: rgba(229, 9, 20, 0.4);
    color: #e50914;
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
  }
`;

const LinkGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const GroupTitle = styled.h6`
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #fff;
  margin-bottom: 10px;
  white-space: nowrap;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 0; bottom: -8px;
    width: 20px; height: 2px;
    background: #e50914;
    @media (max-width: 992px) { left: 50%; transform: translateX(-50%); }
  }

  @media (max-width: 992px) { text-align: center; }
`;

const FooterLink = styled(Link)`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.4);
  text-decoration: none;
  transition: all 0.3s ease;
  width: fit-content;

  &:hover {
    color: #fff;
    padding-left: 8px;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  }
  
  @media (max-width: 992px) { 
    width: auto; 
    text-align: center;
    &:hover { padding-left: 0; transform: translateY(-2px); }
  }
`;

const BottomBar = styled.div`
  padding-top: 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    text-align: center;
  }
`;

const Copyright = styled.p`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.25);
  margin: 0;
  font-weight: 300;
`;

const LegalNav = styled.nav`
  display: flex;
  gap: 30px;
  
  @media (max-width: 480px) { gap: 15px; }
`;

const LegalLink = styled(Link)`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.25);
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover { color: #fff; }
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <Inner>
        <MainGrid>
          <BrandSection>
            <BrandName to="/">🎬 Stream<span>Hub</span></BrandName>
            <Tagline>
              The ultimate destination for cinematic explorers. Track, discover, and enjoy your next favorite story in stunning detail.
            </Tagline>
            <SocialLinks>
              <SocialIcon href="#"><i className="bi bi-facebook" /></SocialIcon>
              <SocialIcon href="#"><i className="bi bi-instagram" /></SocialIcon>
              <SocialIcon href="#"><i className="bi bi-twitter-x" /></SocialIcon>
              <SocialIcon href="#"><i className="bi bi-youtube" /></SocialIcon>
            </SocialLinks>
          </BrandSection>

          <LinkGroup>
            <GroupTitle>Explore</GroupTitle>
            <FooterLink to="/movies">All Movies</FooterLink>
            <FooterLink to="/popular">Trending</FooterLink>
            <FooterLink to="/new-releases">New Releases</FooterLink>
          </LinkGroup>

          <LinkGroup>
            <GroupTitle>Account</GroupTitle>
            <FooterLink to="/profile">My Profile</FooterLink>
            <FooterLink to="/watchlist">Watchlist</FooterLink>
            <FooterLink to="/settings">Settings</FooterLink>
          </LinkGroup>

          <LinkGroup>
            <GroupTitle>Company</GroupTitle>
            <FooterLink to="/about">Our Story</FooterLink>
            <FooterLink to="/contact">Contact Us</FooterLink>
            <FooterLink to="/faq">Help Center</FooterLink>
          </LinkGroup>
        </MainGrid>

        <BottomBar>
          <Copyright>© {new Date().getFullYear()} StreamHub. Designed for the big screen.</Copyright>
          <LegalNav>
            <LegalLink to="/PrivacyPolicy">Privacy</LegalLink>
            <LegalLink to="/TermsOfService">Terms</LegalLink>
            <LegalLink to="/cookies">Cookies</LegalLink>
          </LegalNav>
        </BottomBar>
      </Inner>
    </FooterWrapper>
  );
};

export default Footer;