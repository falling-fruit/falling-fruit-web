# File Structure

The clientside codebase is divided into a few main folders. An overview of significant folders is shown below.

```
 └─ docs/
 └─ public/
 └─ scripts/
 └─ src/
    └─ components/
       └─ ui/
       └─ ...
    └─ constants/
    └─ redux/
    └─ utils/
```

## [`./scripts`](../scripts/)

Contains any scripts for building resources when deploying the site. Currently the `data.js` file handles the 'In the Press' and the 'Share the Harvest' page content generation by pulling from an external CMS.

## [`./src`](../src/)

Contains source code for the client application

### [`./src/components`](../src/components)

React components used in this application. Other groupings of components have their own folders.

#### [`./src/components/ui`](../src/components/ui)

Contains re-usable, "low-level" interface elements used throughout the application. These components are presentational and generally have little to no state.

### [`./src/constants`](../src/constants)

Constants used throughout the application. Files in `./data` are generated by [scripts](../scripts/)

### [`./src/redux`](../src/redux)

Global state management with slices and reduces. Handles mutations to map, filter, authentication, and settings.

### [`./src/utils`](../src/utils)

React Hooks and API wrappers
