import { api } from "../../shared/api"

export const getRegion = () => {
    return api.get("https://s3.eu-north-1.amazonaws.com/api.mansap.enbek.kz/invest-map/regions.json").then(res => res.data)
}