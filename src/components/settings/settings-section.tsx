import { Children, Fragment, type ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface SettingsSectionProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function SettingsSection({
  title,
  description,
  children,
}: SettingsSectionProps) {
  const childrenArray = Children.toArray(children);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {childrenArray.map((child, index) => {
          const isLast = index === childrenArray.length - 1;
          // Children.toArray already assigns stable keys to elements
          const key = typeof child === "object" && child && "key" in child && child.key 
            ? child.key 
            : index;
          
          return (
            <Fragment key={key}>
              {child}
              {!isLast && <Separator className="mt-6" />}
            </Fragment>
          );
        })}
      </CardContent>
    </Card>
  );
}
