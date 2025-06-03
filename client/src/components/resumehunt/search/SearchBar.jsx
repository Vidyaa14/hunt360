import { useState } from 'react'

function SearchBar({ searchQuery, setSearchQuery }) {
    const [inputValue, setInputValue] = useState(searchQuery)

    const handleSearch = (e) => {
        e.preventDefault()
        setSearchQuery(inputValue)
    }

    return (
        <form onSubmit={handleSearch} className="relative">
            <div className="relative">
                <input
                    type="text"
                    className="input pr-24"
                    placeholder="Search resumes (e.g. 'React AND 5 years' or 'Java OR Python')"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <button
                        type="submit"
                        className="btn-primary py-1 px-3 text-sm"
                    >
                        Search
                    </button>
                </div>
            </div>

            <div className="mt-1 text-xs text-secondary-500">
                <span>Tip: Use <span className="font-mono bg-secondary-100 px-1 rounded">AND</span> or <span className="font-mono bg-secondary-100 px-1 rounded">OR</span> for boolean search</span>
            </div>
        </form>
    )
}

export default SearchBar