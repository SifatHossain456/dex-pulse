export default function Loading() {
  return (
    <div
      className="flex items-center justify-center min-h-[60vh]"
      style={{ background: '#07090d' }}
      role="status"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-[#f97316] border-t-transparent animate-spin" />
        <span className="text-sm font-medium text-gray-500">Loading pairs…</span>
      </div>
    </div>
  )
}
