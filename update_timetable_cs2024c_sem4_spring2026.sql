-- ==========================================
-- TIMETABLE UPDATE: CS-24C SEMESTER 4 
-- SPRING 2026 - LATEST UPDATE
-- Source: Weekly Schedule Excel (NUST Spring-2026-V01)
-- ==========================================

-- 1. DELETE OLD DATA for CS-24C Semester 4
DELETE FROM timetable_entries 
WHERE semester = '4th Semester' 
  AND batch = '2024'
  AND section = 'C';

-- 2. INSERT CS-24C SECTION SCHEDULE (SPRING 2026)
-- Extracted from Excel timetable sheet "CS-24-C"
INSERT INTO timetable_entries (day, time_slot, subject, faculty_name, venue, semester, batch, section) VALUES

-- MONDAY
('Monday', '08:30-09:20', 'Expository Writing', 'Uzma Shakir', '', '4th Semester', '2024', 'C'),
('Monday', '09:20-10:10', 'Expository Writing', 'Uzma Shakir', '', '4th Semester', '2024', 'C'),
('Monday', '10:10-11:00', 'Theory of Automata', 'Dr. Kanfiani', 'AC-301A', '4th Semester', '2024', 'C'),
('Monday', '11:05-12:40', 'Applied Physics Lab', 'Dr. Usman Babar', '', '4th Semester', '2024', 'C'),
('Monday', '12:40-13:30', 'Database Management Systems Lab', 'Kiran Ali', 'VD-LAN/Lec1(1-11)', '4th Semester', '2024', 'C'),

-- TUESDAY
('Tuesday', '08:30-09:20', 'Humorous/Dance', '', '', '4th Semester', '2024', 'C'),
('Tuesday', '09:20-10:10', '', '', '', '4th Semester', '2024', 'C'),
('Tuesday', '13:30-14:20', 'Applied Physics Lab', '', '', '4th Semester', '2024', 'C'),
('Tuesday', '14:20-15:10', 'Islamic Studies', 'Dr. Mushable Mir', 'AC-301A', '4th Semester', '2024', 'C'),
('Tuesday', '15:10-16:00', 'Islamic Studies', 'Dr. Mushable Mir', 'AC-301A', '4th Semester', '2024', 'C'),

-- WEDNESDAY
('Wednesday', '08:30-09:20', '', '', '', '4th Semester', '2024', 'C'),
('Wednesday', '09:20-10:10', 'Humorous/Dance', '', '', '4th Semester', '2024', 'C'),
('Wednesday', '10:10-11:00', 'Theory of Automata', '', 'AC-301A', '4th Semester', '2024', 'C'),
('Wednesday', '14:20-15:10', 'Database Management Systems Lab', '', '', '4th Semester', '2024', 'C'),

-- THURSDAY
('Thursday', '08:30-09:20', '', '', '', '4th Semester', '2024', 'C'),
('Thursday', '10:10-11:00', 'Applied Physics', 'Dr. Usman Babar', '', '4th Semester', '2024', 'C'),

-- FRIDAY
('Friday', '14:20-15:10', 'Islamic Studies', 'Dr. Mushable Mir', '', '4th Semester', '2024', 'C'),
('Friday', '15:10-16:00', 'Islamic Studies', 'Dr. Mushable Mir', '', '4th Semester', '2024', 'C');

-- Course Information for CS-24C (from course list):
-- CS230: Computer Organization & Assembly Language - Tasneem Malik - AC-301A
-- CS231: Computer Organization & Assembly Language Lab - Humairah - VD-LAN/Lec1(1-11)
-- Theory of Automata - Dr. Kanfiani - AC-301A
-- CS240: Database Management Systems - Kiran Ali - AC-301A
-- CS241: Database Management Systems Lab - Kiran Ali - VD-LAN/Lec1(1-11) - NUSTART
-- GE-234: Applied Physics - Dr. Usman Babar - NUSTART
-- GE-251: Applied Physics Lab - Dr. Usman Babar - AC-301A - NUSTART
-- EE-331: Expository Writing - Uzma Shakir - NUSTART
-- IS-101: Islamic Studies - Dr. Mushable Mir - AC-301A - NUSTART
-- MT110: Linear Algebra (Pre-Med) - Maryam Safar - NUSTART
