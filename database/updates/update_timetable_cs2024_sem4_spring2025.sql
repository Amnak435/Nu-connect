-- ==========================================
-- TIMETABLE UPDATE: SEMESTER 4 (CS-2024 Section B)
-- SPRING 2025 - LATEST
-- ==========================================

-- 1. DELETE OLD DATA for Semester 4 Section B (Batch 2024)
DELETE FROM timetable_entries 
WHERE semester = '4th Semester' 
  AND batch = '2024'
  AND section = 'B';

-- 2. INSERT SECTION B SCHEDULE (SPRING 2025 - LATEST)
INSERT INTO timetable_entries (day, time_slot, subject, faculty_name, venue, semester, batch, section) VALUES
-- MONDAY
('Monday', '08:30-09:20', 'Computer Organization & Assembly Language', 'Jamshaid Latif', 'CTG', '4th Semester', '2024', 'B'),
('Monday', '09:25-10:15', 'Computer Organization & Assembly Language', 'Jamshaid Latif', 'CTG', '4th Semester', '2024', 'B'),
('Monday', '10:20-11:10', 'Computer Organization & Assembly Language Lab', 'Jamshaid Latif', 'Vue de Verifier', '4th Semester', '2024', 'B'),
('Monday', '10:20-11:10', 'Advanced Database Management Systems', 'Fakhira Younas', 'Vue de Verifier', '4th Semester', '2024', 'B'),
('Monday', '12:50-13:40', 'Applied Physics Lab', '', 'Physics Lab', '4th Semester', '2024', 'B'),
('Monday', '13:20-14:20', 'Expository Writing', '', 'NUSTART', '4th Semester', '2024', 'B'),

-- TUESDAY
('Tuesday', '08:30-09:20', 'Applied Physics Lab', '', 'N-221', '4th Semester', '2024', 'B'),
('Tuesday', '09:25-10:15', 'Computer Organization & Assembly Language Lab', '', 'Veneto', '4th Semester', '2024', 'B'),
('Tuesday', '10:20-11:10', 'Expository Writing', '', 'Humaa', '4th Semester', '2024', 'B'),
('Tuesday', '12:50-13:40', 'Theory of Automata', 'Humaa', 'Masoom Yawar', '4th Semester', '2024', 'B'),
('Tuesday', '13:20-14:20', 'Theory of Automata', 'Masoom Yawar', 'NUSTART', '4th Semester', '2024', 'B'),

-- WEDNESDAY
('Wednesday', '08:30-09:20', 'Advanced Database Management Systems', 'Fakhira Younas', '', '4th Semester', '2024', 'B'),
('Wednesday', '09:25-10:15', 'Advanced Database Management Systems Lab', 'Fakhira Younas', '', '4th Semester', '2024', 'B'),
('Wednesday', '10:20-11:10', 'Applied Physics Lab', 'Dr. Shazli Babar', 'Physics Lab', '4th Semester', '2024', 'B'),
('Wednesday', '12:50-13:40', 'Expository Writing', '', 'NUSTART', '4th Semester', '2024', 'B'),
('Wednesday', '14:20-16:10', 'Expository Writing', '', 'NUSTART', '4th Semester', '2024', 'B'),

-- THURSDAY
('Thursday', '10:20-11:10', 'Linear Algebra (Pre-Med)', 'Masoom Yawar', '', '4th Semester', '2024', 'B'),
('Thursday', '16:15-18:05', '', '', 'NUSTART', '4th Semester', '2024', 'B'),

-- FRIDAY
('Friday', '08:30-09:20', 'Computer Organization & Assembly Language', 'Jamshaid Latif', 'CTG', '4th Semester', '2024', 'B'),
('Friday', '09:25-10:15', 'Elective I (Computing)', '', 'Veneto', '4th Semester', '2024', 'B'),
('Friday', '10:20-11:10', 'Theory of Automata', 'Masoom Yawar', 'Vue de Verifier', '4th Semester', '2024', 'B'),
('Friday', '12:50-13:40', '', '', '', '4th Semester', '2024', 'B'),
('Friday', '13:20-14:20', '', 'Humaa', '', '4th Semester', '2024', 'B');
