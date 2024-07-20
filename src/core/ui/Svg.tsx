import { SVGProps } from "react";

type SvgProps = SVGProps<SVGSVGElement>;
type GProps = SVGProps<SVGGElement>;
type PathProps = SVGProps<SVGPathElement>;
type RectProps = SVGProps<SVGRectElement>;


Svg.G = (props:GProps) => <g {...props}/>;
Svg.Path = (props:PathProps) => <path {...props}/>;
Svg.Rect = (props:RectProps) => <rect {...props}/>;

export default function Svg(props : SvgProps) {return <svg {...props} />;}