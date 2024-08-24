import { create } from "zustand";
import { Atlas, Migrant, Store } from "./models";


const useStore = create<Store>((set) => ({
	migrants: [],
	atlas: null,

	setMigrants: (data) => set(() => ({ migrants: data })),
	setAtlas: (data: Atlas) => set(() => ({ atlas: data })),
	axis: {
		x: (d: Migrant) => d.date,
		y: (d: Migrant) => d.total
	}
}));


export default useStore;