# NUConnect — Technical Implementation Guide

## 1. System Architecture
NUConnect is built on a modern **Serverless Client-Side Architecture**, utilizing a decoupled backend and a high-performance frontend.

### Tech Stack:
- **Frontend Framework:** React 18 (Vite-based)
- **Styling:** Tailwind CSS (Modern Utility-First)
- **Backend-as-a-Service:** Supabase (PostgreSQL + Auth + Storage)
- **Deployment:** Vercel (Edge Network)
- **AI Integration:** Google Gemini Pro API (via Generative-AI SDK)

## 2. Methodology & Code Organization
The codebase follows a **Modular Component Architecture**, ensuring high reusability and maintainability.

### Key Directories:
- `/src/components`: Atomic and molecular UI components (Dashboard, StudyBuddy, etc.).
- `/src/lib`: Core utility singletons (Supabase client configuration).
- `/src/types`: Centralized TypeScript definitions (forthcoming).

## 3. Core Engine Logic
### A. Authentication & User Context
The application uses Supabase GoTrue for JWT-based authentication. User metadata (semester, batch, registration_no) is extracted on-mount and persisted via a centralized `App.tsx` state, ensuring a synchronized experience across all components.

### B. Intelligent Data Fetching
Components like `ClassroomSync` and `WeeklyPlan` utilize conditional PostgreSQL queries:
- **RLS (Row Level Security):** Data is isolated at the database level. Students can only view their own attendance, while Admins have full CRUD access.
- **Dynamic Targeting:** Filtering logic automatically adapts to the logged-in user's semester and section (`A`, `B`, `C`, or `All`).

### C. Storage Logic
Academic documents and Timetables are handled via a specialized `portal-docs` bucket. The system implements:
- **Filename Sanitization:** Unique hash generation for uploaded assets.
- **Public URL Mapping:** Real-time retrieval of signed/public URLs for instantaneous viewing.

## 4. Security Framework
- **Environment Variables:** All API keys and Database URIs are managed through `.env` and Vercel secrets.
- **Policy-Based Control:** Granular RLS policies control table access (`SELECT` for students, `ALL` for admins based on email/role).

## 5. Scalability & Performance
- **Optimized Assets:** Use of SVG icons (Lucide-React) for resolution independence.
- **Build Optimization:** Vite-based bundling with tree-shaking for minimal JS footprint.

---
*Developed by Amna Khurram | NU Computer Science 2024*
