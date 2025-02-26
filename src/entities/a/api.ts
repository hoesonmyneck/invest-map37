import { api } from "../../shared/api";

export const getA1 = async () => {
  const res = await api.get(`data/a/a1.json`);
  return res.data;
};

export const getA2 = async () => {
  const res = await api.get(`data/a/a2_year.json`);
  return res.data;
};

export const getPopup = async () => {
  const res = await api.get(`data/a/popup.json`);
  return res.data;
};
