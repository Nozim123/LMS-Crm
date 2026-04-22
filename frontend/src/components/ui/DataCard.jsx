export default function DataCard({ title, value }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
