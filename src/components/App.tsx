import { useState, useEffect } from "react";
import Wheel from "./Wheel";
import List from "./List";
import BgFilter from "./BgFilter";
import WinnerModal from "./WinnerModal";

const defaultEntries = [
  { entry: "Jason", index: 0 },
  { entry: "Mark", index: 1 },
  { entry: "Amy", index: 2 },
  { entry: "Brandon", index: 3 },
  { entry: "Lisa", index: 4 },
];

type Entry = { entry: string; index: number };
type Result = { result: string; index: number };

const App = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [text, setText] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const storedList = localStorage.getItem("list");
    const storedResults = localStorage.getItem("results");

    if (storedList) {
      
      if (storedList === "[]") {
        setEntries(defaultEntries);
        setText(defaultEntries.map((item: Entry) => item.entry).join("\n"));
        return
      }

      try {
        const parsed = JSON.parse(storedList);
        if (Array.isArray(parsed)) {
          setEntries(parsed);
          setText(parsed.map((item: Entry) => item.entry).join("\n"));
        }
      } catch {
        setEntries(defaultEntries);
        setText(defaultEntries.map((item: Entry) => item.entry).join("\n"));
      }
    }

    if (storedResults) {
      try {
        const parsed = JSON.parse(storedResults);
        if (Array.isArray(parsed)) setResults(parsed);
      } catch {
        setResults([]);
      }
    }
  }, []);

  // Persist entries and results
  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem("results", JSON.stringify(results));
  }, [results]);

  // Sync entries from text (user typing)
  useEffect(() => {
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    const parsedEntries = lines.map((line, i) => ({
      entry: line.trim(),
      index: i,
    }));

    const isDifferent =
      parsedEntries.length !== entries.length ||
      parsedEntries.some((item, i) => item.entry !== entries[i]?.entry);

    if (isDifferent) {
      setEntries(parsedEntries);
    }
  }, [text]);

  // Sync text from entries
  useEffect(() => {
    setText(entries.map((item) => item.entry).join("\n"));
  }, [entries]);

  // Handlers
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const addResult = (result: string, index: number) => {
    setResults([...results, { result, index }]);
  };

  const handleClearResults = () => {
    if (results.length === 0) {
      return;
    }
    setResults([]);
  };

  const handleSort = (listName: "entries" | "results") => {
    
    if (listName === "entries") {

      if (entries.length <= 1) return;

      const temp = [...entries].sort((a, b) => a.entry.localeCompare(b.entry));
      setEntries(temp.map((item, i) => ({ ...item, index: i })));
      setText(temp.map((item) => item.entry).join("\n"));
    } else if (listName === "results") {

      if (results.length <= 1) return;

      const temp = [...results].sort((a, b) =>
        a.result.localeCompare(b.result),
      );
      setResults(temp);
    }
  };

  const handleListShuffle = () => {
    if (entries.length <= 1) return;

    let isSame = true;

    while (isSame) {
      const temp = [...entries];

      for (let i = temp.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [temp[i], temp[j]] = [temp[j], temp[i]];
      }

      const updated = temp.map((item, i) => ({ ...item, index: i }));

      if (!updated.every((item, i) => item.entry === entries[i].entry)) {
        setEntries(updated);
        setText(updated.map((item) => item.entry).join("\n"));
        isSame = false;
      }
    }
  };

  const handleDisplayModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  const removeAllFromList = (text: string) => {
    setEntries(entries.filter((item) => item.entry !== text));
    setIsModalVisible(false);
  };

  const removeFromList = (index: number) => {
    setEntries(entries.filter((item) => item.index !== index));
    setIsModalVisible(false);
  };

  const hasDupelicate = (text: string) => {
    const temp = entries.filter((item) => item.entry === text);
    return temp.length > 1;
  };

  return (
    <section className="relative grid h-[100vh] grid-cols-[2fr_1fr] max-xl:grid-cols-1 max-xl:grid-rows-[auto_1fr]">
      <Wheel
        items={entries}
        addResult={addResult}
        isSpinning={isSpinning}
        setIsSpinning={setIsSpinning}
        handleDisplayModal={handleDisplayModal}
      />
      <List
        results={results}
        handleClearResults={handleClearResults}
        handleSort={handleSort}
        handleListShuffle={handleListShuffle}
        isSpinning={isSpinning}
        text={text}
        handleTextChange={handleTextChange}
      />
      {isModalVisible && (
        <>
          <BgFilter action={handleCloseModal} />
          <WinnerModal
            winner={results[results.length - 1]}
            closeModal={handleCloseModal}
            removeAllFromList={removeAllFromList}
            removeFromList={removeFromList}
            hasDupelicate={hasDupelicate}
          />
        </>
      )}
    </section>
  );
};

export default App;
