import axios from "axios";

// =====================================================
// API BASE URL
// =====================================================
// Uses VITE_API_URL from frontend/.env
// Falls back to localhost for local PC development
// =====================================================

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// =========================================
// LOCATION APIs
// =========================================

export const getStates = async () => {
  const response = await API.get(
    "/api/locations/states"
  );

  return response.data;
};

export const getDistricts = async (state) => {
  const response = await API.get(
    "/api/locations/districts",
    {
      params: {
        state,
      },
    }
  );

  return response.data;
};

export const getBlocks = async (
  state,
  district
) => {
  const response = await API.get(
    "/api/locations/blocks",
    {
      params: {
        state,
        district,
      },
    }
  );

  return response.data;
};

export const getVillages = async (
  state,
  district,
  block
) => {
  const response = await API.get(
    "/api/locations/villages",
    {
      params: {
        state,
        district,
        block,
      },
    }
  );

  return response.data;
};
// =========================================
// REPORT ANALYSIS & STATUS API
// =========================================

export const searchWasteReport = async (
  reportId,
  email
) => {
  const response = await API.get(
    "/api/waste-reports/search",
    {
      params: {
        reportId,
        email,
      },
    }
  );

  return response.data;
};
export default API;