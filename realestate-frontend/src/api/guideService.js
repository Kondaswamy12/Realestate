const API_URL = "http://localhost:8000/api/guides";

export const getAllGuides = async () => {
  const res = await fetch(API_URL);
  return res.json();
};
