import { Link } from "react-router-dom"; // Import Link for navigation

const Header = () => {
    return (
        // Fixed header with padding, border, and shadow
        <header className="fixed top-0 left-0 right-0 z-10 flex justify-between items-center p-6 bg-white bg-opacity-90 border-b border-gray-200 shadow-md">
            {/* Blogify title with space from left edge */}
            <h1 className="ml-10 text-4xl font-serif text-gray-800 tracking-wider">
                Blogify
            </h1>
            {/* Navigation links with increased spacing */}
            <nav className="space-x-8">
                {/* Sign In text link */}
                <Link
                    to="/login"
                    className="text-gray-800 text-clip font-medium hover:text-gray-600 transition-colors duration-200"
                >
                    Sign In
                </Link>
                {/* Get Started button */}
                <Link
                    to="/signup"
                    className="inline-block bg-gradient-to-r from-gray-800 to-black text-white py-2 px-4 rounded-lg hover:from-gray-900 hover:to-gray-700 transition-all shadow-md hover:shadow-lg"
                >
                    Get Started
                </Link>
            </nav>
        </header>
    );
};

export default Header;