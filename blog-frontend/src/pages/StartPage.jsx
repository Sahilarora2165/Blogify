// Homepage.jsx
import { Link } from "react-router-dom"; // Not needed here since Header/Footer handle links
import Header from "../components/Header";
import Footer from "../components/Footer";

const StartPage = () => {
    return (
        // Main container with flexbox to ensure full height and footer at bottom
        <div className="relative flex flex-col min-h-screen">

            {/* Header */}
            <Header />
            {/* Main content area to center the image and push footer down */}
            <main className="fl`ex-grow flex items-center justify-start ml-5 px-6 py-10">
                <div className="text-left">
                    {/* Title (more creative) */}
                    <h2 className="text-9xl font-serif text-gray-800 mt-11 mb-4 tracking-wide">
                        Unviel
                    </h2>
                    <h2 className="text-9xl font-serif text-gray-800 mb-14 tracking-wide">
                        Your Stories
                    </h2>
                    {/* Subtitle/Tagline */}
                    <p className="text-gray-700 text-2xl mb-11">
                        A place to read, write, and deepen your understanding
                    </p>
                    {/* Button */}
                    <Link
                        to="/signup"
                        className="inline-block bg-gradient-to-r from-gray-800 to-black text-white py-3 px-6 rounded-2xl hover:from-gray-900 hover:to-gray-800 transition-all shadow-md hover:shadow-lg"
                    >
                        Start Reading
                    </Link>
                </div>
                {/* Optional decorative element (e.g., green flower or hand)
                <div className="right-10 opacity-100">
                    <img src="/u.jpg"/>
                </div> */}
            </main>
            {/* Footer */}
            <Footer />
        </div>
    );
};

export default StartPage;