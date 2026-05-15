export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
      {Icon && (
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-gray-300" />
        </div>
      )}
      {title && <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>}
      {description && <p className="text-gray-500 text-sm">{description}</p>}
    </div>
  )
}
