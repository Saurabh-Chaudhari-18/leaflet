import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const App = () => {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [coordinates, setCoordinates] = useState([51.505, -0.09]); 
  const [zoom, setZoom] = useState(13);
  const [loading, setLoading] = useState(false);

  const apiKey = "1e00ee3e43b54ad4ac7ecf2ca15d4b5d"; 

  const fetchSuggestions = async (input) => {
    if (!input) {
      setSuggestions([]);
      return;
    }
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${input}&key=${apiKey}&limit=5`;

    try {
      const response = await axios.get(url);
      setSuggestions(response.data.results);
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
    }
  };

  const fetchCityCoordinates = async () => {
    if (!city) return;

    const url = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${apiKey}`;
    setLoading(true);

    try {
      const response = await axios.get(url);
      const { lat, lng } = response.data.results[0].geometry;
      setCoordinates([lat, lng]);
      setZoom(13);
      setSuggestions([]);
    } catch (error) {
      console.error("Error fetching city coordinates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (suggestion) => {
    const { lat, lng } = suggestion.geometry;
    setCoordinates([lat, lng]);
    setZoom(13);
    setSuggestions([]);
    setCity(suggestion.formatted); 
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setCity(value);
    fetchSuggestions(value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      fetchCityCoordinates(); 
    }
  };

  
  const ChangeMapView = ({ center }) => {
    const map = useMap();
    map.setView(center, zoom);
    return null;
  };

  return (
    <Container>
      <Box mt={5} textAlign="center">
        <Typography variant="h4" gutterBottom>
          Maps
        </Typography>
        <Typography variant="body1" gutterBottom>
          Find a city or place in just one click on the map.
        </Typography>
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        my={3}
      >
        <TextField
          fullWidth
          label="Enter a City or Place"
          variant="outlined"
          value={city}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress} 
          sx={{ width: "100%", maxWidth: 500, mb: 2 }}
        />
        <div style={{ position: "relative", width: "100%", maxWidth: 500 }}>
          {loading && <CircularProgress />}
          {suggestions.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                zIndex: 1000,
              }}
            >
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSelect(suggestion)}
                  style={{
                    padding: "10px",
                    cursor: "pointer",
                    backgroundColor: "#f9f9f9",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {suggestion.formatted}
                </div>
              ))}
            </div>
          )}
        </div>

       
        <Button
          variant="contained"
          color="primary"
          onClick={fetchCityCoordinates} 
          sx={{ mt: 2 }}
        >
          Locate City
        </Button>
      </Box>

      <Box
        sx={{
          height: "500px",
          width: "100%",
          mt: 3,
          border: "4px solid #3f51b5", 
          borderRadius: "8px",
          overflow: "hidden", 
        }}
      >
        <MapContainer
          center={coordinates}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
        >
          
          <ChangeMapView center={coordinates} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={coordinates}></Marker>
        </MapContainer>
      </Box>
    </Container>
  );
};

export default App;
