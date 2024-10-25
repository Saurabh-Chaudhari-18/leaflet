import React, { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  Grid,
} from "@mui/material";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ChangeMapView from "./components/ChangeMapView";

// Fix marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const App = () => {
  const [startCity, setStartCity] = useState("");
  const [endCity, setEndCity] = useState("");
  const [startCoordinates, setStartCoordinates] = useState([51.505, -0.09]); // Default to London
  const [endCoordinates, setEndCoordinates] = useState([51.505, -0.09]); // Default to London
  const [zoom, setZoom] = useState(13);

  const openWeatherMapAPIKey = "4e2f67ffeb1a3f3c50a8cecf46149bd0";
  const mapboxAccessToken =
    "pk.eyJ1Ijoic2F1cmFiaDE4MDkiLCJhIjoiY20ybjhxNm5tMDJraDJtc2Nkdzg3bjVweCJ9.2KWRR4TMU-OhGdB9pVFR3g";

  // Function to fetch city coordinates using OpenWeatherMap API
  const fetchCoordinates = async (city, isStartLocation = true) => {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${openWeatherMapAPIKey}`;
    try {
      const response = await axios.get(url);
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        if (isStartLocation) {
          setStartCoordinates([lat, lon]);
        } else {
          setEndCoordinates([lat, lon]);
        }
      } else {
        console.error("City not found.");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  const handleRouteCalculation = () => {
    if (!startCity || !endCity) return;

    fetchCoordinates(startCity, true);
    fetchCoordinates(endCity, false);
  };

  const handleSwapLocations = () => {
    const tempCity = startCity;
    setStartCity(endCity);
    setEndCity(tempCity);

    const tempCoordinates = startCoordinates;
    setStartCoordinates(endCoordinates);
    setEndCoordinates(tempCoordinates);
  };

  return (
    <Container>
      <Box mt={5} textAlign="center">
        <Typography variant="h4" gutterBottom>
          Best Route
        </Typography>
        <Typography variant="body1" gutterBottom>
          Enter a starting and destination city, and find the route between
          them!
        </Typography>
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        my={3}
      >
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              label="Enter Starting City"
              variant="outlined"
              value={startCity}
              onChange={(e) => setStartCity(e.target.value)}
              sx={{ width: "100%", mb: 2 }}
            />
          </Grid>

          <Grid
            item
            xs={12}
            md={2}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleSwapLocations}
              sx={{ height: "100%" }}
            >
              Swap Locations
            </Button>
          </Grid>

          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              label="Enter Destination City"
              variant="outlined"
              value={endCity}
              onChange={(e) => setEndCity(e.target.value)}
              sx={{ width: "100%", mb: 2 }}
            />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          color="primary"
          onClick={handleRouteCalculation}
          sx={{ mt: 2 }}
        >
          Calculate Route
        </Button>
      </Box>

      <Box
        sx={{
          height: "500px",
          width: "100%",
          mt: 3,
          border: "2px solid #3f51b5",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <MapContainer
          center={startCoordinates}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
        >
          <ChangeMapView
            center={startCoordinates}
            zoom={zoom}
            start={startCoordinates}
            end={endCoordinates}
            mapboxAccessToken={mapboxAccessToken}
          />
          <TileLayer
            url={`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`}
            id="mapbox/streets-v11"
            attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
          />
          <Marker position={startCoordinates} />
          <Marker position={endCoordinates} />
        </MapContainer>
      </Box>
    </Container>
  );
};

export default App;
