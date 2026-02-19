import * as React from "react";
import { cn } from "@/lib/utils";
import { SectionDropdownProps } from "./section.types";
import { LuChevronDown } from "react-icons/lu";

const SectionDropdown = React.forwardRef<HTMLButtonElement, SectionDropdownProps>(
  ({ icon: Icon, text, isOpen: isOpenProp, onToggle, className, ...props }, ref) => {
    const dropdownRef = React.useRef(false);
    const isOpen = isOpenProp !== undefined ? isOpenProp : dropdownRef.current;

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
      const sectionElement = (e.currentTarget as HTMLElement).closest("section[data-section-open]");
      if (sectionElement) {
        const isCurrentOpened = sectionElement.getAttribute("data-section-open") === "true";
        const newState = !isCurrentOpened;
        sectionElement.setAttribute("data-section-open", String(newState));
        dropdownRef.current = newState;
        e.currentTarget.classList.toggle("rotate-180", newState);
      }

      onToggle?.();
    };

    return (
      <button
        ref={ref}
        onClick={handleToggle}
        className={cn(
          "flex items-center justify-center gap-2 transition-transform duration-200",
          isOpen && "rotate-180",
          className,
        )}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Fechar" : "Abrir"}
        {...props}
      >
        {text && <span className="text-sm font-medium">{text}</span>}
        {Icon ? <Icon size={24} /> : <LuChevronDown size={24} color="#000" />}
      </button>
    );
  },
);

SectionDropdown.displayName = "SectionDropdown";

export default SectionDropdown;
