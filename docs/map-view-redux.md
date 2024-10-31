# Map View Mechanics & Integration with Redux

## Dependencies

- [`google-map-react`](https://github.com/google-map-react/google-map-react)
  - Converts the native Google Maps API into a React component.
  - [Vendor docs](https://github.com/google-map-react/google-map-react/blob/master/API.md), [pt 2](https://github.com/google-map-react/google-map-react/blob/master/DOC.md).
- [`redux-toolkit`](https://redux-toolkit.js.org/tutorials/quick-start)
  - Manages the view state of the map.
  - Includes abstractions like `createAsyncThunk` to handle asynchronous requests, signaling loading states.

## Relevant Files

- [`components/map/MapPage.js`](https://github.com/falling-fruit/falling-fruit-web/blob/main/src/components/map/MapPage.js)
  - Connects to the Redux store and populates `Map` with location and cluster data.
- [`redux/mapSlice.js`](https://github.com/falling-fruit/falling-fruit-web/blob/main/src/redux/mapSlice.js)
  - Actions and reducers for changing internal view state of the map.
  - Actions for fetching locations and clusters from the API.
- [`redux/viewChange.js`](https://github.com/falling-fruit/falling-fruit-web/blob/main/src/redux/viewChange.js#L1)
  - Primary event handler called when the map loads or is moved by the user.
  - Dispatches actions to update the map view and fetch data.

## Map Component Control

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

`GoogleMapReact` is a [controlled component](https://reactjs.org/docs/forms.html#controlled-components), meaning the view state is driven by the `center` and `zoom` props. We set them up initially, and then let the map keep its center and zoom.

## Map Callback Lifecycle

1. **Page Loads**
   1. Default or URL-parsed center and zoom are passed.
   2. `GoogleMapReact` calls `onChange` to provide map bounds.
   3. `MapPage` dispatches actions with the new view:
      - Updates URL.
      - Stops tracking geolocation if the user moved too far.
      - Fetches filter counts if the filter is open.
2. **User Moves the Map**
   - `GoogleMapReact` calls `onChange` with the new view.
3. **User Clicks a Cluster**
   - `Map` calls `onClusterClick`.
   - `MapPage` dispatches `clusterClick` action in `mapSlice.js`:
     - Changes zoom in the internal view state.
     - `GoogleMapReact` calls `onChange` with the new zoom.
4. **Other App-Initiated Actions**
   - Similar to user interactions, actions initiated by the app change the internal view state, triggering `onChange` in `GoogleMapReact`.
