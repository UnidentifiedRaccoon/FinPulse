import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'

interface LabHeaderProps {
  compact?: boolean
  onAbout?: () => void
}

export function LabHeader({ compact = false, onAbout }: LabHeaderProps) {
  if (compact) {
    return (
      <header className="lab-header lab-header--compact">
        <span className="brand">ФинПульс</span>
        <Link className="header-link" to="/lab">
          <ArrowLeft aria-hidden="true" />
          Все версии
        </Link>
      </header>
    )
  }

  return (
    <header className="lab-header">
      <Link className="brand" to="/lab">
        ФинПульс
      </Link>
      {onAbout ? (
        <button className="header-link button-reset" type="button" onClick={onAbout}>
          О демке
        </button>
      ) : (
        <Link className="header-link" to="/lab">Все версии</Link>
      )}
    </header>
  )
}
