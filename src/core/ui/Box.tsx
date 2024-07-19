import cn from "classnames";


type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    gap?: string;
}

Box.Column = ({ className, ...props }: Props) => {
	return <Box {...props} className={cn("flex-col", className)} />;
};

export default function Box({ className, gap, ...props }: Props) {
	return <div {...props} className={cn("flex", { [`${gap}`]: gap }, className)} />;
}