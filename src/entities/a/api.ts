import { api } from "../../shared/api";

export const getA1 = async () => {
  const res = await api.get(`data/a/a1.json`);
  return res.data;
};

export const getA2 = async () => {
  const res = await api.get(`data/a/a2.json`);
  return res.data;
};
