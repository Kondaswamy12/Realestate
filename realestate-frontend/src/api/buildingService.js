const API_URL = "http://localhost:8000/api/buildings";

export const getAllBuildings = async () => {
  const res = await fetch(API_URL);
  return res.json();
};
