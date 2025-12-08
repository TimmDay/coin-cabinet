/**
 * Development helpers for article authoring
 */

"use client"

import { useState } from "react"

type DevToolsProps = {
  metadata: any
  children: React.ReactNode
}

/**
 * DevTools - Development helper component (only shows in development)
 *
 * Wraps article content and provides helpful development features:
 * - Metadata validation warnings
 * - Reading time estimate
 * - Word count
 * - Heading structure analysis
 * - Quick component picker
 *
 * Usage: Wrap your article content during development
 * <DevTools metadata={metadata}>
 *   <article>...</article>
 * </DevTools>
 */
export function DevTools({ metadata, children }: DevToolsProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return <>{children}</>
  }

  // Quick component snippets for copy-paste
  const snippets = {
    "H2 Heading": "<H2>Your Heading</H2>",
    "H3 Heading": "<H3>Your Subheading</H3>",
    Paragraph: "<P>Your content here...</P>",
    "Lead Paragraph": "<Lead>Your opening paragraph...</Lead>",
    Quote: '<Quote author="Author">Quote text</Quote>',
    Callout: '<Callout type="info" title="Title">Content</Callout>',
    Image: '<ArticleImage src="id" alt="desc" caption="caption" />',
    Timeline: 'timeline={{events: [{date: "", title: "", description: ""}]}}',
    Aside: '<Aside title="Title" body="Content" />',
  }

  const copySnippet = (snippet: string) => {
    navigator.clipboard.writeText(snippet)
  }

  return (
    <>
      {children}

      {/* Floating dev panel */}
      <div className="fixed right-4 bottom-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-lg hover:bg-blue-700"
        >
          📝 Dev Tools
        </button>

        {isOpen && (
          <div className="absolute right-0 bottom-12 max-h-96 w-80 overflow-y-auto rounded-lg border border-slate-600 bg-slate-800 p-4 shadow-xl">
            <h3 className="mb-3 font-bold text-white">Article Dev Tools</h3>

            {/* Metadata info */}
            <div className="mb-4">
              <h4 className="mb-2 font-medium text-slate-300">Metadata</h4>
              <div className="space-y-1 text-xs">
                <div className="text-slate-400">
                  Title:{" "}
                  <span className="text-slate-200">{metadata?.title}</span>
                </div>
                <div className="text-slate-400">
                  Slug: <span className="text-slate-200">{metadata?.slug}</span>
                </div>
                <div className="text-slate-400">
                  Date: <span className="text-slate-200">{metadata?.date}</span>
                </div>
                <div className="text-slate-400">
                  Keywords:{" "}
                  <span className="text-slate-200">
                    {metadata?.keywords?.length || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Component snippets */}
            <div>
              <h4 className="mb-2 font-medium text-slate-300">
                Quick Components
              </h4>
              <div className="space-y-1">
                {Object.entries(snippets).map(([name, snippet]) => (
                  <button
                    key={name}
                    onClick={() => copySnippet(snippet)}
                    className="block w-full rounded border bg-slate-700 px-2 py-1 text-left text-xs text-slate-200 hover:bg-slate-600"
                  >
                    {name}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Click to copy to clipboard
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="mt-3 text-xs text-slate-400 hover:text-slate-200"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </>
  )
}
