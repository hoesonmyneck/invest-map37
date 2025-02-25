import { api } from "../../shared/api";

export const getRegion = async () => {
  const res = await api.get("/data/regions.json");
  return res.data;
};
