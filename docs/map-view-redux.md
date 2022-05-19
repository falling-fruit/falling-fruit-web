# Map View Mechanics & Integration with Redux

## Dependencies

- [`google-map-react`](https://github.com/google-map-react/google-map-react)
  - Our primary wrapper around Google Maps that converts the native maps API into a React component
  - Supports rendering arbitrary
  - [Vendor docs](https://github.com/google-map-react/google-map-react/blob/master/API.md), [pt 2](https://github.com/google-map-react/google-map-react/blob/master/DOC.md)
- [`redux-toolkit`](https://redux-toolkit.js.org/tutorials/quick-start)
  - We use Redux to hold the view state of the map since it needs to be accessible by many parts of the app
  - Redux Toolkit is an abstraction around Redux with helpers for common tasks. Reduces a lot of boilerplate with using traditional Redux
  - One abstraction is `createAsyncThunk` which automatically dispatch `pending` and `succeeded` actions from any asynchronous request
    - e.g. We use this to wrap fetching locations and clusters, so that the `pending` action can signal that the map is loading

## Relevant files

- [`components/map/Map.js`](https://github.com/falling-fruit/falling-fruit-web/blob/main/src/components/map/Map.js)
  - Thin wrapper around `google-map-react`'s map component
- [`components/map/MapPage.js`](https://github.com/falling-fruit/falling-fruit-web/blob/main/src/components/map/MapPage.js)
  - Connects to the Redux store
  - Populates `Map` with locations and cluster data from Redux
- [`redux/mapSlice.js`](https://github.com/falling-fruit/falling-fruit-web/blob/main/src/redux/mapSlice.js)
  - Actions and reducers for changing internal view state of map (center and zoom)
  - Actions for fetching locations and clusters from API
  - Actions for various map actions
- [`redux/viewChange.js`](https://github.com/falling-fruit/falling-fruit-web/blob/main/src/redux/viewChange.js#L1)
  - Primary event handler that gets called when the map loads or is moved by the user
  - Dispatched in `MapPage` and given the new view of the map
  - Dispatches other actions in `mapSlice` like storing the new view, fetching location and cluster data, and fetching counts for the type filter

## How the `GoogleMapReact` component is controlled

Usage:

```javascript
<GoogleMapReact
  ...
  center={view.center}
  zoom={view.zoom}
  onChange={onViewChange}
  ...
>
```

`GoogleMapReact` is a [controlled component](https://reactjs.org/docs/forms.html#controlled-components). This means that the view state is always driven by the `center` and `zoom` props passed to it.

`onChange` is called in two cases:

1. **The user moves the map**

When the user moves the map, `onChange` is called with the new **view state**. The view state object looks like this:

```
{
  center: { lat, lng }, // current map center
  zoom: 4, // current map zoom
  bounds: { nw, se, sw... }, // map corners in lat lng
  size: { width, height... } // map size in px
}
```

Although the view change handler gives the bounds of the visible map back to us, notice that they are **not required** as props. This is because `center` and `zoom` uniquely determine the bounds of the map anyway.

2. **We explicitly change `center` and/or `zoom`** (e.g. user clicks on cluster, user clicks on coordinates in sidebar to re-center on location)

However, when we explicitly change `center` and/or `zoom`, `onChange` will still be called, presumably so that we can receive the new bounds. This is useful because we can update the bounds of the map in our state, and pass them to the API to fetch new clusters and locations.

Contrast this with a traditional controlled form component, like an `input` with `value` and `onChange`. If we explicitly change `value`, `onChange` is not called again with the `value` we pass it.

## Map callback lifecycle

(For tracking Redux actions in general, highly recommend downloading the [Redux Devtools extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en))

1. Page loads

   1. We explicitly pass the default center and zoom, or the center and zoom as parsed from the URL if it is available
   2. Because we explicitly passed the center and zoom, `GoogleMapReact` calls `onChange` to provide us with the map bounds
   3. `Map` calls `onViewChange`
   4. `MapPage` dispatches [`viewChangeAndFetch`](https://github.com/falling-fruit/falling-fruit-web/blob/de03705a7a82d8587aabc070b3aae193a861caf2/src/redux/viewChange.js#L81) with the new view
      1. Updates URL
      2. Stops map tracking geolocation if user moved too far from current location
      3. **Stores the new view in Redux state**
         1. [`viewChange`](https://github.com/falling-fruit/falling-fruit-web/blob/e15c7abb2c95a701f1f093b83d2043c7e6a8b8a9/src/redux/mapSlice.js#L69) action, not to be confused with `viewChangeAndFetch` (this should be renamed)
         2. Stored in [`map.view`](https://github.com/falling-fruit/falling-fruit-web/blob/e15c7abb2c95a701f1f093b83d2043c7e6a8b8a9/src/redux/mapSlice.js#L51)
      4. Fetches filter counts if the filter is open

2. User moves the map

   1. Same as in _Step 1_, except `GoogleMapReact` calls `onChange` on its own because the user moved the map

3. User clicks a cluster

   1. `Map` calls `onClusterClick`
   2. `MapPage` dispatches [`clusterClick`](https://github.com/falling-fruit/falling-fruit-web/blob/e15c7abb2c95a701f1f093b83d2043c7e6a8b8a9/src/redux/mapSlice.js#L149) action in `mapSlice.js`
   3. `clusterClick` zooms in by changing the zoom part of the internal view state
   4. A new `zoom` is explicitly passed to `GoogleMapReact`, so `GoogleMapReact` calls `onChange`
   5. ...continue as in _Step 1_

4. Other app-initiated actions are same as _Step 3_.

   Direct changes to the internal view state (the center and zoom passed to `GoogleMapReact`) are always initiated by `viewChangeAndFetch` in `viewChange.js` or other reducers in `mapSlice.js`.
