'use client'

import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div style={{ margin: '40px 0' }}>
      <h2 style={{
        color: '#ffffff',
        fontSize: '22px',
        fontWeight: '700',
        marginBottom: '16px'
      }}>
        Frequently Asked Questions
      </h2>
      {items.map((item, index) => {
        const isOpen = openIndex === index
        return (
          <div
            key={index}
            style={{
              background: '#1e2d4a',
              borderRadius: '8px',
              marginBottom: '8px',
              overflow: 'hidden'
            }}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                borderLeft: isOpen ? '4px solid #e94560' : '4px solid transparent'
              }}
            >
              <span style={{
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: '600',
                paddingRight: '16px'
              }}>
                {item.question}
              </span>
              <span style={{
                color: '#e94560',
                fontSize: '22px',
                fontWeight: '300',
                flexShrink: 0,
                lineHeight: 1
              }}>
                {isOpen ? '−' : '+'}
              </span>
            </button>
            <div
              style={{
                maxHeight: isOpen ? '400px' : '0px',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease'
              }}
            >
              <p style={{
                color: '#a8a8b3',
                fontSize: '14px',
                lineHeight: '1.7',
                padding: '0 20px 16px 20px',
                margin: 0
              }}>
                {item.answer}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
