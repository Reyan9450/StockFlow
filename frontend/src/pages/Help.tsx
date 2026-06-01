import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronDown, ChevronUp, BookOpen, MessageCircle, Video, FileText, ExternalLink, Zap } from 'lucide-react'

const faqs = [
  { q: 'How do I add a new product?', a: 'Navigate to the Products page and click "Add Product". Fill in the required fields including name, SKU, price, and quantity, then click "Create Product".' },
  { q: 'What happens to stock when an order is placed?', a: 'Stock is automatically reduced when an order is created. If you delete an order, the stock is automatically restored to the original levels.' },
  { q: 'Can I have duplicate SKUs?', a: 'No. SKUs must be unique across all products. The system will reject any attempt to create or update a product with a duplicate SKU.' },
  { q: 'How do I switch between light and dark mode?', a: 'Click the sun/moon icon in the top navigation bar, or go to Settings → Theme to choose your preferred color mode.' },
  { q: 'What does "Low Stock" mean?', a: 'A product is flagged as low stock when its quantity falls below 10 units. These products appear in the Dashboard low stock alert card.' },
  { q: 'Can I export data?', a: 'Data export functionality is on the roadmap. Currently you can access all data via the REST API documented at /docs.' },
  { q: 'How is the total order amount calculated?', a: 'The backend calculates the total by summing (product price × quantity) for each item. Frontend estimates are for preview only — the server value is authoritative.' },
  { q: 'How do I connect to the API?', a: 'The API base URL is configured via the VITE_API_URL environment variable. Full API documentation is available at /docs (Swagger UI) or /redoc.' },
]

const resources = [
  { icon: BookOpen, title: 'Documentation', desc: 'Full API reference and guides', href: '#', color: 'from-navy-700 to-navy-900' },
  { icon: Video, title: 'Video Tutorials', desc: 'Step-by-step walkthroughs', href: '#', color: 'from-violet-500 to-purple-600' },
  { icon: FileText, title: 'Release Notes', desc: 'What\'s new in each version', href: '#', color: 'from-emerald-500 to-teal-600' },
  { icon: MessageCircle, title: 'Community', desc: 'Ask questions and share tips', href: '#', color: 'from-golden-400 to-golden-600' },
]

export function Help() {
  const [search, setSearch] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const filtered = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[900px] mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
        <div className="w-16 h-16 rounded-3xl gradient-golden flex items-center justify-center mx-auto mb-4 shadow-glow">
          <Zap className="w-8 h-8 text-navy-900" />
        </div>
        <h1 className="text-4xl font-heading font-bold text-foreground">Help Center</h1>
        <p className="text-muted-foreground mt-2 text-lg">Find answers, guides, and resources</p>

        {/* Search */}
        <div className="relative max-w-md mx-auto mt-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search help articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-sm bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring shadow-card"
          />
        </div>
      </motion.div>

      {/* Resources */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-xl font-heading font-semibold text-foreground mb-4">Resources</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {resources.map((r, i) => (
            <motion.a
              key={r.title}
              href={r.href}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              whileHover={{ y: -3 }}
              className="bg-card border border-border rounded-3xl p-5 shadow-card hover:shadow-card-hover transition-shadow group"
            >
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${r.color} flex items-center justify-center mb-3`}>
                <r.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-semibold text-foreground">{r.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* FAQ */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
          Frequently Asked Questions
          {search && <span className="text-sm font-normal text-muted-foreground ml-2">({filtered.length} results)</span>}
        </h2>
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No results for "{search}"</p>
            </div>
          ) : (
            filtered.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="bg-card border border-border rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/30 transition-colors"
                >
                  <span className="text-sm font-semibold text-foreground pr-4">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="px-5 pb-4 border-t border-border"
                  >
                    <p className="text-sm text-muted-foreground pt-3 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Contact */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-3xl p-8 text-center"
      >
        <MessageCircle className="w-10 h-10 text-golden-400 mx-auto mb-3" />
        <h3 className="text-xl font-heading font-bold text-white">Still need help?</h3>
        <p className="text-white/60 mt-2 text-sm">Our support team is available Monday–Friday, 9am–6pm EST</p>
        <button className="mt-5 px-6 py-3 bg-golden-500 hover:bg-golden-400 text-navy-900 font-semibold rounded-2xl transition-colors text-sm">
          Contact Support
        </button>
      </motion.div>
    </div>
  )
}
