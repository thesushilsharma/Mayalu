import Link from "next/link";

export default function Nav() {
    return (
        <nav className="bg-gray-800 text-white py-4">
            <div className="flex gap-4">
                <Link href="/auth/login" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Login
                </Link>
                <Link href="/auth/signup" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                    Sign Up
                </Link>
            </div>
        </nav>
    );
}

