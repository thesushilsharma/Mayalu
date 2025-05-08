import Nav from "./nav";

export default function Header() {
    return (
        <header className="bg-gray-800 text-white py-4">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-6">Welcome to Mayalu</h1>
                <p className="text-xl mb-8">Find your perfect match!</p>
            </div>
            <Nav />
        </header>
    );
}
