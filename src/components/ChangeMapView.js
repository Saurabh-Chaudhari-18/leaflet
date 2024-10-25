import React from 'react';
import { useMap } from 'react-leaflet';
import RoutingMachine from './RoutingMachine';

const ChangeMapView = ({ center, zoom, start, end, mapboxAccessToken }) => {
  const map = useMap();
  map.setView(center, zoom);

  return (
    <RoutingMachine 
      map={map} 
      start={start} 
      end={end} 
      mapboxAccessToken={mapboxAccessToken} 
    />
  );
};

export default ChangeMapView;
