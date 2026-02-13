-- ==========================================
-- TIMETABLE UPDATE: CS-24A SEMESTER 4 
-- SPRING 2026 - LATEST UPDATE
-- Source: Weekly Schedule Excel (NUST Spring-2026-V01)
-- ==========================================

-- 1. DELETE OLD DATA for CS-24A Semester 4
DELETE FROM timetable_entries 
WHERE semester = '4th Semester' 
  AND batch = '2024'
  AND section = 'A';

-- 2. INSERT CS-24A SECTION SCHEDULE (SPRING 2026)
-- Extracted from Excel timetable sheet "CS-24-A"
INSERT INTO timetable_entries (day, time_slot, subject, faculty_name, venue, semester, batch, section) VALUES

-- MONDAY
('Monday', '08:30-09:20', 'Computer Organization & Assembly Language', 'Shama Zahir', 'AC-7W3', '4th Semester', '2024', 'A'),
('Monday', '09:20-10:10', 'Computer Organization & Assembly Language', 'Shama Zahir', 'AC-7W3', '4th Semester', '2024', 'A'),
('Monday', '10:10-11:00', 'Expo Writing', '', '', '4th Semester', '2024', 'A'),
('Monday', '11:50-12:40', 'Theory of Automata', '', '', '4th Semester', '2024', 'A'),
('Monday', '12:40-13:30', 'Theory of Automata', '', '', '4th Semester', '2024', 'A'),

-- TUESDAY
('Tuesday', '08:30-09:20', 'Expo Writing', '', '', '4th Semester', '2024', 'A'),
('Tuesday', '09:20-10:10', 'Expo Writing', '', '', '4th Semester', '2024', 'A'),
('Tuesday', '10:10-11:00', 'Theory of Automata', 'Naveed Yarad', 'AC-7W3', '4th Semester', '2024', 'A'),
('Tuesday', '11:00-11:50', 'Applied Physics', 'Dr. Usman Babar', 'AC-7W3', '4th Semester', '2024', 'A'),
('Tuesday', '11:50-12:40', 'Advanced Database Management Systems Lab', '', '', '4th Semester', '2024', 'A'),
('Tuesday', '12:40-13:30', 'Computer Organization & Assembly Language Lab', '', '', '4th Semester', '2024', 'A'),

-- WEDNESDAY
('Wednesday', '10:10-11:00', 'Theory of Automata', '', '', '4th Semester', '2024', 'A'),
('Wednesday', '11:00-11:50', 'Theory of Automata', '', '', '4th Semester', '2024', 'A'),
('Wednesday', '11:50-12:40', 'Applied Physics', '', '', '4th Semester', '2024', 'A'),

-- THURSDAY
('Thursday', '14:20-16:10', 'Islamic Studies', 'Dr. Noushale Mir', 'AC-7W3', '4th Semester', '2024', 'A'),

-- FRIDAY
('Friday', '14:20-16:10', 'Islamic Studies', 'Dr. Noushale Mir', 'AC-7W3', '4th Semester', '2024', 'A');

-- Course Information for CS-24A:
-- CS230: Computer Organization & Assembly Language (Shama Zahir)
-- CS231: Computer Organization & Assembly Language Lab (Naveed Ahmed - VD-Lid3)
-- Theory of Automata (Naveed Yarad - AC-7W3)
-- CS230: Database Management Systems (Fakhra Younas - AC-7W3)
-- CS231: Database Management Systems Lab (Fakhra Younas - VD-Lid3)
-- GE-234: Applied Physics (Dr. Usman Babar - AC-7W3) - NUSTART
-- GE-251: Applied Physics Lab (Dr. Usman Babar - Physics Lab) - NUSTART
-- IS-101: Islamic Studies (Dr. Noushale Mir - AC-7W3) - NUSTART
-- Linear Algebra Pre-Med (Masoom Yarar - AC-7W3)
