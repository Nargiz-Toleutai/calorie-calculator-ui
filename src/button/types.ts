export interface PrimaryActionButtonProps {
  title: string;
  href: string;
}

export interface DynamicButtonProps {
  title: string;
  type?: "button" | "submit";
  color?: string;
  hoverColor?: string;
  onClick?: () => void;
}
