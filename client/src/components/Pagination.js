import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getVisiblePages = () => {
    const pages = [];
    const maxPagesVisible = 8;
    const half = Math.floor(maxPagesVisible / 2);

    let startPage = Math.max(1, currentPage - half);
    let endPage = Math.min(totalPages, currentPage + half);

    if (currentPage <= half) {
      endPage = Math.min(totalPages, maxPagesVisible);
    } else if (currentPage + half >= totalPages) {
      startPage = Math.max(1, totalPages - maxPagesVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="max-w-7xl mx-auto py-6 mt-5 ">
      <div
        className="w-full space-y-6 p-8 bg-[#0E1313]/50 backdrop-blur-md rounded-2xl relative animate-[slideUp_0.5s_ease-out] hover:border-yellow-500/20 transition-all duration-300"
        style={{
          border: "1px solid rgba(62, 67, 67, 0.5)",
        }}
      >
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-full text-white  hover:scale-[1.02] transition-all duration-300${
              currentPage === 1
                ? " bg-gray-400  hover:bg-gray-600 cursor-not-allowed"
                : " bg-[#3E4343] font-bold text-amber-400 hover:bg-[#4a5151] cursor-pointer"
            }`}
          >
            Previous
          </button>

          {visiblePages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 rounded-full cursor-pointer ${
                currentPage === page
                  ? "bg-[#3F4444] text-amber-400 font-bold"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-full hover:scale-[1.02] transition-all duration-300 ${
              currentPage === totalPages
                ? "bg-gray-400 text-white hover:bg-[#4a5151] cursor-not-allowed"
                : "bg-[#3E4343] text-amber-400 font-bold  hover:bg-[#4a5151] cursor-pointer"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
