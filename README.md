# 🎓 NUConnect — Your Digital Campus

Developed with ❤️ by **Amna Khurram**

NUConnect is a centralized, high-performance student portal designed to streamline the academic experience for students. It combines real-time data synchronization with aggressive offline capabilities, ensuring students have access to their most critical info anytime, anywhere.

### 🔗 Live Deployment
**[nu-connect.vercel.app](https://nu-connect.vercel.app)**

---

## 🚀 Key Features

### 🧠 Study Buddy AI (Persistent & Lite)
*   **Master CS Knowledge Base**: Deep coverage of Computer Science topics from Semester 1 to 8 (SDLC, Agile, ML, OS, Blockchain).
*   **Persistent PDF Learning**: Upload your notes/syllabi, and the AI memorizes them across sessions.
*   **Lite Mode**: A dedicated, ultra-lightweight PWA for instant offline access even in low-connectivity areas.
*   **Accessibility First**: High-contrast modes, text-to-speech, and simple-language explanations.

### 📅 Smart Timetable & Attendance
*   **Dynamic Scheduling**: Automated timetable updates for all CS 2024 sections.
*   **Attendance Tracker**: Log your daily attendance and monitor eligibility thresholds in real-time.

### 💸 Digital Fee Management
*   **Fee Records**: View semester-wise fee structures and status.
*   **Challan Uploads**: Securely upload payment screenshots for admin verification.

### 📜 Digital Repository
*   **Syllabus & Datesheets**: Instant downloads for course outlines and exam schedules.
*   **Complaints Portal**: Register student grievances directly with the administration.

---

## 🛠️ Technology Stack

*   **Frontend**: React 18, Vite, Typecript
*   **Styling**: Tailwind CSS (Lucide Icons, Radix UI)
*   **Backend/Database**: Supabase (PostgreSQL, Realtime, Storage)
*   **PWA/Offline**: Custom Service Workers, LocalStorage Persistence
*   **Document Processing**: PDF.js (Client-side extraction)

---

## 📁 Repository Structure (Architectural View)

```text
├── src/                # Core application logic (React + TSX)
│   ├── components/     # UI Components (StudyBuddy, Dashboard, etc.)
│   ├── data/           # Core knowledge bases and constants
│   └── lib/            # Internal utilities (Supabase client)
├── study-buddy-lite/   # Standalone PWA Lite version
├── database/           # SQL Infrastructure
│   ├── schema/         # Core tables and security policies 
│   └── updates/        # Timetable and maintenance scripts
├── docs/               # System PRD, Design, and Guides
├── scripts/            # Testing and deployment logs
└── public/             # Static assets
```

---

## ⚙️ Setup & Installation

1.  **Clone the Repo**:
    ```bash
    git clone https://github.com/your-username/nu-connect.git
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Setup Environment**:
    Create a `.env` file with your Supabase credentials:
    ```text
    VITE_SUPABASE_URL=your_url
    VITE_SUPABASE_ANON_KEY=your_key
    ```
4.  **Launch**:
    ```bash
    npm run dev
    ```

---

*© 2026 NUConnect Project. Designed and Engineered by Amna Khurram.*