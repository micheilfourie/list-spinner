import Button from "./Button";

type WinnerModalProps = {
  winner: { result: string; index: number };
  closeModal: () => void;
  removeAllFromList: (text: string) => void;
  removeFromList: (index: number) => void;
};

const WinnerModal = ({
  winner,
  closeModal,
  removeAllFromList,
  removeFromList,
}: WinnerModalProps) => {
  return (
    <div className="bg-dark-secondary absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-start justify-center rounded-lg p-6 text-white">
      <h1 className="text-4xl">And the winner is...</h1>
      <br />
      <p className="text-2xl">{winner.result}</p>
      <br />
      <div className="mt-4 flex w-full gap-2">
        <Button action={closeModal} isFullWidth>
          Close
        </Button>
        <Button action={() => removeFromList(winner.index)} isFullWidth>
          Remove
        </Button>
        <Button action={() => removeAllFromList(winner.result)} isFullWidth>
          Remove All
        </Button>
      </div>
    </div>
  );
};

export default WinnerModal;
