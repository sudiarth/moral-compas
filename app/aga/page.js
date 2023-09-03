"use client";

import { useCallback, useState } from "react";
import Image from "next/image";

import "bootstrap/dist/css/bootstrap.css";
import styles from "../page.module.css";

export default function Aga() {
  const [question, setQuestion] = useState(
    "We have a financial problem which may delay payment to suppliers to improve cash flow, what should I do?"
  );
  const [option1, setOption1] = useState(
    "I delay the payment for the supplier to the next six month in bulk"
  );
  const [option2, setOption2] = useState(
    "I change the term of payment for suppliers"
  );
  const [option3, setOption3] = useState(
    "I ran from the suppliers and abandon my obligation"
  );

  const [results, setResults] = useState({
    question: "",
    options: [],
    additional: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const addQuestion = useCallback(
    async (e) => {
      e.preventDefault();
      const data = JSON.stringify({
        question,
        options: [option1, option2, option3].filter(Boolean),
      });

      try {
        setIsLoading(true);
        const res = await fetch("http://10.0.64.174:8000/decide", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: data,
        });

        setResults(await res.json());
        setIsLoading(false);
        // console.log(await res.json());
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    },
    [question, option1, option2, option3]
  );

  return (
    <main className={styles.main}>
      <div className="row">
        <h1>
          <Image
            src="/compas.jpg"
            alt="Moral Compas"
            className={styles.vercelLogo}
            width={48}
            height={48}
            priority
          />{" "}
          Moral Compas
        </h1>
        <div className="col sticky-top absolute">
          <form>
            <div>
              <div>
                <h3>Ask Question</h3>
                <textarea
                  defaultValue={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-100 p-1"
                />
              </div>
              <div>
                <input
                  className="w-100 p-1 mb-1"
                  type="text"
                  onChange={(e) => setOption1(e.target.value)}
                  value={option1}
                />
                <input
                  className="w-100 p-1 mb-1"
                  type="text"
                  onChange={(e) => setOption2(e.target.value)}
                  value={option2}
                />
                <input
                  className="w-100 p-1 mb-1"
                  type="text"
                  onChange={(e) => setOption3(e.target.value)}
                  value={option3}
                />
              </div>
              <div>
                <button className="p-1 mb-1">Add row</button>
              </div>

              <div>
                <button onClick={addQuestion} className="btn-primary w-100 p-1">
                  Calculate
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="col">
          {results.additional.length > 0 ? <h4>Question</h4> : <></>}
          {isLoading ? <>Fetching Data....</> : <></>}
          <p>
            <b>{results?.question}</b>
          </p>
          {results.additional.length > 0 ? <h4>Options</h4> : <></>}
          {results.options.map((item, key) => {
            return (
              <div key={key} className="row pb-3">
                <div className="col-10">
                  {item.option} <br />
                  <i className="text-secondary small">
                    Compound score: {item.compound}
                  </i>
                </div>
                <div className="col-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="green"
                    className="bi bi-emoji-heart-eyes"
                    viewBox="0 0 16 16"
                    title="Like"
                    alt="Like"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M11.315 10.014a.5.5 0 0 1 .548.736A4.498 4.498 0 0 1 7.965 13a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .548-.736h.005l.017.005.067.015.252.055c.215.046.515.108.857.169.693.124 1.522.242 2.152.242.63 0 1.46-.118 2.152-.242a26.58 26.58 0 0 0 1.109-.224l.067-.015.017-.004.005-.002zM4.756 4.566c.763-1.424 4.02-.12.952 3.434-4.496-1.596-2.35-4.298-.952-3.434zm6.488 0c1.398-.864 3.544 1.838-.952 3.434-3.067-3.554.19-4.858.952-3.434z" />
                  </svg>
                </div>
                <div className="col-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="red"
                    className="bi bi-emoji-expressionless"
                    viewBox="0 0 16 16"
                    title="Dislike"
                    alt="Dislike"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M4 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm5 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
                  </svg>
                </div>
              </div>
            );
          })}
          {results.additional.length > 0 ? (
            <i className="text-secondary">
              Compound score spans from -1 (extremely bad) to 1 (extremely
              good). Your solutions are evaluated by system
            </i>
          ) : (
            <></>
          )}
          {results.options.length > 0 ? (
            <>
              <div className="mt-3 mb-3">
                <b>You may find some additional solutions below:</b>
              </div>
            </>
          ) : (
            <></>
          )}
          {results.additional.map((item, key) => {
            return (
              <ul key={key} className="row">
                <li className="">{item}</li>
              </ul>
            );
          })}
        </div>
      </div>
    </main>
  );
}
