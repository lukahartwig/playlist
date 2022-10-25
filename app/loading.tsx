export default function Loading() {
  return (
    <ul role="list" className="divide-y divide-gray-200">
      {Array.from({ length: 10 }).map((_, i) => (
        <li key={i} className="py-4">
          <div className="flex animate-pulse items-center space-x-3">
            <div className="h-16 w-16 rounded-full bg-gray-200"></div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <div className="h-3 w-80 rounded bg-gray-200" />
                <div className="h-3 w-20 rounded bg-gray-200" />
              </div>
              <div className="h-3 w-60 rounded bg-gray-200" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
