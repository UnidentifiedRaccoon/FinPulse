import { Check, Copy, LockKeyhole, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

import type { ChoiceOption, EvidencePrompt } from '../types'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: 'primary' | 'secondary' | 'text'
}

export function Button({ className = '', tone = 'primary', type = 'button', ...props }: ButtonProps) {
  return <button className={`button button--${tone} ${className}`.trim()} type={type} {...props} />
}

export function ActionRow({ children }: { children: React.ReactNode }) {
  return <div className="action-row">{children}</div>
}

interface ChoiceFieldProps {
  prompt: EvidencePrompt
  value?: string
  onChange: (value: string) => void
  layout?: 'stack' | 'inline'
}

export function ChoiceField({ prompt, value, onChange, layout = 'stack' }: ChoiceFieldProps) {
  return (
    <fieldset className={`choice-field choice-field--${layout}`}>
      <legend>{prompt.statement}</legend>
      <div className="choice-options">
        {prompt.options.map((option) => (
          <label className={value === option.id ? 'choice-option is-selected' : 'choice-option'} key={option.id}>
            <input
              checked={value === option.id}
              name={prompt.id}
              onChange={() => onChange(option.id)}
              type="radio"
              value={option.id}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

interface CheckboxListProps {
  legend: string
  options: ChoiceOption[]
  selected: string[]
  onToggle: (id: string) => void
}

export function CheckboxList({ legend, options, selected, onToggle }: CheckboxListProps) {
  return (
    <fieldset className="choice-field">
      <legend>{legend}</legend>
      <div className="choice-options">
        {options.map((option) => (
          <label className={selected.includes(option.id) ? 'choice-option is-selected' : 'choice-option'} key={option.id}>
            <input
              checked={selected.includes(option.id)}
              onChange={() => onToggle(option.id)}
              type="checkbox"
              value={option.id}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function PrivacyNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="privacy-note">
      <LockKeyhole aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}

export function ScopeFeedback({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="scope-feedback" aria-live="polite">
      <p className="section-label">{title}</p>
      <div>{children}</div>
    </section>
  )
}

export function StageRail({ labels, active }: { labels: string[]; active: number }) {
  return (
    <ul className="stage-rail" aria-label="Режим прохождения">
      {labels.map((label, index) => (
        <li aria-current={index === active ? 'true' : undefined} className={index === active ? 'is-active' : ''} key={label}>
          {label}
        </li>
      ))}
    </ul>
  )
}

export function CopyTakeaway({ text, label = 'Скопировать памятку' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Button onClick={copy} tone="secondary">
      {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      <span aria-live="polite">{copied ? 'Скопировано' : label}</span>
    </Button>
  )
}

export function CompletionActions({ onRepeat }: { onRepeat: () => void }) {
  return (
    <ActionRow>
      <Button onClick={onRepeat} tone="secondary">
        <RotateCcw aria-hidden="true" />
        Пройти ещё раз
      </Button>
      <Link className="button button--primary" to="/">
        Выбрать другую версию
      </Link>
    </ActionRow>
  )
}
