import React, { useState, useEffect } from 'react'
import { withGoogleMap, withScriptjs, GoogleMap, Marker, Polyline } from 'react-google-maps'
import { useLocation } from 'react-router-dom'

const GoogleMapPolyline = ({ isMarkerShown }) => {
  const data = useLocation()
  const [location, setLocation] = useState([])

  useEffect(() => {
    setLocation(data.state.pathProp)
  })

  return (
    <GoogleMap defaultZoom={14} defaultCenter={{ lat: 19.105402, lng: 72.88542 }}>
      {console.log(`GOOGLE PATH PROPS IN ACTUAL COMP `, JSON.stringify(location))}
      {isMarkerShown && <Marker position={{ lat: -36.73540441, lng: 144.25178598 }} />}
      <Polyline
        path={location}
        options={{
          strokeColor: '#ff2343',
          strokeOpacity: '1.0',
          strokeWeight: 2,
          icons: [
            {
              icon: 'hello',
              offset: '0',
              repeat: '10px',
            },
          ],
        }}
      />
    </GoogleMap>
  )
}

const MapComponent = withScriptjs(withGoogleMap(GoogleMapPolyline))

export default () => (
  <MapComponent
    googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_API}&v=3.exp&libraries=geometry,drawing,places`}
    loadingElement={<div style={{ height: `100%` }} />}
    containerElement={<div style={{ height: '100vh', width: '100vw' }} />}
    mapElement={<div style={{ height: `100%` }} />}
  />
)
