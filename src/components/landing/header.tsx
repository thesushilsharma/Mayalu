import { HeartIcon } from "lucide-react";
import Nav from "./nav";

export default function Header() {
    return (
        <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <HeartIcon className="h-8 w-8 text-rose-500" />
          <h1 className="text-2xl font-bold">Mayalu</h1>
        </div>
        <Nav />
      </header>
    );
}
