import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="spinner">
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  position: fixed;        /* stay on screen */
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 9999;          /* stay above everything */
  background: #000;       /* optional (remove if you don’t want overlay) */

  .spinner {
    width: 70.4px;
    height: 70.4px;
    --clr: lime;
    --clr-alpha: transparent;
    animation: spinner 1.6s infinite ease;
    transform-style: preserve-3d;
  }

  .spinner > div {
    background-color: var(--clr-alpha);
    height: 100%;
    position: absolute;
    width: 100%;
    border: 3.5px solid var(--clr);
  }

  .spinner div:nth-of-type(1) {
    transform: translateZ(-35.2px) rotateY(180deg);
  }

  .spinner div:nth-of-type(2) {
    transform: rotateY(-270deg) translateX(50%);
    transform-origin: top right;
  }

  .spinner div:nth-of-type(3) {
    transform: rotateY(270deg) translateX(-50%);
    transform-origin: center left;
  }

  .spinner div:nth-of-type(4) {
    transform: rotateX(90deg) translateY(-50%);
    transform-origin: top center;
  }

  .spinner div:nth-of-type(5) {
    transform: rotateX(-90deg) translateY(50%);
    transform-origin: bottom center;
  }

  .spinner div:nth-of-type(6) {
    transform: translateZ(35.2px);
  }

  @keyframes spinner {
    0% {
      transform: rotate(45deg) rotateX(-25deg) rotateY(25deg);
    }
    50% {
      transform: rotate(45deg) rotateX(-385deg) rotateY(25deg);
    }
    100% {
      transform: rotate(45deg) rotateX(-385deg) rotateY(385deg);
    }
  }
`;

export default Loader;
