import { transparentize } from 'polished'
import { useEffect, useRef, useState } from 'react'
import Select, { createFilter } from 'react-select'
import Creatable from 'react-select/creatable'
import styled from 'styled-components/macro'

import { validatedColor } from './GlobalStyle'

const SelectParent = styled.div`
  font-size: 1rem;

  .select__clear-indicator {
    // TODO: style this properly. Needs to only be headerText on hover
    // color: ${({ theme }) => theme.headerText};
  }

  .select__indicator-separator {
    // TODO: height is not right for some selects
  }

  .select__dropdown-indicator {
    // TODO: style this properly. Needs to only be headerText on hover
    // color: ${({ theme }) => theme.headerText};
  }

  .select__control {
    border: 1px solid ${validatedColor()};
    border-radius: 0.375em;
    box-shadow: none;
    cursor: pointer;

    &:hover {
      border-color: ${({ theme }) => theme.text};
    }
    &--is-focused {
      outline: 2px solid ${({ theme }) => theme.blue} !important;
    }
  }

  .select__input {
    font-family: ${({ theme }) => theme.fonts};
    color: ${({ theme }) => theme.secondaryText};
  }

  .select__placeholder {
    color: ${({ theme }) => theme.text};
  }

  .select__single-value {
    color: ${({ theme }) => theme.secondaryText};
  }

  .select__multi-value {
    background-color: ${({ theme }) => theme.transparentOrange};
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px 10px;

    &__label {
      color: ${({ theme }) => theme.tag.access};
      padding: 0;
    }

    &__remove {
      padding: 0;
      margin-inline-start: 0.25rem;
      border-radius: 50%;
      cursor: pointer;
      margin-block-end: -1px;
      color: ${({ theme }) => theme.secondaryText};

      :hover {
        color: ${({ theme }) => theme.red};
        background-color: ${({ theme }) => transparentize(0.8, theme.red)};
      }
    }
  }

  .select__menu {
    div:not(:last-child) {
      border-block-end: 1px solid ${({ theme }) => theme.secondaryBackground};
    }
  }

  .select__option {
    display: flex;
    align-items: center;
  }
`
const StyledSelect = SelectParent.withComponent(Select)
const StyledCreatableSelect = SelectParent.withComponent(Creatable)

const INITIAL_VISIBLE_COUNT = 100
const INCREMENT = 100

const InfiniteMenuList = ({ children, maxHeight = '300px' }) => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)
  const loadMoreRef = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < children.length) {
          setVisibleCount((prev) => Math.min(prev + INCREMENT, children.length))
        }
      },
      { threshold: 0.1 },
    )

    const currentRef = loadMoreRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [children.length, visibleCount])

  return (
    <div
      style={{
        overflowY: 'auto',
        maxHeight,
      }}
    >
      {Array.isArray(children) ? children.slice(0, visibleCount) : children}
      {Array.isArray(children) && visibleCount < children.length && (
        <div ref={loadMoreRef} style={{ height: 1 }} />
      )}
    </div>
  )
}

const SelectWrapper = ({ isVirtualized, menuMaxHeight, ...props }) => (
  <StyledSelect
    components={
      isVirtualized
        ? {
            MenuList: (listProps) => (
              <InfiniteMenuList {...listProps} maxHeight={menuMaxHeight} />
            ),
          }
        : {}
    }
    classNamePrefix="select"
    // Reduces typing lag
    filterOption={createFilter({ ignoreAccents: false })}
    placeholder=""
    isMulti
    {...props}
  />
)

const CreatableSelectWrapper = ({
  isVirtualized,
  menuMaxHeight,
  onCreateOption,
  ...props
}) => (
  <StyledCreatableSelect
    components={
      isVirtualized
        ? {
            MenuList: (listProps) => (
              <InfiniteMenuList {...listProps} maxHeight={menuMaxHeight} />
            ),
          }
        : {}
    }
    classNamePrefix="select"
    // Reduces typing lag
    filterOption={createFilter({ ignoreAccents: false })}
    placeholder=""
    onCreateOption={onCreateOption}
    isMulti
    {...props}
  />
)

export {
  CreatableSelectWrapper as CreatableMultiSelect,
  SelectWrapper as MultiSelect,
}
