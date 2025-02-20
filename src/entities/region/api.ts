import { api } from "../../shared/api";

export const getRegion = async () => {
  const res = await api.get(
    "https://s3.eu-north-1.amazonaws.com/api.mansap.enbek.kz/invest-map/regions.json"
  );
  return res.data;
};
