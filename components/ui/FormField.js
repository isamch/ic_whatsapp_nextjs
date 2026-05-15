export default function FormField({ label, hint, error, children }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {!error && hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  )
}
