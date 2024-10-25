import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet.awesome-markers';

// Create custom icons using AwesomeMarkers
const startIcon = L.AwesomeMarkers.icon({
  icon: 'play', // Use a FontAwesome icon
  markerColor: 'green', // Color for the starting point
  prefix: 'fa', // FontAwesome icon prefix
  iconColor: 'white',
});

const endIcon = L.AwesomeMarkers.icon({
  icon: 'flag-checkered', // Use a FontAwesome icon
  markerColor: 'red', // Color for the destination point
  prefix: 'fa', // FontAwesome icon prefix
  iconColor: 'white',
});

const RoutingMachine = ({ map, start, end, mapboxAccessToken }) => {
  useEffect(() => {
    if (!map || !start || !end) return;

    let routingControl;

    const removeRoutingControl = () => {
      if (routingControl && map && map.hasLayer(routingControl)) {
        try {
          map.removeControl(routingControl);
        } catch (error) {
          console.error('Error removing routing control:', error);
        }
      }
    };

    const cleanupRoutingControl = () => {
      if (routingControl) {
        try {
          routingControl.spliceWaypoints(0, routingControl.getWaypoints().length);
        } catch (error) {
          console.error('Error cleaning up waypoints:', error);
        }
        removeRoutingControl();
      }
    };

    cleanupRoutingControl();

    // Initialize the routing control
    routingControl = L.Routing.control({
      waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
      router: L.Routing.mapbox(mapboxAccessToken),
      routeWhileDragging: true,
      lineOptions: {
        styles: [{ color: 'blue', weight: 4 }],
      },
      // Use the custom icons for start and end markers
      createMarker: function (i, waypoint, n) {
        if (i === 0) {
          // Starting point
          return L.marker(waypoint.latLng, { icon: startIcon });
        } else if (i === n - 1) {
          // Destination point
          return L.marker(waypoint.latLng, { icon: endIcon });
        } else {
          // For any other waypoints, you can define another icon or keep it null
          return null;
        }
      },
    }).addTo(map);

    return () => {
      cleanupRoutingControl();
    };
  }, [map, start, end, mapboxAccessToken]);

  return null;
};

export default RoutingMachine;
