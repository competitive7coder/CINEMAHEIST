import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
// import { BsFacebook, BsInstagram, BsTwitterX, BsYoutube } from 'react-icons/bs'

const FooterWrapper = styled.footer`
  background: linear-gradient(to top, #000000, #080808);
  border-top: 1px solid rgba(255, 255, 255, 0.03);
  font-family: "Inter", "Poppins", sans-serif;
  color: rgba(255, 255, 255, 0.5);
  padding: 80px 0 36px;
  min-height: 380px; /* CLS fix — reserves space before fonts/content paint */
  margin-top: auto;
  position: relative;
  &::before {
    content: "";
    position: absolute;
    top: -1px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(229, 9, 20, 0.5),
      transparent
    );
  }
`;

const Inner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 30px;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1.8fr 1fr 1fr;
  gap: 40px;
  margin-bottom: 60px;
  min-height: 240px; /* CLS fix — prevents grid collapse before content loads */
  align-items: start;
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const BrandSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const BrandName = styled(Link)`
  text-decoration: none;
  font-family: "Bebas Neue", sans-serif;
  font-size: 2.2rem;
  font-weight: 400;
  letter-spacing: 0.06em;
  color: #fff;
  white-space: nowrap;
  transition: all 0.3s ease;
  span {
    color: #e50914;
  }
  &:hover {
    opacity: 0.85;
  }
`;

const Disclaimer = styled.p`
  font-family: "Libre Baskerville", serif;
  font-size: 0.85rem;
  color: rgba(242, 237, 228, 0.3);
  line-height: 1.75;
  max-width: 340px;
  margin: 0;
  font-weight: 400;
`;

const DisclaimerHighlight = styled.span`
  color: rgba(255, 255, 255, 0.42);
  font-weight: 500;
`;

// const SocialLinks = styled.div`
//   display: flex;
//   gap: 10px;
//   margin-top: 4px;
// `;

// const SocialIcon = styled.a`
//   width: 38px; height: 38px;
//   border-radius: 10px;
//   background: rgba(255, 255, 255, 0.03);
//   border: 1px solid rgba(255, 255, 255, 0.07);
//   display: flex; align-items: center; justify-content: center;
//   color: rgba(255, 255, 255, 0.35);
//   font-size: 1rem;
//   transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//   &:hover {
//     background: rgba(229, 9, 20, 0.1);
//     border-color: rgba(229, 9, 20, 0.4);
//     color: #e50914;
//     transform: translateY(-4px);
//     box-shadow: 0 8px 20px rgba(0,0,0,0.4);
//   }
// `;

const LinkGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const GroupTitle = styled.h6`
  font-family: "JetBrains Mono", monospace;
  font-size: 0.6rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: #fff;
  margin-bottom: 8px;
  position: relative;
  padding-bottom: 1rem;
  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 20px;
    height: 1px;
    background: #e50914;
  }
`;

const FooterLink = styled(Link)`
  font-family: "Libre Baskerville", serif;
  font-size: 0.82rem;
  color: rgba(242, 237, 228, 0.4);
  text-decoration: none;
  transition: all 0.25s ease;
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 6px;
  &:hover {
    color: rgba(242, 237, 228, 0.9);
    padding-left: 6px;
  }
`;

const LegalBadge = styled.span`
  font-size: 0.55rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  background: rgba(229, 9, 20, 0.12);
  border: 1px solid rgba(229, 9, 20, 0.2);
  color: #e50914;
  border-radius: 4px;
  padding: 1px 5px;
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.04);
  margin-bottom: 28px;
`;

const BottomBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.p`
  font-family: "JetBrains Mono", monospace;
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  color: rgba(242, 237, 228, 0.18);
  margin: 0;
  font-weight: 300;
  line-height: 1.6;
`;

const LegalNav = styled.nav`
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  @media (max-width: 480px) {
    gap: 12px;
  }
`;

const LegalLink = styled(Link)`
  font-family: "JetBrains Mono", monospace;
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  color: rgba(242, 237, 228, 0.2);
  text-decoration: none;
  transition: color 0.25s ease;
  &:hover {
    color: #e50914;
  }
`;

const LegalLinkExternal = styled.a`
  font-family: "JetBrains Mono", monospace;
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  color: rgba(242, 237, 228, 0.2);
  text-decoration: none;
  transition: color 0.25s ease;
  &:hover {
    color: #e50914;
  }
`;

const Dot = styled.span`
  color: rgba(255, 255, 255, 0.1);
  font-size: 0.6rem;
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <Inner>
        <MainGrid>
          {/* Brand + Legal Disclaimer */}
          <BrandSection>
            <BrandName to="/">
              STREAM<span>HUB</span>
            </BrandName>
            <Disclaimer>
              StreamHub does not host, upload, or store any video content. All
              streams are served by{" "}
              <DisclaimerHighlight>
                independent third-party embed providers
              </DisclaimerHighlight>
              . StreamHub is a search and discovery platform using the TMDB API
              for metadata only. For copyright concerns:{" "}
              <DisclaimerHighlight>
                dmca.streamhub@proton.me
              </DisclaimerHighlight>
            </Disclaimer>
            {/* <SocialLinks>
              <SocialIcon href="#" aria-label="Facebook"><BsFacebook /></SocialIcon>
              <SocialIcon href="#" aria-label="Instagram"><BsInstagram /></SocialIcon>
              <SocialIcon href="#" aria-label="Twitter"><BsTwitterX /></SocialIcon>
              <SocialIcon href="#" aria-label="YouTube"><BsYoutube /></SocialIcon>
            </SocialLinks> */}
          </BrandSection>

          {/* Browse */}
          <LinkGroup>
            <GroupTitle>Browse</GroupTitle>
            <FooterLink to="/">Home</FooterLink>
            <FooterLink to="/popular">Trending</FooterLink>
            <FooterLink to="/watchlist">My Watchlist</FooterLink>
            <FooterLink to="/profile">Profile</FooterLink>
            <FooterLink to="/faq">FAQ</FooterLink>
            <FooterLink to="/contact">Contact Us</FooterLink>
          </LinkGroup>

          {/* Legal */}
          <LinkGroup>
            <GroupTitle>Legal</GroupTitle>
            <FooterLink to="/dmca">
              DMCA Policy <LegalBadge>Important</LegalBadge>
            </FooterLink>
            <FooterLink to="/privacy">Privacy Policy</FooterLink>
            <FooterLink to="/terms">Terms of Use</FooterLink>
            <FooterLink to="/disclaimer">Disclaimer</FooterLink>
          </LinkGroup>
        </MainGrid>

        <Divider />

        <BottomBar>
          <Copyright>
            © {new Date().getFullYear()} StreamHub. Metadata provided by{" "}
            <DisclaimerHighlight>TMDB</DisclaimerHighlight>. Not affiliated with
            TMDB, Netflix, or any content provider.
          </Copyright>
          <LegalNav>
            <LegalLink to="/dmca">DMCA</LegalLink>
            <Dot>•</Dot>
            <LegalLink to="/privacy">Privacy</LegalLink>
            <Dot>•</Dot>
            <LegalLink to="/terms">Terms</LegalLink>
            <Dot>•</Dot>
            <LegalLink to="/disclaimer">Disclaimer</LegalLink>
            <Dot>•</Dot>
            <LegalLinkExternal
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Powered by TMDB
            </LegalLinkExternal>
          </LegalNav>
        </BottomBar>
      </Inner>
    </FooterWrapper>
  );
};

export default Footer;
