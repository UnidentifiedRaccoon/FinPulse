export type ConceptId = 'a' | 'b' | 'c' | 'd' | 'e' | 'f'
export type ConsiliumConceptId = 'a0' | 'b1' | 'c2'

export interface ConceptMeta {
  id: ConceptId
  letter: Uppercase<ConceptId>
  title: string
  hypothesis: string
  duration: string
  recommended?: boolean
}

export interface ConsiliumConceptMeta {
  id: ConsiliumConceptId
  code: Uppercase<ConsiliumConceptId>
  title: string
  hypothesis: string
  duration: string
  recommended?: boolean
}

export interface ChoiceOption {
  id: string
  label: string
}

export interface EvidencePrompt {
  id: string
  statement: string
  options: ChoiceOption[]
}

export interface DossierArtifact {
  id: string
  title: string
  text: string
  provenance: string
  scope: string
}
