import { useEffect, useState } from "react";
import { csv } from "d3";
import { Raw, Row } from "./Types";


const url = "https://gist.githubusercontent.com/curran/a08a1080b88344b0c8a7/raw/0e7a9b0a5d22642a06d3d5b9bcbad9890c8ee534/iris.csv";

export default function useData() {
	const [data, setData] = useState<Row[]>();

	useEffect(() => {
		const row = (d: Raw): Row => {
			const body = {
				sepal_length: +d.sepal_length,
				sepal_width: +d.sepal_width,
				petal_length: +d.petal_length,
				petal_width: +d.petal_width,
				species: `${d.species}`
			};
			return body;
		};
		if (!data) csv(url, row).then(setData);
	}, []);

	return data;
}