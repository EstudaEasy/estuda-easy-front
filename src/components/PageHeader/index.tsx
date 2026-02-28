import { ReactNode } from "react";
import { LuPlus } from "react-icons/lu";
import { Button } from "../ui/button";
import { Typography } from "../ui/typography";

interface PageHeaderProps {
  title: string;
  buttonText?: string;
  onButtonClick?: () => void;
  buttonIcon?: ReactNode;
  showButton?: boolean;
}

export default function PageHeader({
  title,
  buttonText,
  onButtonClick,
  buttonIcon,
  showButton = true,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <Typography variant="heading-3" color="dark">
        {title}
      </Typography>
      {showButton && buttonText && onButtonClick && (
        <Button onClick={onButtonClick}>
          {buttonIcon || <LuPlus />}
          {buttonText}
        </Button>
      )}
    </div>
  );
}
