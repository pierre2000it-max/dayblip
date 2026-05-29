export default function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const diff = Math.max(0, Math.ceil((targetDate.getTime() - Date.now()) / 86400000));
  return (
    <div className="text-4xl font-bold text-white">
      {diff} <span className="text-[#a8a8b3] text-lg font-normal">days to go</span>
    </div>
  );
}
