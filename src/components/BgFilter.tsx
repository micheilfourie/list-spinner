const BgFilter = ({ action }: { action: () => void }) => {
  return (
    <div onClick={action} className="absolute h-full w-full bg-black/50" />
  );
};

export default BgFilter;
