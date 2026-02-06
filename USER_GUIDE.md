# 📘 NUConnect Student Portal - User Manual

Welcome to **NUConnect**, the centralized digital campus portal designed specifically for NUTECH students. This guide will help you navigate and use all the features effectively.

---

## 🚀 1. Getting Started

### Registration
- Go to the portal URL.
- Click **"Register Now"**.
- Fill in your details (Full Name, Email, Batch, Semester, Section).
- *Note: NUTECH ID is optional.*
- Since email verification is currently disabled, you will be logged in immediately after clicking **"Create Account"**.

### Login
- Use your registered email and password.
- If you've forgotten your password, use the **"Forgot Password?"** link to receive a reset email.

---

## 🏠 2. Dashboard
The Dashboard is your command center. It shows:
- **Quick Stats:** Your current semester and department.
- **Today's Schedule:** A quick look at your classes for the current day.
- **Recent Announcements:** The latest news from the department and university.

---

## 📅 3. Weekly Plan (Timetable)
This is a high-powered schedule manager.
- **Semester Selector:** View timetables for all 8 semesters.
- **Daily View:** Click on day tabs (Mon-Fri) to see specific class timings, subjects, and venues (e.g., AC-301, CL-01).
- **Weekly Overview:** A full table view of your week.
- **Course List:** Detailed list of all subjects in your semester with assigned faculty (e.g., Lec. Alina Maryum, Lec. Sundas Rana).

---

## 📝 4. Exams & Academics

### Date Sheet
- View Midterm and Final Exam schedules.
- See venues and timings for your specific subjects.
- Countdown timers show you exactly how many days are left for each exam.

### Syllabus
- View and download course outlines for all subjects.
- Stay updated on what topics will be covered in your exams.

# NUConnect — Admin Instructions

## 🛡️ Accessing the Admin Panel
1. Ensure your account has 'Admin' privileges.
2. Log in with your university credentials.
3. Select **🛡️ Admin Panel** from the sidebar.

## 📅 Managing Timetables (Image/PDF)
Instead of manual entry, you can now upload the official timetable as an image or PDF:
1. Go to **Admin Panel > Timetable**.
2. Click **Add New**.
3. Select the **Semester** and **Batch** for this timetable.
4. Upload the image/PDF file from your device.
5. Click **Publish Timetable**.
6. The timetable will now appear prominently at the top of the **Weekly Plan** page for all students in that group.

## 📄 Academic Documents
To upload Syllabus or Date Sheets:
1. Go to **Admin Panel > Academic Docs**.
2. Click **Add New**.
3. Select the **Category** (e.g., Syllabus), **Semester**, and **Batch**.
4. Upload the file.
5. Click **Publish Document**.
6. Students will find these in their respective **Syllabus** or **Date Sheet** pages.

## ⚙️ Supabase Setup (Very Important)
Before uploading files, you must create a Storage bucket in Supabase:
1. Go to your **Supabase Dashboard**.
2. Go to **Storage**.
3. Create a new **Public** bucket named `portal-docs`.
4. Ensure the bucket has **RLS policies** to allow 'Authenticated' users to upload and 'Everyone' to view.

---

# NUConnect Portal — Student Guide

## 🤖 5. Special Features

### Study Buddy AI
- Personalized AI assistant to help you with your studies.
- Ask questions about your courses or general academic advice.

### Classroom Sync
- View your Google Classroom assignments and links in one place.
- Keep track of deadlines and submission statuses.

---

## 📞 6. Contacts & Communication

### Faculty Contacts
- Search for faculty members by name or specialization.
- Get official emails (e.g., `alinamaryum@nutech.edu.pk`) and office locations.
- Specialized categories for Senior Faculty, Lecturers, and Lab Engineers.

### Announcements
- Filter news by Priority (High/Medium/Low) or Category (Exams, Events, Academic).
- Stay updated on site-wide notifications.

---

## 💰 7. Fees & Complaints

### Fees & Payments
- View your current fee status (Paid/Unpaid).
- Download official NUTECH fee forms (Installment policy, etc.).
- Securely upload your payment proof (receipt screenshots).

### Complaints
- Submit academic or campus-related complaints directly through the portal.
- Track the status of your reported issues.

---

## 🔐 8. Troubleshooting

### "Database Error" or "Empty Data"
- Ensure you have run the `supabase-setup.sql` in your Supabase SQL Editor. This is required for profiles to work.

### Folder Location
- Your project files are located at: `C:\Users\hp\Downloads\Centralized Student Portal\NU- Connect`

### Running Locally
- Open PowerShell in the folder.
- Run: `npm run dev`
- Open: `http://localhost:3000`

---

## 👩‍💻 Credits
**Developed by:** Amna Khurram
**Department:** Computer Science, 2024 Batch
**ID:** F24605061
**Specialization:** Full Stack Development

---

*For technical support, contact the IT Help Desk via the Contacts section.*
