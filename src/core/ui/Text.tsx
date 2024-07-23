import { HTMLProps } from "react";
import cn from "classnames";


type P = HTMLProps<HTMLParagraphElement>
type Heading = HTMLProps<HTMLHeadingElement>


Text.H1 = ({ className, ...props }: Heading) => <h1 className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", className)} {...props} />;
Text.H2 = ({ className, ...props }: Heading) => <h2 className={cn("scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0", className)} {...props} />;
Text.H3 = ({ className, ...props }: Heading) => <h3 className={cn("scroll-m-20 text-2xl font-semibold tracking-tight", className)} {...props} />;
Text.H4 = ({ className, ...props }: Heading) => <h4 className={cn("scroll-m-20 text-xl font-semibold tracking-tight", className)} {...props} />;

export default function Text({ className, ...props }: P) { return <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)} {...props} />; }