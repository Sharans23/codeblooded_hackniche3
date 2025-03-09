"use client";

import React from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom warehouse icon
const warehouseIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom client location icon
const clientIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: "client-marker",
});

// Mock warehouse data with additional details
const warehouses = [
  {
    id: 1,
    name: "Mumbai Warehouse",
    location: [19.076, 72.8777],
    address: "Mumbai, Maharashtra, India",
    capacity: "15,000 sq ft",
    inventory: 1250,
    contact: "+91 98765 43210",
    operatingHours: "8:00 AM - 8:00 PM",
    specialties: ["Electronics", "Pharmaceuticals", "Textiles"],
  },
  {
    id: 2,
    name: "Delhi Warehouse",
    location: [28.7041, 77.1025],
    address: "Delhi, India",
    capacity: "20,000 sq ft",
    inventory: 1800,
    contact: "+91 98765 12345",
    operatingHours: "7:00 AM - 9:00 PM",
    specialties: ["Automotive", "Consumer Goods", "Industrial Equipment"],
  },
  {
    id: 3,
    name: "Bangalore Warehouse",
    location: [12.9716, 77.5946],
    address: "Bangalore, Karnataka, India",
    capacity: "18,000 sq ft",
    inventory: 1500,
    contact: "+91 98765 67890",
    operatingHours: "8:00 AM - 7:00 PM",
    specialties: ["Electronics", "Software", "Furniture"],
  },
  {
    id: 4,
    name: "Chennai Warehouse",
    location: [13.0827, 80.2707],
    address: "Chennai, Tamil Nadu, India",
    capacity: "12,000 sq ft",
    inventory: 950,
    contact: "+91 98765 54321",
    operatingHours: "8:30 AM - 6:30 PM",
    specialties: ["Automotive", "Textiles", "Food Products"],
  },
  {
    id: 5,
    name: "Kolkata Warehouse",
    location: [22.5726, 88.3639],
    address: "Kolkata, West Bengal, India",
    capacity: "14,000 sq ft",
    inventory: 1100,
    contact: "+91 98765 98765",
    operatingHours: "7:30 AM - 7:30 PM",
    specialties: ["Textiles", "Leather Goods", "Handicrafts"],
  },
];

// Map Controller Component
class MapController extends React.Component {
  componentDidMount() {
    this.updateMapView();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.selectedWarehouse !== this.props.selectedWarehouse ||
      prevProps.clientLocation !== this.props.clientLocation ||
      prevProps.route !== this.props.route
    ) {
      this.updateMapView();
    }
  }

  updateMapView() {
    const { map, selectedWarehouse, clientLocation, route } = this.props;

    if (!map) return;

    if (route) {
      // If we have a route, fit the map to show the entire route
      const bounds = L.latLngBounds(route);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (selectedWarehouse) {
      // If only a warehouse is selected, center on it
      map.setView(selectedWarehouse.location, 10);
    }
  }

  render() {
    return null;
  }
}

// Main Warehouse Map Component
class InteractiveWarehouseMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedWarehouse: null,
      clientAddress: "",
      searchQuery: "",
      route: null,
      clientLocation: null,
      isLoading: false,
      error: null,
      routeInfo: null,
      isDarkMode: false,
      sidebarView: "warehouses",
      filteredWarehouses: warehouses,
      mapInstance: null,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // Filter warehouses based on search query
    if (prevState.searchQuery !== this.state.searchQuery) {
      this.filterWarehouses();
    }

    // Toggle dark mode
    if (prevState.isDarkMode !== this.state.isDarkMode) {
      const root = document.documentElement;
      if (this.state.isDarkMode) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }

  setMapInstance = (map) => {
    this.setState({ mapInstance: map });
  };

  filterWarehouses = () => {
    const { searchQuery } = this.state;

    if (!searchQuery) {
      this.setState({ filteredWarehouses: warehouses });
      return;
    }

    const filtered = warehouses.filter(
      (warehouse) =>
        warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        warehouse.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        warehouse.specialties.some((s) =>
          s.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    this.setState({ filteredWarehouses: filtered });
  };

  // Geocode client address using Nominatim
  geocodeAddress = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}&countrycodes=in`
      );
      const data = await response.json();
      if (data.length > 0) {
        return [Number.parseFloat(data[0].lat), Number.parseFloat(data[0].lon)];
      }
      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      throw new Error("Failed to geocode address");
    }
  };

  // Calculate route using OSRM
  calculateRoute = async (start, end) => {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson&annotations=true`
      );
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        // Calculate distance in km and duration in minutes
        const distance = (data.routes[0].distance / 1000).toFixed(2);
        const duration = Math.round(data.routes[0].duration / 60);

        this.setState({
          routeInfo: {
            distance: distance,
            duration: duration,
          },
        });

        return data.routes[0].geometry.coordinates.map((coord) => [
          coord[1],
          coord[0],
        ]);
      }
      return null;
    } catch (error) {
      console.error("Routing error:", error);
      throw new Error("Failed to calculate route");
    }
  };

  // Handle address input and route calculation
  handleAddressSubmit = async () => {
    const { selectedWarehouse, clientAddress } = this.state;

    if (!selectedWarehouse || !clientAddress) {
      this.setState({
        error: "Please select a warehouse and enter your address",
      });
      return;
    }

    this.setState({ isLoading: true, error: null });

    try {
      const location = await this.geocodeAddress(clientAddress);
      if (!location) {
        this.setState({
          error:
            "Could not find the address. Please try again with a more specific address",
          isLoading: false,
        });
        return;
      }

      this.setState({ clientLocation: location });

      const routeCoordinates = await this.calculateRoute(
        location,
        selectedWarehouse.location
      );

      if (routeCoordinates) {
        this.setState({
          route: routeCoordinates,
          sidebarView: "route",
        });
      } else {
        this.setState({
          error: "Could not calculate the route. Please try again",
        });
      }
    } catch (error) {
      this.setState({
        error: error.message || "An error occurred. Please try again",
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  // Get current location
  getCurrentLocation = () => {
    if (navigator.geolocation) {
      this.setState({ isLoading: true });

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.setState({
            clientLocation: [latitude, longitude],
            isLoading: false,
          });

          // Reverse geocode to get address
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
            .then((res) => res.json())
            .then((data) => {
              if (data.display_name) {
                this.setState({ clientAddress: data.display_name });
              }
            })
            .catch((err) => {
              console.error("Reverse geocoding error:", err);
            });
        },
        (error) => {
          this.setState({
            error:
              "Unable to retrieve your location. Please enter your address manually",
            isLoading: false,
          });
          console.error("Geolocation error:", error);
        }
      );
    } else {
      this.setState({ error: "Geolocation is not supported by your browser" });
    }
  };

  // Reset route and selections
  resetRoute = () => {
    this.setState({
      route: null,
      clientLocation: null,
      routeInfo: null,
      sidebarView: "warehouses",
    });
  };

  // Handle warehouse selection
  handleWarehouseSelect = (warehouseId) => {
    const warehouse = warehouses.find(
      (w) => w.id === Number.parseInt(warehouseId)
    );
    this.setState({ selectedWarehouse: warehouse });
  };

  // Toggle dark mode
  toggleDarkMode = () => {
    this.setState((prevState) => ({ isDarkMode: !prevState.isDarkMode }));
  };

  // Set sidebar view
  setSidebarView = (view) => {
    this.setState({ sidebarView: view });
  };

  render() {
    const {
      selectedWarehouse,
      clientAddress,
      searchQuery,
      route,
      clientLocation,
      isLoading,
      error,
      routeInfo,
      isDarkMode,
      sidebarView,
      filteredWarehouses,
      mapInstance,
    } = this.state;

    // Dynamic class for dark mode
    const containerClass = `flex flex-col lg:flex-row h-screen w-full ${
      isDarkMode ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"
    }`;

    // Map tile layer based on dark/light mode
    const tileLayer = isDarkMode
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

    const tileAttribution = isDarkMode
      ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    return (
      <div className={containerClass}>
        {/* Map Section */}
        <div className="flex-1 h-[50vh] lg:h-screen lg:w-2/3 relative">
          <MapContainer
            center={[20.5937, 78.9629]} // Center on India
            zoom={5}
            style={{ height: "100%", width: "100%" }}
            zoomControl={false}
            whenCreated={this.setMapInstance}
          >
            <TileLayer url={tileLayer} attribution={tileAttribution} />
            <ZoomControl position="bottomright" />

            {/* Controller to handle map view updates */}
            <MapController
              map={mapInstance}
              selectedWarehouse={selectedWarehouse}
              clientLocation={clientLocation}
              route={route}
            />

            {/* Markers for warehouses */}
            {filteredWarehouses.map((warehouse) => (
              <Marker
                key={warehouse.id}
                position={warehouse.location}
                icon={warehouseIcon}
                eventHandlers={{
                  click: () => this.setState({ selectedWarehouse: warehouse }),
                }}
              >
                <Popup>
                  <div className="p-1">
                    <h3 className="font-medium">{warehouse.name}</h3>
                    <p className="text-sm">{warehouse.address}</p>
                    <p className="text-xs mt-1">{warehouse.operatingHours}</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Client location marker */}
            {clientLocation && (
              <Marker position={clientLocation} icon={clientIcon}>
                <Popup>Your Location</Popup>
              </Marker>
            )}

            {/* Display route */}
            {route && (
              <Polyline
                positions={route}
                color={isDarkMode ? "#3b82f6" : "#2563eb"}
                weight={4}
                opacity={0.8}
              />
            )}
          </MapContainer>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button
              className={`p-2 rounded-full shadow-md ${
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
              }`}
              onClick={this.toggleDarkMode}
            >
              {isDarkMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-sun"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-moon"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div
          className={`lg:w-1/3 h-[50vh] lg:h-screen overflow-y-auto border-t lg:border-t-0 lg:border-l ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="p-4 lg:p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-blue-500"
                >
                  <path d="M10 17h4V5H2v12h3" />
                  <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5" />
                  <path d="M14 17h1" />
                  <circle cx="7.5" cy="17.5" r="2.5" />
                  <circle cx="17.5" cy="17.5" r="2.5" />
                </svg>
                <h1 className="text-xl font-bold">Warehouse Locator</h1>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="dark-mode" className="text-sm">
                  Dark
                </label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="dark-mode"
                    checked={isDarkMode}
                    onChange={this.toggleDarkMode}
                    className="sr-only"
                  />
                  <div
                    className={`block h-6 rounded-full w-10 ${
                      isDarkMode ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  ></div>
                  <div
                    className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                      isDarkMode ? "transform translate-x-4" : ""
                    }`}
                  ></div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div
                className={`grid grid-cols-2 gap-2 p-1 rounded-lg ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <button
                  className={`py-2 px-4 rounded-md text-center ${
                    sidebarView === "warehouses"
                      ? isDarkMode
                        ? "bg-gray-700 text-white"
                        : "bg-white shadow-sm"
                      : ""
                  }`}
                  onClick={() => this.setSidebarView("warehouses")}
                >
                  Warehouses
                </button>
                <button
                  className={`py-2 px-4 rounded-md text-center ${
                    sidebarView === "route"
                      ? isDarkMode
                        ? "bg-gray-700 text-white"
                        : "bg-white shadow-sm"
                      : ""
                  }`}
                  onClick={() => this.setSidebarView("route")}
                  disabled={!route}
                >
                  Route Details
                </button>
              </div>
            </div>

            {/* Warehouses Tab Content */}
            {sidebarView === "warehouses" && (
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`absolute left-2.5 top-2.5 h-4 w-4 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search warehouses..."
                    className={`pl-9 w-full p-2 rounded-md ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-300"
                    } border`}
                    value={searchQuery}
                    onChange={(e) =>
                      this.setState({ searchQuery: e.target.value })
                    }
                  />
                </div>

                {/* Warehouse Selection */}
                <div
                  className={`p-4 rounded-lg ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  } border ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <h2 className="text-lg font-semibold mb-1">
                    Select Warehouse
                  </h2>
                  <p
                    className={`text-sm mb-3 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Choose a warehouse to calculate a route
                  </p>
                  <select
                    value={
                      selectedWarehouse ? selectedWarehouse.id.toString() : ""
                    }
                    onChange={(e) => this.handleWarehouseSelect(e.target.value)}
                    className={`w-full p-2 rounded-md ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    } border`}
                  >
                    <option value="">Select a warehouse</option>
                    {filteredWarehouses.map((warehouse) => (
                      <option
                        key={warehouse.id}
                        value={warehouse.id.toString()}
                      >
                        {warehouse.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Address Input */}
                <div
                  className={`p-4 rounded-lg ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  } border ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <h2 className="text-lg font-semibold mb-1">Your Location</h2>
                  <p
                    className={`text-sm mb-3 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Enter your address or use current location
                  </p>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      placeholder="Enter your address"
                      value={clientAddress}
                      onChange={(e) =>
                        this.setState({ clientAddress: e.target.value })
                      }
                      className={`flex-1 p-2 rounded-md ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600"
                          : "bg-white border-gray-300"
                      } border`}
                    />
                    <button
                      className={`p-2 rounded-md ${
                        isDarkMode
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                      onClick={this.getCurrentLocation}
                      disabled={isLoading}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 12h3" />
                        <path d="M19 12h3" />
                        <path d="M12 2v3" />
                        <path d="M12 19v3" />
                        <circle cx="12" cy="12" r="7" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </div>

                  <button
                    onClick={this.handleAddressSubmit}
                    className={`w-full py-2 px-4 rounded-md ${
                      isDarkMode
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-white font-medium flex items-center justify-center`}
                    disabled={isLoading || !selectedWarehouse || !clientAddress}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2 h-4 w-4 animate-spin"
                        >
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        Calculating...
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2 h-4 w-4"
                        >
                          <path d="M3 8a7.001 7.001 0 0 1 13.548-2.77" />
                          <path d="M7 14a7.001 7.001 0 0 0 13.548 2.77" />
                          <path d="M17.218 9.525a3.007 3.007 0 0 0-4.693-1.744" />
                          <path d="M6.782 14.475a3.007 3.007 0 0 0 4.693 1.744" />
                          <circle cx="9.5" cy="9.5" r="1.5" />
                          <circle cx="14.5" cy="14.5" r="1.5" />
                        </svg>
                        Calculate Route
                      </>
                    )}
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div
                    className={`p-4 rounded-lg ${
                      isDarkMode
                        ? "bg-red-900/50 border-red-800"
                        : "bg-red-50 border-red-200"
                    } border`}
                  >
                    <h3
                      className={`font-medium ${
                        isDarkMode ? "text-red-300" : "text-red-800"
                      }`}
                    >
                      Error
                    </h3>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-red-200" : "text-red-700"
                      }`}
                    >
                      {error}
                    </p>
                  </div>
                )}

                {/* Selected Warehouse Details */}
                {selectedWarehouse && (
                  <div
                    className={`p-4 rounded-lg ${
                      isDarkMode ? "bg-gray-800" : "bg-white"
                    } border ${
                      isDarkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-blue-500"
                      >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <h2 className="text-lg font-semibold">
                        {selectedWarehouse.name}
                      </h2>
                    </div>
                    <p
                      className={`text-sm mb-4 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {selectedWarehouse.address}
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Capacity
                        </p>
                        <p>{selectedWarehouse.capacity}</p>
                      </div>
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Inventory
                        </p>
                        <p>{selectedWarehouse.inventory} items</p>
                      </div>
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Contact
                        </p>
                        <p>{selectedWarehouse.contact}</p>
                      </div>
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Hours
                        </p>
                        <p>{selectedWarehouse.operatingHours}</p>
                      </div>
                    </div>

                    <hr
                      className={`my-4 ${
                        isDarkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    />

                    <div>
                      <p
                        className={`text-sm font-medium mb-2 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Specialties
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedWarehouse.specialties.map(
                          (specialty, index) => (
                            <span
                              key={index}
                              className={`px-2 py-1 text-xs rounded-full ${
                                isDarkMode ? "bg-gray-700" : "bg-gray-100"
                              }`}
                            >
                              {specialty}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Route Tab Content */}
            {sidebarView === "route" && route && routeInfo && (
              <div className="space-y-4">
                {/* Route Information */}
                <div
                  className={`p-4 rounded-lg ${
                    isDarkMode
                      ? "bg-blue-900/20 border-blue-800/30"
                      : "bg-blue-50 border-blue-100"
                  } border`}
                >
                  <h2 className="text-lg font-semibold mb-1">Route Details</h2>
                  <p
                    className={`text-sm mb-4 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    From your location to {selectedWarehouse.name}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className={`flex flex-col items-center justify-center p-4 rounded-lg ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white border-gray-200"
                      } border`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-8 w-8 text-blue-500 mb-2"
                      >
                        <polygon points="3 11 22 2 13 21 11 13 3 11" />
                      </svg>
                      <p className="text-2xl font-bold">
                        {routeInfo.distance} km
                      </p>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Distance
                      </p>
                    </div>
                    <div
                      className={`flex flex-col items-center justify-center p-4 rounded-lg ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white border-gray-200"
                      } border`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-8 w-8 text-blue-500 mb-2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <p className="text-2xl font-bold">
                        {routeInfo.duration} min
                      </p>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Duration
                      </p>
                    </div>
                  </div>

                  <button
                    className={`w-full py-2 px-4 mt-4 rounded-md ${
                      isDarkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    } font-medium`}
                    onClick={this.resetRoute}
                  >
                    Reset Route
                  </button>
                </div>

                <div
                  className={`p-4 rounded-lg ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  } border ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <h2 className="text-lg font-semibold mb-4">
                    Warehouse Information
                  </h2>
                  <div className="mb-3">
                    <h3 className="font-medium flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-blue-500"
                      >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {selectedWarehouse.name}
                    </h3>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {selectedWarehouse.address}
                    </p>
                  </div>

                  <hr
                    className={`my-4 ${
                      isDarkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                  />

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Contact
                      </p>
                      <p>{selectedWarehouse.contact}</p>
                    </div>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Hours
                      </p>
                      <p>{selectedWarehouse.operatingHours}</p>
                    </div>
                  </div>

                  <div>
                    <p
                      className={`text-sm font-medium mb-2 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Specialties
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedWarehouse.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 text-xs rounded-full ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-100"
                          }`}
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default InteractiveWarehouseMap;
