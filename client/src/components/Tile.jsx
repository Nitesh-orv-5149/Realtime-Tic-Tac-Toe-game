export default function Tile({ value, onClick }) {
  return (
    <div
      onClick={onClick}
      className="h-30 w-30 border-1 border-cyan-500 rounded-lg flex items-center justify-center text-3xl cursor-pointer select-none"
    >
      {value}
    </div>
  );
}
