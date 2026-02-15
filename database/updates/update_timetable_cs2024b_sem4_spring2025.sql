-- ==========================================
-- TIMETABLE UPDATE: CS-24B SEMESTER 4 
-- SPRING 2025 - LATEST UPDATE
-- Source: Weekly Schedule Excel (NUST Spring-2026-V01)
-- ==========================================

-- 1. DELETE OLD DATA for CS-24B Semester 4
DELETE FROM timetable_entries 
WHERE semester = '4th Semester' 
  AND batch = '2024'
  AND section = 'B';

-- 2. INSERT CS-24B SECTION SCHEDULE (SPRING 2025)
-- Extracted from Excel timetable sheet "CS-24-B"
INSERT INTO timetable_entries (day, time_slot, subject, faculty_name, venue, semester, batch, section) VALUES

-- MONDAY
('Monday', '08:30-09:20', 'Computer Organization & Assembly Language', 'Jamshaid Latif', 'CTG', '4th Semester', '2024', 'B'),
('Monday', '09:25-10:15', 'Computer Organization & Assembly Language', 'Jamshaid Latif', '', '4th Semester', '2024', 'B'),
('Monday', '10:20-11:10', 'Computer Organization & Assembly Language Lab', 'Jamshaid Latif', 'Humaa Ahmed', '4th Semester', '2024', 'B'),
('Monday', '10:20-11:10', 'Advanced Database Management Systems', 'Fakhira Younas', 'Vue de Verifier', '4th Semester', '2024', 'B'),
('Monday', '12:50-13:40', 'Theory of Automata', 'Masoom Yawar', 'AC-VD3', '4th Semester', '2024', 'B'),
('Monday', '13:20-14:20', 'Expository Writing', '', 'AC-VD3', '4th Semester', '2024', 'B'),

-- TUESDAY
('Tuesday', '08:30-09:20', 'Applied Physics Lab', '', 'N-221', '4th Semester', '2024', 'B'),
('Tuesday', '10:20-11:10', 'Computer Organization & Assembly Language Lab', '', 'Humaa Ahmed', '4th Semester', '2024', 'B'),
('Tuesday', '12:50-13:40', 'Expository Writing', '', 'NUSTART', '4th Semester', '2024', 'B'),
('Tuesday', '13:20-14:20', 'Expository Writing', '', 'NUSTART', '4th Semester', '2024', 'B'),

-- WEDNESDAY  
('Wednesday', '08:30-09:20', 'Advanced Database Management Systems', 'Fakhira Younas', 'AC-VD3', '4th Semester', '2024', 'B'),
('Wednesday', '09:25-10:15', 'Advanced Database Management Systems Lab', 'Fakhira Younas', 'AC-VD3', '4th Semester', '2024', 'B'),
('Wednesday', '10:20-11:10', 'Applied Physics Lab', 'Dr. Shazli Babar', 'Physics Lab', '4th Semester', '2024', 'B'),
('Wednesday', '14:20-16:10', 'Expository Writing', '', 'NUSTART', '4th Semester', '2024', 'B'),
('Wednesday', '16:15-18:05', 'Expository Writing', '', 'NUSTART', '4th Semester', '2024', 'B'),

-- THURSDAY
('Thursday', '10:20-11:10', 'Linear Algebra (Pre-Med)', 'Masoom Yawar', '', '4th Semester', '2024', 'B'),

-- FRIDAY
('Friday', '08:30-09:20', 'Computer Organization & Assembly Language', 'Jamshaid Latif', 'CTG', '4th Semester', '2024', 'B'),
('Friday', '09:25-10:15', 'Elective I (Computing)', '', 'Veneto', '4th Semester', '2024', 'B'),
('Friday', '10:20-11:10', 'Theory of Automata', 'Masoom Yawar', 'Vue de Verifier', '4th Semester', '2024', 'B');
