-- ==========================================
-- TIMETABLE UPDATE: ALL CS-24 SECTIONS (A, B, C)
-- SEMESTER 4 - SPRING 2026
-- ==========================================

-- DELETE OLD DATA for all sections
DELETE FROM timetable_entries 
WHERE semester = '4th Semester' 
  AND batch = '2024'
  AND section IN ('A', 'B', 'C');

-- ==========================================
-- SECTION A
-- ==========================================
INSERT INTO timetable_entries (day, time_slot, subject, faculty_name, venue, semester, batch, section) VALUES
('Monday', '08:30-09:20', 'Computer Organization & Assembly Language', 'Shama Zahir', 'AC-7W3', '4th Semester', '2024', 'A'),
('Monday', '09:20-10:10', 'Computer Organization & Assembly Language', 'Shama Zahir', 'AC-7W3', '4th Semester', '2024', 'A'),
('Monday', '10:10-11:00', 'Expo Writing', '', '', '4th Semester', '2024', 'A'),
('Monday', '11:50-12:40', 'Theory of Automata', '', '', '4th Semester', '2024', 'A'),
('Monday', '12:40-13:30', 'Theory of Automata', '', '', '4th Semester', '2024', 'A'),
('Tuesday', '08:30-09:20', 'Expo Writing', '', '', '4th Semester', '2024', 'A'),
('Tuesday', '09:20-10:10', 'Expo Writing', '', '', '4th Semester', '2024', 'A'),
('Tuesday', '10:10-11:00', 'Theory of Automata', 'Naveed Yarad', 'AC-7W3', '4th Semester', '2024', 'A'),
('Tuesday', '11:00-11:50', 'Applied Physics', 'Dr. Usman Babar', 'AC-7W3', '4th Semester', '2024', 'A'),
('Tuesday', '11:50-12:40', 'Advanced Database Management Systems Lab', '', '', '4th Semester', '2024', 'A'),
('Tuesday', '12:40-13:30', 'Computer Organization & Assembly Language Lab', '', '', '4th Semester', '2024', 'A'),
('Wednesday', '10:10-11:00', 'Theory of Automata', '', '', '4th Semester', '2024', 'A'),
('Wednesday', '11:00-11:50', 'Theory of Automata', '', '', '4th Semester', '2024', 'A'),
('Wednesday', '11:50-12:40', 'Applied Physics', '', '', '4th Semester', '2024', 'A'),
('Thursday', '14:20-16:10', 'Islamic Studies', 'Dr. Noushale Mir', 'AC-7W3', '4th Semester', '2024', 'A'),
('Friday', '14:20-16:10', 'Islamic Studies', 'Dr. Noushale Mir', 'AC-7W3', '4th Semester', '2024', 'A'),

-- ==========================================
-- SECTION B
-- ==========================================
('Monday', '08:30-09:20', 'Computer Organization & Assembly Language', 'Jamshaid Latif', 'CTG', '4th Semester', '2024', 'B'),
('Monday', '09:25-10:15', 'Computer Organization & Assembly Language', 'Jamshaid Latif', '', '4th Semester', '2024', 'B'),
('Monday', '10:20-11:10', 'Computer Organization & Assembly Language Lab', 'Jamshaid Latif', 'Humaa Ahmed', '4th Semester', '2024', 'B'),
('Monday', '10:20-11:10', 'Advanced Database Management Systems', 'Fakhira Younas', 'Vue de Verifier', '4th Semester', '2024', 'B'),
('Monday', '12:50-13:40', 'Theory of Automata', 'Masoom Yawar', 'AC-VD3', '4th Semester', '2024', 'B'),
('Monday', '13:20-14:20', 'Expository Writing', '', 'AC-VD3', '4th Semester', '2024', 'B'),
('Tuesday', '08:30-09:20', 'Applied Physics Lab', '', 'N-221', '4th Semester', '2024', 'B'),
('Tuesday', '10:20-11:10', 'Computer Organization & Assembly Language Lab', '', 'Humaa Ahmed', '4th Semester', '2024', 'B'),
('Tuesday', '12:50-13:40', 'Expository Writing', '', 'NUSTART', '4th Semester', '2024', 'B'),
('Tuesday', '13:20-14:20', 'Expository Writing', '', 'NUSTART', '4th Semester', '2024', 'B'),
('Wednesday', '08:30-09:20', 'Advanced Database Management Systems', 'Fakhira Younas', 'AC-VD3', '4th Semester', '2024', 'B'),
('Wednesday', '09:25-10:15', 'Advanced Database Management Systems Lab', 'Fakhira Younas', 'AC-VD3', '4th Semester', '2024', 'B'),
('Wednesday', '10:20-11:10', 'Applied Physics Lab', 'Dr. Shazli Babar', 'Physics Lab', '4th Semester', '2024', 'B'),
('Wednesday', '14:20-16:10', 'Expository Writing', '', 'NUSTART', '4th Semester', '2024', 'B'),
('Wednesday', '16:15-18:05', 'Expository Writing', '', 'NUSTART', '4th Semester', '2024', 'B'),
('Thursday', '10:20-11:10', 'Linear Algebra (Pre-Med)', 'Masoom Yawar', '', '4th Semester', '2024', 'B'),
('Friday', '08:30-09:20', 'Computer Organization & Assembly Language', 'Jamshaid Latif', 'CTG', '4th Semester', '2024', 'B'),
('Friday', '09:25-10:15', 'Elective I (Computing)', '', 'Veneto', '4th Semester', '2024', 'B'),
('Friday', '10:20-11:10', 'Theory of Automata', 'Masoom Yawar', 'Vue de Verifier', '4th Semester', '2024', 'B'),

-- ==========================================
-- SECTION C
-- ==========================================
('Monday', '08:30-09:20', 'Expository Writing', 'Uzma Shakir', '', '4th Semester', '2024', 'C'),
('Monday', '09:20-10:10', 'Expository Writing', 'Uzma Shakir', '', '4th Semester', '2024', 'C'),
('Monday', '10:10-11:00', 'Theory of Automata', 'Dr. Kanfiani', 'AC-301A', '4th Semester', '2024', 'C'),
('Monday', '11:05-12:40', 'Applied Physics Lab', 'Dr. Usman Babar', '', '4th Semester', '2024', 'C'),
('Monday', '12:40-13:30', 'Database Management Systems Lab', 'Kiran Ali', 'VD-LAN/Lec1(1-11)', '4th Semester', '2024', 'C'),
('Tuesday', '08:30-09:20', 'Humorous/Dance', '', '', '4th Semester', '2024', 'C'),
('Tuesday', '09:20-10:10', '', '', '', '4th Semester', '2024', 'C'),
('Tuesday', '13:30-14:20', 'Applied Physics Lab', '', '', '4th Semester', '2024', 'C'),
('Tuesday', '14:20-15:10', 'Islamic Studies', 'Dr. Mushable Mir', 'AC-301A', '4th Semester', '2024', 'C'),
('Tuesday', '15:10-16:00', 'Islamic Studies', 'Dr. Mushable Mir', 'AC-301A', '4th Semester', '2024', 'C'),
('Wednesday', '08:30-09:20', '', '', '', '4th Semester', '2024', 'C'),
('Wednesday', '09:20-10:10', 'Humorous/Dance', '', '', '4th Semester', '2024', 'C'),
('Wednesday', '10:10-11:00', 'Theory of Automata', '', 'AC-301A', '4th Semester', '2024', 'C'),
('Wednesday', '14:20-15:10', 'Database Management Systems Lab', '', '', '4th Semester', '2024', 'C'),
('Thursday', '08:30-09:20', '', '', '', '4th Semester', '2024', 'C'),
('Thursday', '10:10-11:00', 'Applied Physics', 'Dr. Usman Babar', '', '4th Semester', '2024', 'C'),
('Friday', '14:20-15:10', 'Islamic Studies', 'Dr. Mushable Mir', '', '4th Semester', '2024', 'C'),
('Friday', '15:10-16:00', 'Islamic Studies', 'Dr. Mushable Mir', '', '4th Semester', '2024', 'C');
