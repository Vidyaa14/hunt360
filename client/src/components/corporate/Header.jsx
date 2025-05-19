function Header({ toggleSidebar }) {
    return (
        <header className="fixed top-0 left-0 w-full h-[60px] sm:h-[70px] bg-white z-50 shadow-md flex items-center px-4 sm:px-6">
            <button
                onClick={toggleSidebar}
                className="sm:hidden text-gray-600 hover:text-gray-800 text-2xl mr-2"
                aria-label="Toggle sidebar"
            >

                ☰
            </button>
            <img
                src={`/logo.png`}
                alt="Company Logo"
                className="w-12 h-12 sm:w-16 sm:h-16"
            />
            <h1 className="ml-2 sm:ml-4 text-lg sm:text-xl font-bold text-gray-800 truncate">
                Talent Corner HR Services Pvt. Ltd
            </h1>
        </header>
    );
}

export default Header;

