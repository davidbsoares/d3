import { RouteObject } from "react-router-dom";

import Layout from "app/Layout";

import Bar from "pages/Bar";
import Home from "pages/Home";
import Line from "pages/Line";
import Map from "pages/Map";
import Pie from "pages/Pie";
import Scatter from "pages/Scatter";
import Migrants from "pages/Migrants";


const routes: RouteObject[] = [
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				index: true,
				element: <Home />
			},
			{
				path: "pie",
				element: <Pie />
			},
			{
				path: "line",
				element: <Line />
			},
			{
				path: "bar",
				element: <Bar />
			},
			{
				path: "scatter",
				element: <Scatter />
			},
			{
				path: "map",
				element: <Map />
			},
			{
				path: "migrants",
				element: <Migrants />
			}
		]
	}
];

export default routes;