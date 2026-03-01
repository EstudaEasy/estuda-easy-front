import { ReactNode } from "react";
import { LuPlus } from "react-icons/lu";
import { Button } from "../ui/button";
import { Typography } from "../ui/typography";
import { Separator } from "../ui/separator";

interface PageRootProps {
  children: ReactNode;
  className?: string;
}

function PageRoot({ children, className = "" }: PageRootProps) {
  return <div className={`flex flex-col min-h-full bg-background ${className}`}>{children}</div>;
}

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  buttonIcon?: ReactNode;
  showButton?: boolean;
  showSeparator?: boolean;
  children?: ReactNode;
  className?: string;
}

function PageHeader({
  title,
  subtitle,
  buttonText,
  onButtonClick,
  buttonIcon,
  showButton = true,
  showSeparator = true,
  children,
  className = "",
}: PageHeaderProps) {
  return (
    <header className={className}>
      {children ? (
        children
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            {title && (
              <Typography variant="heading-3" color="dark">
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="caption" color="light">
                {subtitle}
              </Typography>
            )}
          </div>
          {showButton && buttonText && onButtonClick && (
            <Button onClick={onButtonClick}>
              {buttonIcon || <LuPlus />}
              {buttonText}
            </Button>
          )}
        </div>
      )}
      {showSeparator && <Separator className="my-4" />}
    </header>
  );
}

interface PageContentProps {
  children: ReactNode;
  className?: string;
}

function PageContent({ children, className = "" }: PageContentProps) {
  return <main className={`flex-1 ${className}`}>{children}</main>;
}

interface PageFooterProps {
  children: ReactNode;
  className?: string;
  showSeparator?: boolean;
}

function PageFooter({ children, className = "", showSeparator = true }: PageFooterProps) {
  return (
    <footer className={`mt-auto ${className}`}>
      {showSeparator && <Separator className="my-4" />}
      {children}
    </footer>
  );
}

const Page = Object.assign(PageRoot, {
  Header: PageHeader,
  Content: PageContent,
  Footer: PageFooter,
});

export { Page, PageHeader, PageContent, PageFooter };
export default Page;
