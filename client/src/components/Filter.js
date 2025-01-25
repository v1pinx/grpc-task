export default function Filter({ type, setType, searchString, setSearchString, onSearch }) {
    return (
      <div className="max-w-7xl mx-auto py-6 mt-5">
        <div 
                className="w-full space-y-6 p-6 bg-[#0E1313]/50 backdrop-blur-md rounded-2xl relative animate-[slideUp_0.5s_ease-out] hover:border-yellow-500/20 transition-all duration-300"
                style={{
                    border: '1px solid rgba(62, 67, 67, 0.5)',
                }}
            >
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-between">
        <select value={type} onChange={(e) => setType(e.target.value)} className="w-full md:w-1/6 h-11 text-white bg-[#3F4444] rounded-lg border-[#6C7070] focus:border-amber-400 focus:border-[1px] transition-colors duration-300 text-center">
          <option value="">Select</option>
          <option value="ANAGRAM">Anagram</option>
          <option value="MCQ">MCQ</option>
          <option value="READ_ALONG">Read Along</option>
          <option value="CONTENT_ONLY">Content Only</option>
        </select>
  
        <input
          type="text"
          placeholder="Search"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          className="w-full h-11 text-white bg-[#3F4444] rounded-lg border-[#6C7070] focus:border-amber-400 focus:border-[1px] transition-colors duration-300 px-5 outline-none"
        />
        <button onClick={onSearch} className="w-full md:w-1/6 h-11 bg-[#3E4343] text-white rounded-2xl  hover:scale-[1.02] transition-all duration-300 hover:bg-[#4a5151] cursor-pointer">Search</button>
        </div>
        </div>
      </div>
    );
  }
  