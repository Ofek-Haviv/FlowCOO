import { cn } from "@/lib/utils";

type CategoryType = "personal" | "business" | "finance" | "design" | "urgent" | "project";

interface CategoryBadgeProps {
  category: CategoryType;
  className?: string;
}

const categoryConfig = {
  personal: {
    bg: "bg-[#F2FCE2]",
    text: "text-green-700",
    label: "Personal"
  },
  business: {
    bg: "bg-[#D3E4FD]",
    text: "text-blue-700",
    label: "Business"
  },
  finance: {
    bg: "bg-[#FEF7CD]",
    text: "text-yellow-700",
    label: "Finance"
  },
  design: {
    bg: "bg-[#E5DEFF]",
    text: "text-purple-700",
    label: "Design"
  },
  urgent: {
    bg: "bg-[#FFDEE2]",
    text: "text-red-700",
    label: "Urgent"
  },
  project: {
    bg: "bg-[#E0F7FA]",
    text: "text-cyan-700",
    label: "Project"
  }
};

const CategoryBadge = ({ category, className }: CategoryBadgeProps) => {
  const config = categoryConfig[category];
  
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      config.bg,
      config.text,
      className
    )}>
      {config.label}
    </span>
  );
};

export default CategoryBadge;
