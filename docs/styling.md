---
title: Styling Guidelines
rank: 3
---
## Detecting mobile vs. desktop

FF’s frontend is a progressive web app, which means that the same website is compatible with both desktop and mobile devices.

Although most UI components are designed to be reusable across both platforms, writing styles and functionality for a specific platform is inevitable because of different layouts and features.

To write styles specific to a platform, use media queries. Standard media queries for each platform are exported from ``.

```
```

To write platform-specific functionality, use the `useIsDesktop()` and `useIsMobile()` hooks exported from ``.

## Colors and sizes

A standard set of colors is exported from ``. These are accessible through the theme when using styled components:

```
```
