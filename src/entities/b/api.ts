import { api } from "../../shared/api";

export const getSerpin = async () => {
  const res = await api.get(`data/serpin.json`);
  return res.data;
};

export const getAulAmanati = async () => {
  const res = await api.get(`data/aul_amanati.json`);
  return res.data;
};

export const getDiplommenAulga = async () => {
  const res = await api.get(`data/diplommen_aulga.json`);
  return res.data;
};

export const getAulBesigi = async () => {
  const res = await api.get(`data/aul_besigi.json`);
  return res.data;
};
