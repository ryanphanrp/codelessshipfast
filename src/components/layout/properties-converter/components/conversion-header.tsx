import { ReactNode, memo } from "react";

interface ConversionHeaderProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export const ConversionHeader = memo(function ConversionHeader({
  title,
  description,
  children,
}: ConversionHeaderProps) {
  return (
    <div className="space-y-2 text-center">
      <h1 className="font-bold text-primary text-3xl">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
      {children}
    </div>
  );
});
