interface CategoryBadgeProps {
  category: string
}

const categoryColors: Record<string, string> = {
  Food: 'bg-orange-100 text-orange-700',
  Transport: 'bg-blue-100 text-blue-700',
  Housing: 'bg-green-100 text-green-700',
  Entertainment: 'bg-purple-100 text-purple-700',
  Health: 'bg-red-100 text-red-700',
  Shopping: 'bg-pink-100 text-pink-700',
  Utilities: 'bg-yellow-100 text-yellow-700',
  Education: 'bg-indigo-100 text-indigo-700',
  Other: 'bg-gray-100 text-gray-700',
}

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  const colorClass = categoryColors[category] || categoryColors['Other']
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {category}
    </span>
  )
}
