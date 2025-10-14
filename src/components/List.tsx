import { useState } from "react";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBroom,
  faArrowDownAZ,
  faShuffle,
} from "@fortawesome/free-solid-svg-icons";

type ListProps = {
  text: string;
  results: { result: string; index: number }[];
  handleClearResults: () => void;
  handleTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSort: (listName: "entries" | "results") => void;
  handleListShuffle: () => void;
  isSpinning: boolean;
};

const List = ({
  text,
  results,
  handleClearResults,
  handleTextChange,
  handleSort,
  handleListShuffle,
  isSpinning,
}: ListProps) => {
  const [activeTab, setActiveTab] = useState("entries");

  return (
    <div className="border-dark-secondary grid grid-cols-1 grid-rows-[auto_auto_1fr] border text-white shadow-md xl:min-h-screen">
      <div>
        <ul className="flex">
          <li
            onClick={() => setActiveTab("entries")}
            className={`cursor-pointer px-4 py-2 text-lg ${activeTab === "entries" && "bg-dark-secondary"}`}
          >
            Entries
          </li>
          <li
            onClick={() => setActiveTab("results")}
            className={`cursor-pointer px-4 py-2 text-lg ${activeTab === "results" && "bg-dark-secondary"}`}
          >
            Results
          </li>
        </ul>
      </div>

      <div
        className={`bg-dark-secondary flex items-center justify-start gap-2 px-4 py-6 ${isSpinning && "pointer-events-none"}`}
      >
        {activeTab === "results" && (
          <>
            <Button
              action={() => handleSort("results")}
              icon={<FontAwesomeIcon icon={faArrowDownAZ} size="lg" />}
            >
              Sort
            </Button>
            <Button
              action={handleClearResults}
              icon={<FontAwesomeIcon icon={faBroom} size="lg" />}
            >
              Clear
            </Button>
          </>
        )}

        {activeTab === "entries" && (
          <>
            <Button
              action={() => handleSort("entries")}
              icon={<FontAwesomeIcon icon={faArrowDownAZ} size="lg" />}
            >
              Sort
            </Button>
            <Button
              action={() => handleListShuffle()}
              icon={<FontAwesomeIcon icon={faShuffle} size="lg" />}
            >
              Shuffle
            </Button>
          </>
        )}
      </div>

      <div className="bg-dark-secondary flex">
        <textarea
          onChange={handleTextChange}
          placeholder={
            activeTab === "entries"
              ? "Enter items here"
              : "Results will appear here"
          }
          readOnly={activeTab === "results"}
          value={
            activeTab === "entries"
              ? text
              : results.map((r) => r.result).join("\n")
          }
          spellCheck="false"
          className={`bg-dark m-4 mt-0 min-h-[300px] w-full resize-none rounded-lg p-4 outline-0 ${isSpinning && "pointer-events-none"} ${activeTab === "results" && "pointer-events-none"}`}
        ></textarea>
      </div>
    </div>
  );
};

export default List;
