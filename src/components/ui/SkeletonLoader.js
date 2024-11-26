import React from 'react'
import styled, { keyframes } from 'styled-components'

const shimmer = keyframes`
    0% {
        background-position: -1000px 0;
    }
    100% {
        background-position: 1000px 0;
    }
`

const SkeletonWrapper = styled.div`
  margin-bottom: 16px;
`

const SkeletonItem = styled.div`
  height: 1rem;
  background-color: #e0e0e0;
  background-image: linear-gradient(
    to right,
    #e0e0e0 0%,
    #f0f0f0 50%,
    #e0e0e0 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 2.5s infinite linear;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  width: ${(props) => props.width || '100%'};

  &:first-child {
    margin-bottom: 20px;
    height: 1.2rem;
  }

  &:last-child {
    margin-bottom: 20px;
  }
`

const SkeletonLoader = ({ count = 3 }) => (
  <SkeletonWrapper>
    {Array.from({ length: count }).map((_, index) => (
      <div key={index}>
        <SkeletonItem width="40%" />
        <SkeletonItem width="80%" />
        <SkeletonItem width="55%" />
        <SkeletonItem width="70%" />
      </div>
    ))}
  </SkeletonWrapper>
)

export default SkeletonLoader
