export type Project = {
  number: string
  title: string
  kicker: string
  description: string
  stack: string[]
  status: string
  href?: string
  live?: string
  tone: string
  glyph: string
}

export const projects: Project[] = [
  {
    number: '01',
    title: 'Portfolio Website',
    kicker: 'Personal identity, engineered for the web.',
    description:
      'A personal portfolio for presenting projects, technical skills and engineering work through a responsive interface.',
    stack: ['React', 'JavaScript', 'UI/UX'],
    status: 'Public repository',
    href: 'https://github.com/Abhishek-Sharma10/Portfolio',
    tone: 'coral',
    glyph: 'PORTFOLIO / 01',
  },
  {
    number: '02',
    title: 'Real-Time Communication',
    kicker: 'A scalable conversation system in progress.',
    description:
      'A Java and Spring Boot communication platform focused on messaging, WebSockets, presence and notifications.',
    stack: ['Java', 'Spring Boot', 'WebSockets', 'PostgreSQL'],
    status: 'In development',
    tone: 'blue',
    glyph: 'SIGNAL / LIVE',
  },
  {
    number: '03',
    title: 'Project Management Tool',
    kicker: 'Collaborative work, made legible.',
    description:
      'A full-stack project and team collaboration platform exploring Kanban workflows, RBAC, tasks and real-time collaboration.',
    stack: ['React', 'Node.js', 'PostgreSQL', 'Socket.io'],
    status: 'Public repository',
    href: 'https://github.com/Abhishek-Sharma10/Project_Management_Tool',
    tone: 'gold',
    glyph: 'FLOW / SYSTEM',
  },
  {
    number: '04',
    title: 'BhuStack',
    kicker: 'Digital infrastructure for land governance.',
    description:
      'A GIS-based platform for parcel visualisation, land-information workflows, spatial exploration and REST-based services.',
    stack: ['React', 'FastAPI', 'PostGIS', 'Leaflet'],
    status: 'Public repository',
    href: 'https://github.com/Abhishek-Sharma10/bhustack',
    tone: 'green',
    glyph: 'LAT 29.84 / LNG 77.89',
  },
  {
    number: '05',
    title: 'Multi-Agent AI System',
    kicker: 'Specialised agents, working as one.',
    description:
      'A platform exploring agent orchestration, tool use, evidence-based reasoning and human approval workflows.',
    stack: ['Python', 'AI Agents', 'LLMs', 'Tool Calling'],
    status: 'In development',
    href: 'https://github.com/Abhishek-Sharma10/Multi-Agent-AI-System',
    tone: 'violet',
    glyph: 'AGENT / ORCHESTRATION',
  },
  {
    number: '06',
    title: 'Payment Integrity Agent',
    kicker: 'AI-assisted revenue recovery.',
    description:
      'The payment-integrity use case inside the evolving multi-agent system, built for anomaly review and human-in-the-loop decisions.',
    stack: ['Python', 'AI Agents', 'Guardrails', 'HITL'],
    status: 'Evolving into multi-agent system',
    href: 'https://github.com/Abhishek-Sharma10/Multi-Agent-AI-System',
    tone: 'cream',
    glyph: 'VERIFY / RECOVER',
  },
]

export const repositories = [
  ['Fruits classification VGG16 / VGG19', 'Fork · ML exploration', '—', 'https://github.com/Abhishek-Sharma10/Fruits-classification-using-VGG16---VGG19'],
  ['iD', 'Fork · OpenStreetMap editor', 'JavaScript', 'https://github.com/Abhishek-Sharma10/iD'],
  ['Rocket.Chat', 'Fork · Secure communications', '—', 'https://github.com/Abhishek-Sharma10/Rocket.Chat'],
  ['EmbeddedChat', 'Fork · Rocket.Chat component', 'React', 'https://github.com/Abhishek-Sharma10/EmbeddedChat'],
  ['Multi-Agent-AI-System', 'Payment integrity agent', 'Python', 'https://github.com/Abhishek-Sharma10/Multi-Agent-AI-System'],
  ['Tic-Tac-Toe', 'Interactive experiment', 'JavaScript', 'https://github.com/Abhishek-Sharma10/Tic-Tac-Toe'],
  ['Abhishek-Sharma10', 'Profile repository', '—', 'https://github.com/Abhishek-Sharma10/Abhishek-Sharma10'],
  ['Rock-Paper-Scissor', 'Interactive experiment', 'JavaScript', 'https://github.com/Abhishek-Sharma10/Rock-Paper-Scissor'],
  ['Portfolio', 'Personal portfolio', 'CSS', 'https://github.com/Abhishek-Sharma10/Portfolio'],
  ['bhustack', 'Land governance platform', 'HTML', 'https://github.com/Abhishek-Sharma10/bhustack'],
  ['Project_Management_Tool', 'Collaborative workflows', 'JavaScript', 'https://github.com/Abhishek-Sharma10/Project_Management_Tool'],
  ['password-protected-site', 'Web experiment', 'HTML', 'https://github.com/Abhishek-Sharma10/password-protected-site'],
  ['terminal-qr-generator', 'CLI QR image generator', 'JavaScript', 'https://github.com/Abhishek-Sharma10/terminal-qr-generator'],
  ['Simon Game', 'DOM and interaction study', 'JavaScript', 'https://github.com/Abhishek-Sharma10/Simon-Game-Challenge-Starting-File'],
  ['sathihomecare-website', 'Fork · web project', 'JavaScript', 'https://github.com/Abhishek-Sharma10/sathihomecare-website'],
  ['drum-kit', 'Keyboard and click audio app', 'JavaScript', 'https://github.com/Abhishek-Sharma10/drum-kit'],
] as const

export const capabilities = [
  ['01', 'Programming & CS', ['Java', 'C++', 'Python', 'JavaScript', 'TypeScript']],
  ['02', 'Frontend Engineering', ['HTML5', 'CSS3', 'React', 'Vite', 'Tailwind CSS']],
  ['03', 'Backend Engineering', ['Node.js', 'Express.js', 'FastAPI', 'Spring Boot']],
  ['04', 'Data & Spatial', ['PostgreSQL', 'PostGIS', 'MongoDB', 'Redis']],
  ['05', 'AI & Automation', ['AI agents', 'LLM integration', 'Tool calling', 'Human-in-the-loop']],
  ['06', 'Developer Tools', ['Git', 'GitHub', 'Docker', 'Linux', 'VS Code']],
] as const
