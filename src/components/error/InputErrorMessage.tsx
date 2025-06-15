import { ReactNode } from "react";

type Props = {
  id: string;
  children: ReactNode;
};

export default function InputErrorMessage({ id, children }: Props) {
  return (
    <span id={id} className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
      {children}
    </span>
  );
}
