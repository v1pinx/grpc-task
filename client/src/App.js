import React, { useState, useEffect, useMemo } from "react";
import { QuestionServiceClient } from "./generated/question_grpc_web_pb";
import {
  Empty,
  QuestionType,
  QuestionBySearchString,
  QuestionByTypeAndSearchString,
} from "./generated/question_pb";
import { Pyramid } from "lucide-react";

import Filter from "./components/Filter";

const client = new QuestionServiceClient("http://localhost:8080", null, null);

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [type, setType] = useState("");
  const [searchString, setSearchString] = useState("");

  // Fetch all questions on initial load
  useEffect(() => {
    const request = new Empty();
    client.getAllQuestions(request, {}, (err, response) => {
      if (err) {
        console.error("Error:", err.message);
        return;
      }
      console.log(response.toObject());
      setQuestions(response.getQuestionsList());
    });
  }, []);

  // Search questions when the user clicks the search button
  const handleSearch = () => {
    if (type && searchString) {
      // Search by type and search string
      const request = new QuestionByTypeAndSearchString();
      request.setType(type);
      request.setSearchstring(searchString);

      client.getQuestionByTypeAndSearchString(request, {}, (err, response) => {
        if (err) {
          console.error("Error:", err.message);
          return;
        }
        setQuestions(response.getQuestionsList());
      });
    } else if (type) {
      // Search by type only
      const request = new QuestionType();
      request.setType(type);

      client.getQuestionByType(request, {}, (err, response) => {
        if (err) {
          console.error("Error:", err.message);
          return;
        }
        setQuestions(response.getQuestionsList());
      });
    } else if (searchString) {
      // Search by search string only
      const request = new QuestionBySearchString();
      request.setSearchstring(searchString);

      client.getQuestionBySearchString(request, {}, (err, response) => {
        if (err) {
          console.error("Error:", err.message);
          return;
        }
        setQuestions(response.getQuestionsList());
      });
    } else {
      // Fetch all questions if no filters are applied
      const request = new Empty();
      client.getAllQuestions(request, {}, (err, response) => {
        if (err) {
          console.error("Error:", err.message);
          return;
        }
        setQuestions(response.getQuestionsList());
      });
    }

    
  };

  const shuffleAnagram = useMemo(( ) => {
    return questions.map((q) => {
      if(q.getType() == 'ANAGRAM'){
        return {
          ...q,
          blocks: q.getBlocksList().sort(() => Math.random() - 0.5),
        };
      } 
      return q;
    })
  }, [questions]);

  return (
    <div className="min-h-screen bg-[#0E1313] relative overflow-hidden">
      <Filter
        type={type}
        setType={setType}
        searchString={searchString}
        setSearchString={setSearchString}
        onSearch={handleSearch}
      />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        <h1 className="text-3xl text-white text-center animate-[fadeIn_0.8s_ease-in]">
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
                  className="bg-[#3F4444] p-4 rounded-lg text-white hover:bg-[#4a5151] transition-colors duration-300"
                >
                  <strong className="text-yellow-500 block mb-2">
                    {q.getTitle()}
                  </strong>
                  {q.getType() === "ANAGRAM" && (
                    <div>
                      {q
                        .getBlocksList()
                        .sort(() => Math.random() - 0.5)
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
    </div>
  );
};

export default App;
