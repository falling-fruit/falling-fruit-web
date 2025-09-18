# Styling Guidelines

## Styled Components

Styled Components makes it easy to tie CSS to an individual component. It’s also easy to write conditional styles that change based on that component’s props.

Because we use styled-components, you should not write CSS in imported styledsheets. Use inline styles very sparingly (only when creating another styled component seems excessive).

The theme is accessible to all styled components and (contains constants for colors and media queries)[https://github.com/falling-fruit/falling-fruit-web/blob/main/src/components/ui/GlobalStyle.js].

## Reach UI

FF’s UI is designed from scratch, without relying on more opinionated UI frameworks like Material or Semantic. However, we still use a UI framework called Reach UI to provide an accessible, functional base for many of our components. Reach components are minimally styled out of the box, and can be easily styled with styled-components.

When adding new components, be sure to check if Reach can provide a suitable base. Most of our components built on Reach are located in [`/components/ui`](https://github.com/falling-fruit/falling-fruit-web/blob/main/src/components/ui).

## Detecting mobile vs. desktop

FF’s frontend is a progressive web app, which means that the same website is compatible with both desktop and mobile devices.

Although most UI components are designed to be reusable across both platforms, writing styles and functionality for a specific platform is inevitable because of different layouts and features.

To write platform-specific functionality, use the `useIsDesktop()` and `useIsMobile()` hooks exported from [`utils/useBreakpoint.js`](https://github.com/falling-fruit/falling-fruit-web/blob/main/src/utils/useBreakpoint.js).

## Colors

A standard set of colors is exported from [`utils/GlobalStyle`]. These are accessible through the theme:

```
  border: 2px ${({ theme }) => theme.orange} solid;
```

Avoid using inline colors.

## Sizes

For font sizing, always use `rem`. For other measurements that don't need to scale, use `px`.
