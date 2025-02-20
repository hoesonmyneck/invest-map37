import { api } from "../../shared/api"

export const getF1 = () => {
    return api.get(`data/f1.json`).then(res => res.data)
}

export const getF2 = () => {
    return api.get(`data/f2.json`).then(res => res.data)
}

export const getF3 = () => {
    return api.get(`data/f3.json`).then(res => res.data)
}

export const getF4 = () => {
    return api.get(`data/f4.json`).then(res => res.data)
}

export const getF5 = () => {
    return api.get(`data/f5.json`).then(res => res.data)
}

export const getF5_1 = () => {
    return api.get(`data/f5-1.json`).then(res => res.data)
}

export const getSerpin = () => {
    return api.get(`data/serpin.json`).then(res => res.data)
}

export const getAulAmanati = () => {
    return api.get(`data/aul_amanati.json`).then(res => res.data)
}

export const getDiplommenAulga = () => {
    return api.get(`data/diplommen_aulga.json`).then(res => res.data)
}

export const getAulBesigi = () => {
    return api.get(`data/aul_besigi.json`).then(res => res.data)
}