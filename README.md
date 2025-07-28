# AI Interview Question Generator

A professional web application for generating AI-powered interview questions. Perfect for educators, job seekers, and interviewers.

## Features

- **Role-Based Dashboards**: Separate interfaces for Educators, Job Seekers, and Interviewers
- **AI Question Generation**: Generate tailored interview questions by job title and difficulty
- **User Authentication**: Complete sign up/sign in system with role selection
- **PDF Export**: Download question sets as PDF files
- **Professional Design**: Clean, monochrome interface optimized for professional use
- **Demo Mode**: Try the app instantly with demo accounts

## Quick Start

### Demo Mode (No Setup Required)

1. Visit the application
2. Click "Sign In"
3. Use one of the demo login buttons:
   - **Demo as Educator**
   - **Demo as Job Seeker**
   - **Demo as Interviewer**

### Development Setup

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`
4. Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with custom styling
- **Authentication**: Local storage (demo) / Supabase (production)
- **PDF Generation**: jsPDF
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Project Structure

\`\`\`
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   └── ui/             # Reusable UI components
├── contexts/           # React contexts (Auth)
├── lib/                # Utility functions
├── pages/              # Page components
└── scripts/            # Database scripts
\`\`\`

## Authentication

The app includes a complete authentication system:

- **Sign Up**: Create new accounts with email/password
- **Sign In**: Login with existing credentials
- **Role Selection**: Choose between Educator, Job Seeker, or Interviewer
- **Protected Routes**: Automatic redirects based on auth status
- **Demo Accounts**: Instant access without registration

## Dashboards

### Educator Dashboard
- Course management
- Student progress tracking
- Question set creation
- Analytics and reporting

### Job Seeker Dashboard
- Interview practice sessions
- Progress tracking
- Skill development
- Performance analytics

### Interviewer Dashboard
- AI question generation
- Candidate management
- Interview scheduling
- Question set management

## Deployment

The app can be deployed to Vercel, Netlify, or any platform supporting Next.js.

For production use with persistent data, configure Supabase:

1. Create a Supabase project
2. Run the SQL script in `scripts/create-profiles-table.sql`
3. Add environment variables:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   \`\`\`

## License

MIT License - feel free to use this project for personal or commercial purposes.
