import { Outlet } from "react-router-dom";

import Box from "core/ui/Box";
import Link from "core/ui/Link";


Layout.Header = () => {
	return (
		<nav className="flex justify-center w-full gap-8 p-2 border-b-2">
			<Link to="/">Home</Link>
			<Link to="/bar">Bar</Link>
			<Link to="/line">Line</Link>
			<Link to="/map">Map</Link>
			<Link to="/scatter">Scatter Plot</Link>
			<Link to="/map">Map</Link>
		</nav>
	);
};

export default function Layout() {
	return (
		<Box.Column gap="gap-4">
			<Layout.Header />
			<Outlet />
		</Box.Column>
	);
}