import { create } from "zustand";
import { Atlas, City, Store } from "./models";


const useStore = create<Store>((set) => ({
	cities: [],
	atlas: null,

	setCities: (data) => set(() => ({ cities: data })),
	setAtlas: (data: Atlas) => set(() => ({ atlas: data })),
	axis: {
		size: (d: City) => d.population
	}
}));


export default useStore;