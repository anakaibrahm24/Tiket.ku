interface FeaturesCardProps {
  icon: React.ReactNode;
  label: string;
  className?: string;
}

export const FeaturesCard = ({ icon, label, className }: FeaturesCardProps) => {
  return (
    <div className={`inline-block p-8 text-center ${className}`}>
      <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-indigo-50">
        {icon}
      </div>
      <p className="font-bold tracking-wide text-gray-800 whitespace-nowrap">
        {label}
      </p>
    </div>
  );
};
