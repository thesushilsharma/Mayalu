import Link from "next/link";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";

export default function Nav() {
  return (
    <nav className="flex items-center gap-4">
      <ModeToggle />
      <Link href="/auth/signup">
        <Button variant="default" size="sm">
          Sign up
        </Button>
      </Link>
      <Link href="/auth/login">
        <Button variant="default" size="sm">
          Sign In
        </Button>
      </Link>
    </nav>
  );
}
