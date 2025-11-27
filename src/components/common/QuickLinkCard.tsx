type QuickLinkCardProps = {
  title: string;
  value: number | string;
  color: string;
  icon: string;
};

function QuickLinkCard({ title, value, color, icon }: QuickLinkCardProps) {
  return (
    <div
      className={`${color} flex h-28 flex-col justify-between rounded-xl p-3 text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg`}
    >
      <div className="flex items-start justify-between">
        <span className="text-2xl" aria-hidden>
          {icon}
        </span>
        <span className="text-lg font-bold">{value}</span>
      </div>
      <p className="text-sm font-semibold">{title}</p>
    </div>
  );
}

export default QuickLinkCard;
