import { SVGProps } from "react";

type SvgProps = SVGProps<SVGSVGElement>;
type Circle = SVGProps<SVGCircleElement>;
type G = SVGProps<SVGGElement>;
type Line = SVGProps<SVGLineElement>;
type Path = SVGProps<SVGPathElement>;
type Rect = SVGProps<SVGRectElement>;
type Text = SVGProps<SVGTextElement>;
type Title = React.HTMLAttributes<HTMLTitleElement>


Svg.Circle = (props: Circle) => <circle {...props}/>;
Svg.G = (props: G) => <g {...props}/>;
Svg.Line = (props: Line) => <line {...props}/>;
Svg.Path = (props: Path) => <path {...props}/>;
Svg.Rect = (props: Rect) => <rect {...props}/>;
Svg.Text = (props: Text) => <text {...props}/>;
Svg.Title = (props: Title) => <title {...props}/>;

export default function Svg(props : SvgProps) {return <svg {...props} />;}