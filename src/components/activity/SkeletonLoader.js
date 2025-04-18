import React from 'react'
import Skeleton from 'react-loading-skeleton'
import styled from 'styled-components'

const SkeletonWrapper = styled.div`
  margin-bottom: 16px;
`

const SkeletonGroup = styled.div`
  margin-bottom: 20px;
`

const SkeletonLoader = ({ count = 3 }) => (
  <SkeletonWrapper>
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonGroup key={index}>
        <Skeleton width="40%" height={20} style={{ marginBottom: 8 }} />
        <Skeleton width="80%" height={20} style={{ marginBottom: 8 }} />
        <Skeleton width="55%" height={20} style={{ marginBottom: 8 }} />
        <Skeleton width="70%" height={20} />
      </SkeletonGroup>
    ))}
  </SkeletonWrapper>
)

export default SkeletonLoader
