import { api } from "../../shared/api";

export const getF1 = async () => {
  const res = await api.get(`data/f/f1.json`);
  return res.data;
};

export const getF2 = async () => {
  const res = await api.get(`data/f/f2.json`);
  return res.data;
};

export const getF2_new = async () => {
  const res = await api.get(`data/f/f2_new.json`);
  return res.data;
};

export const getF3 = async () => {
  const res = await api.get(`data/f/f3.json`);
  return res.data;
};

export const getF5 = async () => {
  const res = await api.get(`data/f/f5.json`);
  return res.data;
};

export const getF5_1 = async () => {
  const res = await api.get(`data/f/f5-1.json`);
  return res.data;
};

export const getF6 = async () => {
  const res = await api.get(`data/f/f6.json`);
  return res.data;
};

export const getF7_total = async () => {
  const res = await api.get(`data/f/f7_total.json`);
  return res.data;
};

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
