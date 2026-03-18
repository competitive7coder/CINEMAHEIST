import React from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const FooterWrapper = styled.footer`
  background: #000000;
  border-top: 1px solid rgba(255,255,255,0.06);
  font-family: 'Poppins', sans-serif;
  color: rgba(255,255,255,0.5);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #ff0000, transparent);
    opacity: 0.6;
  }
`;

const Inner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 64px 40px 32px;

  @media (max-width: 768px) {
    padding: 48px 24px 28px;
  }
`;

const TopRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 32px;
  padding-bottom: 48px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  margin-bottom: 48px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const BrandBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const BrandName = styled(Link)`
  text-decoration: none;
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: -1px;
  color: #fff;
  display: inline-block;

  span { color: #ff0000; }

  &:hover span {
    background: linear-gradient(90deg, #ff0000, #ff6060, #ff0000);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: ${shimmer} 1.5s linear infinite;
  }
`;

const Tagline = styled.p`
  font-size: 0.82rem;
  color: rgba(255,255,255,0.3);
  margin: 0;
  letter-spacing: 0.3px;
`;

const SocialRow = styled.ul`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: #14141460;
  border-radius: 30px;
  padding: 10px 15px;
  height: 70px;
  width: 300px;
  list-style: none;
  margin-left: auto;
  margin-right: 0;
  margin-bottom: 0;

  @media (max-width: 768px) {
    justify-content: center;
    margin-left: auto;
    margin-right: auto;
  }
`;

const SocialItem = styled.li`
  margin: 0 10px;
  position: relative;

  .tooltip {
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #fff;
    color: #000;
    padding: 6px 10px;
    border-radius: 5px;
    opacity: 0;
    visibility: hidden;
    font-size: 14px;
    transition: all 0.3s ease;
    font-weight: bold;
    white-space: nowrap;
    pointer-events: none;
  }

  &:hover .tooltip {
    opacity: 1;
    visibility: visible;
    top: -50px;
  }

  .link {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    color: #fff;
    background-color: #000;
    transition: all 0.3s ease-in-out;
    text-decoration: none;

    svg {
      width: 30px;
      height: 30px;
      fill: currentColor;
    }

    &:hover { box-shadow: 3px 2px 45px 0px rgb(0 0 0 / 12%); }
    &[data-social="facebook"]:hover { color: #00a2ff; }
    &[data-social="instagram"]:hover { color: #ff009d; }
    &[data-social="twitter"]:hover { color: #686868; }
    &[data-social="youtube"]:hover { color: #ff0000; }
  }
`;

const MidGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr) 2fr;
  gap: 40px;
  padding-bottom: 48px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  margin-bottom: 32px;

  @media (max-width: 992px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 576px) { grid-template-columns: 1fr 1fr; gap: 28px; }
`;

const LinkGroup = styled.div``;

const GroupTitle = styled.h6`
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.85);
  margin-bottom: 16px;
`;

const FooterLink = styled(Link)`
  display: block;
  font-size: 0.84rem;
  color: rgba(255,255,255,0.35);
  text-decoration: none;
  margin-bottom: 10px;
  transition: all 0.2s ease;
  position: relative;
  width: fit-content;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background: #ff0000;
    transition: width 0.2s ease;
  }

  &:hover {
    color: rgba(255,255,255,0.85);
    &::after { width: 100%; }
  }
`;

const AppGroup = styled.div``;

const AppBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 10px 18px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 12px;
  color: #fff;
  text-decoration: none;
  margin-right: 10px;
  margin-bottom: 10px;
  transition: all 0.25s ease;

  &:hover {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.18);
    transform: translateY(-2px);
    color: #fff;
  }

  .icon { font-size: 1.4rem; line-height: 1; color: rgba(255,255,255,0.7); }
  .text small { display: block; font-size: 0.62rem; color: rgba(255,255,255,0.4); letter-spacing: 0.5px; }
  .text strong { display: block; font-size: 0.84rem; font-weight: 700; letter-spacing: 0.3px; color: #fff; }
`;

const BottomBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 576px) { flex-direction: column; text-align: center; }
`;

const Copyright = styled.p`
  font-size: 0.78rem;
  color: rgba(255,255,255,0.2);
  margin: 0;
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const LegalLink = styled(Link)`
  font-size: 0.78rem;
  color: rgba(255,255,255,0.2);
  text-decoration: none;
  transition: color 0.2s;

  &:hover { color: rgba(255,255,255,0.55); }
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <Inner>
        <TopRow>
          <BrandBlock>
            <BrandName to="/">🎬 Stream<span>Hub</span></BrandName>
            <Tagline>Your universe of movies, all in one place.</Tagline>
          </BrandBlock>

          <SocialRow>
            <SocialItem>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" data-social="facebook" className="link" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                  <path d="M29.059 15.085C29.058 7.322 22.764 1.028 15 1.028S0.941 7.323 0.941 15.087c0 6.989 5.1 12.787 11.781 13.875l0.081 0.011V19.15H9.232v-4.065h3.57v-3.096a4.962 4.962 0 0 1 5.329 -5.469l-0.017 -0.001c1.124 0.016 2.212 0.115 3.273 0.292l-0.126 -0.018v3.459h-1.774a2.033 2.033 0 0 0 -2.291 2.204l-0.001 -0.008v2.636h3.899l-0.623 4.065h-3.276v9.823c6.762 -1.101 11.862 -6.899 11.863 -13.888" />
                </svg>
              </a>
              <div className="tooltip">Facebook</div>
            </SocialItem>
            <SocialItem>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" data-social="instagram" className="link" aria-label="Instagram">
                <svg viewBox="0 0 100 100">
                  <path d="M60 45a15 15 0 1 0 -4.395 10.61A14.4 14.4 0 0 0 60 45.225l-0.004 -0.237zm8.1 0a23.006 23.006 0 1 1 -6.738 -16.347 22.2 22.2 0 0 1 6.742 15.96l-0.004 0.41v-0.02zm6.327 -24.022v0.008a5.4 5.4 0 1 1 -1.582 -3.818 5.177 5.177 0 0 1 1.556 3.705v0.11zm-29.4 -12.9 -4.482 -0.03q-4.072 -0.03 -6.184 0t-5.655 0.176a47.143 47.143 0 0 0 -6.312 0.638l0.273 -0.038a23.571 23.571 0 0 0 -4.362 1.136l0.16 -0.052a15.446 15.446 0 0 0 -8.52 8.452l-0.038 0.102a22.543 22.543 0 0 0 -1.065 4.062l-0.02 0.138a45 45 0 0 0 -0.597 5.96l-0.004 0.08q-0.147 3.548 -0.176 5.655t0 6.184 0.03 4.482 -0.03 4.482 0 6.184 0.176 5.655c0.075 2.193 0.292 4.275 0.638 6.312l-0.038 -0.273a23.571 23.571 0 0 0 1.136 4.362l-0.052 -0.16a15.446 15.446 0 0 0 8.452 8.52l0.102 0.038c1.192 0.446 2.606 0.82 4.062 1.065l0.138 0.02c1.758 0.308 3.84 0.525 5.955 0.597l0.08 0.004q3.548 0.147 5.655 0.176t6.184 0l4.455 -0.09 4.482 0.03q4.072 0.03 6.184 0t5.655 -0.176a47.143 47.143 0 0 0 6.312 -0.638l-0.273 0.038a23.571 23.571 0 0 0 4.362 -1.136l-0.16 0.052a15.446 15.446 0 0 0 8.52 -8.452l0.038 -0.102c0.446 -1.192 0.82 -2.606 1.065 -4.062l0.02 -0.138c0.308 -1.758 0.525 -3.84 0.597 -5.955l0.004 -0.08q0.147 -3.548 0.176 -5.655t0 -6.184 -0.03 -4.482 0.03 -4.482 0 -6.184 -0.176 -5.655a47.143 47.143 0 0 0 -0.638 -6.312l0.038 0.273a23.743 23.743 0 0 0 -1.136 -4.362l0.052 0.16a15.446 15.446 0 0 0 -8.452 -8.52l-0.102 -0.038a22.543 22.543 0 0 0 -4.062 -1.065l-0.138 -0.02a45 45 0 0 0 -5.955 -0.597l-0.08 -0.004q-3.548 -0.147 -5.655 -0.176t-6.184 0zM90 45q0 13.418 -0.3 18.574a24.9 24.9 0 0 1 -26.194 26.13l0.06 0.004q-5.157 0.3 -18.574 0.3t-18.574 -0.3A24.9 24.9 0 0 1 0.286 63.514l-0.004 0.06q-0.3 -5.157 -0.3 -18.574t0.3 -18.574A24.9 24.9 0 0 1 26.478 0.297l-0.058 -0.005q5.157 -0.3 18.574 -0.3t18.574 0.3a24.9 24.9 0 0 1 26.13 26.194l0.004 -0.06Q90 31.578 90 45" />
                </svg>
              </a>
              <div className="tooltip">Instagram</div>
            </SocialItem>
            <SocialItem>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" data-social="twitter" className="link" aria-label="Twitter">
                <svg viewBox="0 0 100 100">
                  <path d="M53.564 38.947 87.066 0h-7.941L50.033 33.816 26.801 0H0l35.136 51.137L0 91.977h7.941l30.722 -35.712 24.54 35.712H90L53.561 38.947zM42.686 51.588l-3.56 -5.093L10.8 5.977h12.194l22.86 32.699 3.56 5.093 29.714 42.503H66.935L42.686 51.591z" />
                </svg>
              </a>
              <div className="tooltip">Twitter</div>
            </SocialItem>
            <SocialItem>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" data-social="youtube" className="link" aria-label="YouTube">
                <svg viewBox="0 0 90 90">
                  <path d="M90,25.2c-1.4-5.2-5.5-9.3-10.7-10.7C74.2,13.1,45,13.1,45,13.1s-29.2,0-34.3,1.4C5.5,15.9,1.4,20,0,25.2C-1.4,30.3,0,45,0,45s-1.4,14.7,0,19.8c1.4,5.2,5.5,9.3,10.7,10.7C15.8,77,45,77,45,77s29.2,0,34.3-1.4c5.2-1.4,9.3-5.5,10.7-10.7c1.4-5.2,0-19.8,0-19.8S91.4,30.3,90,25.2z M35.9,57.1V32.9L59.2,45L35.9,57.1z" />
                </svg>
              </a>
              <div className="tooltip">YouTube</div>
            </SocialItem>
          </SocialRow>
        </TopRow>

        <MidGrid>
          <LinkGroup>
            <GroupTitle>Company</GroupTitle>
            <FooterLink to="/about">About Us</FooterLink>
            <FooterLink to="/careers">Careers</FooterLink>
          </LinkGroup>
          <LinkGroup>
            <GroupTitle>Help</GroupTitle>
            <FooterLink to="/faq">FAQ</FooterLink>
            <FooterLink to="/contact">Contact Us</FooterLink>
          </LinkGroup>
          <LinkGroup>
            <GroupTitle>Legal</GroupTitle>
            <FooterLink to="/TermsOfService">Terms of Service</FooterLink>
            <FooterLink to="/PrivacyPolicy">Privacy Policy</FooterLink>
          </LinkGroup>
          <AppGroup>
            <GroupTitle>Get the App</GroupTitle>
            <AppBtn href="#!">
              <span className="icon"><i className="bi bi-apple" /></span>
              <span className="text">
                <small>Download on the</small>
                <strong>App Store</strong>
              </span>
            </AppBtn>
            <AppBtn href="#!">
              <span className="icon"><i className="bi bi-google-play" /></span>
              <span className="text">
                <small>GET IT ON</small>
                <strong>Google Play</strong>
              </span>
            </AppBtn>
          </AppGroup>
        </MidGrid>

        <BottomBar>
          <Copyright>© {new Date().getFullYear()} StreamHub. All Rights Reserved.</Copyright>
          <LegalLinks>
            <LegalLink to="/TermsOfService">Terms</LegalLink>
            <LegalLink to="/PrivacyPolicy">Privacy</LegalLink>
            <LegalLink to="/contact">Contact</LegalLink>
          </LegalLinks>
        </BottomBar>
      </Inner>
    </FooterWrapper>
  );
};

export default Footer;