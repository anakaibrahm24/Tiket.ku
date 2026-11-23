import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-line-soft bg-surface-white p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-tint text-brand-blue">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-ink-900">{title}</h3>
      <p className="text-sm leading-5 text-ink-600">{description}</p>
    </div>
  );
};