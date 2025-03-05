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