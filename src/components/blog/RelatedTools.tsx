import Link from "next/link"

interface Tool {
  title: string
  href: string
  description: string
}

interface Props {
  tools: Tool[]
}

export default function RelatedTools({ tools }: Props) {
  return (
    <section className="mt-12">
      <h2 className="text-white text-xl font-bold mb-6">Try These Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="block bg-[#1e2d4a] rounded-xl p-5 border border-transparent hover:border-[#e94560] transition-all duration-200 group"
          >
            <div className="text-white font-semibold mb-1 group-hover:text-[#e94560] transition-colors">
              {tool.title}
            </div>
            <div className="text-[#a8a8b3] text-sm mb-3">{tool.description}</div>
            <div className="text-[#e94560] text-sm font-medium">Open tool →</div>
          </Link>
        ))}
      </div>
    </section>
  )
}
