interface BrandMarkProps {
  className?: string;
  compact?: boolean;
}

const BrandMark = ({ className = 'h-8 w-8', compact = false }: BrandMarkProps) => {
  return (
    <div
      className={`${className} relative overflow-hidden rounded-xl border border-cyan-400/25 bg-[linear-gradient(135deg,#132033,#1a1240_55%,#0f2f35)] shadow-[0_10px_30px_rgba(0,0,0,0.28)]`}
    >
      <div className="absolute inset-[2px] rounded-[10px] bg-[radial-gradient(circle_at_top_left,rgba(110,231,255,0.22),transparent_42%),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01))]" />
      <div className="absolute left-[18%] top-[18%] h-[64%] w-[64%] rounded-full border border-cyan-300/70" />
      <div className="absolute left-[32%] top-[32%] h-[36%] w-[36%] rounded-full border border-cyan-300/60" />
      <div className="absolute inset-x-[44%] top-[18%] h-[64%] rounded-full bg-cyan-300/75 blur-[1px]" />
      <div className="absolute inset-y-[44%] left-[18%] w-[64%] rounded-full bg-cyan-300/75 blur-[1px]" />
      {!compact && (
        <div className="absolute bottom-[12%] right-[14%] rounded bg-zinc-950/75 px-[10%] py-[2%] text-[0.34em] font-black tracking-[0.18em] text-white">
          CA
        </div>
      )}
    </div>
  );
};

export default BrandMark;
