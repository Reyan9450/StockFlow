/**
 * Team Members — stored in localStorage.
 * Manager invites viewers by email + name.
 * Invited viewers log in with their email + password "viewer123".
 */

export interface TeamMember {
  id: string
  name: string
  email: string
  role: 'Read Only'
  addedAt: string
}

const TEAM_KEY = 'stockify_team'

export function getTeamMembers(): TeamMember[] {
  try {
    const stored = localStorage.getItem(TEAM_KEY)
    return stored ? (JSON.parse(stored) as TeamMember[]) : []
  } catch {
    return []
  }
}

export function saveTeamMembers(members: TeamMember[]): void {
  localStorage.setItem(TEAM_KEY, JSON.stringify(members))
}

export function addTeamMember(name: string, email: string): TeamMember | null {
  const members = getTeamMembers()
  // Prevent duplicates
  if (members.find(m => m.email.toLowerCase() === email.toLowerCase())) return null
  const member: TeamMember = {
    id: Math.random().toString(36).slice(2),
    name,
    email,
    role: 'Read Only',
    addedAt: new Date().toISOString(),
  }
  saveTeamMembers([...members, member])
  return member
}

export function removeTeamMember(id: string): void {
  saveTeamMembers(getTeamMembers().filter(m => m.id !== id))
}

export function findTeamMemberByEmail(email: string): TeamMember | undefined {
  return getTeamMembers().find(m => m.email.toLowerCase() === email.toLowerCase())
}
