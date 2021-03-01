import '@reach/tabs/styles.css'

import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@reach/tabs'
import { StyledIconBase } from '@styled-icons/styled-icon'
import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const PageTabs = styled(Tabs)`
  display: flex;
  flex-direction: column;
  height: 100%;

  [data-reach-tab-panels] {
    flex: 1;
    display: flex;

    [data-reach-tab-panel] {
      flex: 1;
    }
  }

  [data-reach-tab-list] {
    display: flex;
    background: ${({ theme }) => theme.background};
    padding-bottom: env(
      safe-area-inset-bottom,
      0
    ); // Moves tab buttons above home bar

    [data-reach-tab] {
      flex: 1;
      text-align: center;
      height: 80px;
      font-size: 10px;
      box-sizing: border-box;
      border-top: 8px solid ${({ theme }) => theme.secondaryBackground};
      border-bottom: none;

      // Remove link styling
      color: inherit;
      text-decoration: inherit;

      ${StyledIconBase} {
        display: block;
        margin: 0 auto;
        height: 32px;
      }

      &:not([data-selected]) {
        ${StyledIconBase} {
          color: ${({ theme }) => theme.secondaryBackground};
        }
      }

      &[data-selected] {
        color: ${({ theme }) => theme.orange};
        border-top-color: ${({ theme }) => theme.orange};

        ${StyledIconBase} {
          color: ${({ theme }) => theme.orange};
        }
      }
    }
  }
`

// See https://github.com/reach/reach-ui/issues/632
// Used to make Reach Tab into a link that interacts with router
const CustomLink = forwardRef((props, ref) => (
  <Link {...props} innerRef={ref} />
))
CustomLink.displayName = 'CustomLink'

const LinkTab = (props) => <Tab as={CustomLink} {...props} />

export { LinkTab, PageTabs, Tab, TabList, TabPanel, TabPanels }
