import React, { useEffect, useState } from "react";
import {
  getStates,
  getDistricts,
  getBlocks,
  getVillages,
} from "../services/api";

function LocationSelector() {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [villages, setVillages] = useState([]);

  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================================
  // LOAD STATES
  // =========================================

  useEffect(() => {
    const loadStates = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getStates();

        setStates(data.states || []);
      } catch (err) {
        console.error("Error loading states:", err);
        setError("Failed to load states");
      } finally {
        setLoading(false);
      }
    };

    loadStates();
  }, []);

  // =========================================
  // STATE → DISTRICTS
  // =========================================

  const handleStateChange = async (e) => {
    const state = e.target.value;

    setSelectedState(state);
    setSelectedDistrict("");
    setSelectedBlock("");
    setSelectedVillage("");

    setDistricts([]);
    setBlocks([]);
    setVillages([]);

    if (!state) return;

    try {
      setLoading(true);
      setError("");

      const data = await getDistricts(state);

      setDistricts(data.districts || []);
    } catch (err) {
      console.error("Error loading districts:", err);
      setError("Failed to load districts");
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // DISTRICT → BLOCKS
  // =========================================

  const handleDistrictChange = async (e) => {
    const district = e.target.value;

    setSelectedDistrict(district);
    setSelectedBlock("");
    setSelectedVillage("");

    setBlocks([]);
    setVillages([]);

    if (!district) return;

    try {
      setLoading(true);
      setError("");

      const data = await getBlocks(selectedState, district);

      setBlocks(data.blocks || []);
    } catch (err) {
      console.error("Error loading blocks:", err);
      setError("Failed to load blocks");
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // BLOCK → VILLAGES
  // =========================================

  const handleBlockChange = async (e) => {
    const block = e.target.value;

    setSelectedBlock(block);
    setSelectedVillage("");

    setVillages([]);

    if (!block) return;

    try {
      setLoading(true);
      setError("");

      const data = await getVillages(
        selectedState,
        selectedDistrict,
        block
      );

      setVillages(data.villages || []);
    } catch (err) {
      console.error("Error loading villages:", err);
      setError("Failed to load villages");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="location-selector">

      <h2>📍 Select Location</h2>

      {error && (
        <p className="location-error">
          {error}
        </p>
      )}

      {/* STATE */}

      <div className="location-field">
        <label>State</label>

        <select
          value={selectedState}
          onChange={handleStateChange}
        >
          <option value="">Select State</option>

          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      {/* DISTRICT */}

      <div className="location-field">
        <label>District</label>

        <select
          value={selectedDistrict}
          onChange={handleDistrictChange}
          disabled={!selectedState}
        >
          <option value="">Select District</option>

          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
      </div>

      {/* BLOCK */}

      <div className="location-field">
        <label>Block</label>

        <select
          value={selectedBlock}
          onChange={handleBlockChange}
          disabled={!selectedDistrict}
        >
          <option value="">Select Block</option>

          {blocks.map((block) => (
            <option key={block} value={block}>
              {block}
            </option>
          ))}
        </select>
      </div>

      {/* VILLAGE */}

      <div className="location-field">
        <label>Village</label>

        <select
          value={selectedVillage}
          onChange={(e) =>
            setSelectedVillage(e.target.value)
          }
          disabled={!selectedBlock}
        >
          <option value="">Select Village</option>

          {villages.map((village) => (
            <option key={village} value={village}>
              {village}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <p className="location-loading">
          Loading...
        </p>
      )}

      {selectedVillage && (
        <div className="selected-location">
          <strong>Selected Location:</strong>

          <p>
            {selectedVillage}, {selectedBlock},{" "}
            {selectedDistrict}, {selectedState}
          </p>
        </div>
      )}

    </div>
  );
}

export default LocationSelector;