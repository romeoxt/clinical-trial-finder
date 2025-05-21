import { LucideIcon } from 'lucide-react';

export default function PageHeader({ 
  title, 
  description, 
  icon: Icon,
  iconBgColor = "bg-blue-100 dark:bg-blue-900",
  iconColor = "text-blue-600 dark:text-blue-400"
}) {
  return (
    <div className="mx-auto max-w-2xl lg:mx-0">
      {Icon && (
        <div className="flex items-center gap-4 mb-6">
          <div className={`rounded-full ${iconBgColor} p-2`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            {title}
          </h1>
        </div>
      )}
      {!Icon && (
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-6">
          {title}
        </h1>
      )}
      {description && (
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
} 