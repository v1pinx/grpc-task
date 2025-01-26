import React, { useState, useEffect } from "react";
import { QuestionServiceClient } from "./generated/question_grpc_web_pb";
import {
  AllQuestion,
  QuestionType,
  QuestionBySearchString,
  QuestionByTypeAndSearchString,
} from "./generated/question_pb";
import { Pyramid } from "lucide-react";

import Filter from "./components/Filter";
import Pagination from "./components/Pagination";


const client = new QuestionServiceClient(`${process.env.REACT_APP_API_URL}`, null, null);

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [type, setType] = useState("");
  const [searchString, setSearchString] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reset, setReset] = useState(false);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchQuestions();
  }, [currentPage, reset]);

  const fetchQuestions = () => {
    let request;

    if (type && searchString) {
      request = new QuestionByTypeAndSearchString();
      request.setType(type);
      request.setSearchstring(searchString);
    } else if (type) {
      request = new QuestionType();
      request.setType(type);
    } else if (searchString) {
      request = new QuestionBySearchString();
      request.setSearchstring(searchString);
    } else {
      request = new AllQuestion();
    }

    request.setPage(currentPage);
    request.setLimit(10);

    const method =
      type && searchString
        ? client.getQuestionByTypeAndSearchString
        : type
        ? client.getQuestionByType
        : searchString
        ? client.getQuestionBySearchString
        : client.getAllQuestions;

    method.call(client, request, {}, (err, response) => {
      if (err) {
        console.error("Error fetching questions:", err.message);
        return;
      }
      setQuestions(response.getQuestionsList());
      setTotalPages(response.getTotalpages());
    });
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchQuestions();
  };

  const handleReset = () => {
    setType("");
    setSearchString("");
    setCurrentPage(1);
    setReset(!reset);
  };
  return (
    <div className="min-h-screen bg-[#0E1313] relative overflow-hidden">
      <Filter
        type={type}
        setType={setType}
        searchString={searchString}
        setSearchString={setSearchString}
        onSearch={handleSearch}
        onReset={handleReset}
      />
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <h1 className="text-3xl text-white text-center animate-[slideUp_0.5s_ease-out]">
          <Pyramid className="inline-block mr-2 text-yellow-500" />
          Questions
        </h1>

        <div
          className="bg-[#0E1313]/50 backdrop-blur-md rounded-2xl p-6 animate-[slideUp_0.5s_ease-out]"
          style={{
            border: "1px solid rgba(62, 67, 67, 0.5)",
          }}
        >
          {questions.length === 0 ? (
            <p className="text-gray-500 text-center">No questions found</p>
          ) : (
            <ul className="space-y-4">
              {questions.map((q, idx) => (
                <li
                  key={idx}
                  className="bg-[#3F4444] p-4 rounded-lg text-white hover:bg-[#4a5151] transition-colors duration-300 relative"
                >
                  <p className="text-sm text-gray-400 ">{q.getType()} :</p>
                  <strong className="text-yellow-500 block mb-2">
                    {q.getTitle()}
                  </strong>
                  {q.getType() === "ANAGRAM" && (
                    <div>
                      {q
                        .getBlocksList()
                        .sort()
                        .reverse()
                        .map((block, index) => (
                          <span key={index}>{block.getText()},&nbsp;</span>
                        ))}
                    </div>
                  )}

                  {q.getType() == "MCQ" && (
                    <div className="space-y-2 mt-4">
                      {q.getOptionsList().map((option, idx) => (
                        <>
                          <div
                            key={idx}
                            flag={option.getIscorrectanswer()}
                            className="text-white border px-4 py-2 cursor-pointer hover:bg-[#0E1313]/50 transition-colors duration-300 rounded-lg"
                            onClick={(e) => {
                              e.target.style.backgroundColor =
                                option.getIscorrectanswer()
                                  ? "rgba(13, 148, 136, 0.5)"
                                  : "rgba(190, 18, 60, 0.5)";
                            }}
                          >
                            {option.getText()}
                          </div>
                        </>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default App;
