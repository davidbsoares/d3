import { create } from "zustand";
import { Atlas, Migrant, Store } from "./models";


const useStore = create<Store>((set) => ({
	raw: [],
	migrants: [],
	atlas: null,

	setRaw: (data) => set(() => ({ raw: data })),
	setMigrants: (data) => set(() => ({ migrants: data })),
	setAtlas: (data: Atlas) => set(() => ({ atlas: data })),
	axis: {
		x: (d: Migrant) => d.date,
		y: (d: Migrant) => d.total
	}
}));


export default useStore;