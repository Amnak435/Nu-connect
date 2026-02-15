-- ==========================================
-- TIMETABLE UPDATE: SEMESTER 4 (CS-2024)
-- Sections: A, B, C
-- ==========================================

-- 1. DELETE OLD DATA for Semester 4 (Batch 2024) to prevent overlaps
DELETE FROM timetable_entries 
WHERE semester = '4th Semester' 
  AND (batch = '2024' OR batch = 'CS-2024')
  AND section IN ('A', 'B', 'C');

-- 2. INSERT SECTION A SCHEDULE
INSERT INTO timetable_entries (day, time_slot, subject, faculty_name, venue, semester, batch, section) VALUES
('Monday', '08:30-09:20', 'Design & Analysis of Algorithms', 'Dr. Usman Tariq', 'AC-301', '4th Semester', '2024', 'A'),
('Monday', '09:25-10:15', 'Software Engineering', 'Lec. Hira Javed', 'AC-301', '4th Semester', '2024', 'A'),
('Monday', '10:20-11:10', 'Theory of Automata', 'Dr. Imran Siddiqui', 'AC-301', '4th Semester', '2024', 'A'),
('Monday', '12:50-13:40', 'Algorithms Lab', 'Dr. Usman Tariq', 'Programming Lab 1', '4th Semester', '2024', 'A'),
('Tuesday', '08:30-09:20', 'Database Systems', 'Lec. Noushin Saba', 'AC-301', '4th Semester', '2024', 'A'),
('Tuesday', '09:25-10:15', 'Software Engineering', 'Lec. Hira Javed', 'AC-301', '4th Semester', '2024', 'A'),
('Tuesday', '10:20-11:10', 'Theory of Automata', 'Dr. Imran Siddiqui', 'AC-301', '4th Semester', '2024', 'A'),
('Wednesday', '08:30-09:20', 'Design & Analysis of Algorithms', 'Dr. Usman Tariq', 'AC-301', '4th Semester', '2024', 'A'),
('Wednesday', '12:50-13:40', 'Database Systems Lab', 'Lec. Noushin Saba', 'CL-01', '4th Semester', '2024', 'A'),
('Thursday', '08:30-09:20', 'Software Engineering', 'Lec. Hira Javed', 'AC-301', '4th Semester', '2024', 'A'),
('Thursday', '09:25-10:15', 'Theory of Automata', 'Dr. Imran Siddiqui', 'AC-301', '4th Semester', '2024', 'A');

-- 3. INSERT SECTION B SCHEDULE
INSERT INTO timetable_entries (day, time_slot, subject, faculty_name, venue, semester, batch, section) VALUES
('Monday', '08:30-09:20', 'Design & Analysis of Algorithms', 'Dr. Usman Tariq', 'AC-302', '4th Semester', '2024', 'B'),
('Monday', '09:25-10:15', 'Software Engineering', 'Lec. Hira Javed', 'AC-302', '4th Semester', '2024', 'B'),
('Monday', '10:20-11:10', 'Theory of Automata', 'Dr. Imran Siddiqui', 'AC-302', '4th Semester', '2024', 'B'),
('Monday', '12:50-13:40', 'Algorithms Lab', 'Dr. Usman Tariq', 'Programming Lab 2', '4th Semester', '2024', 'B'),
('Tuesday', '08:30-09:20', 'Database Systems', 'Lec. Noushin Saba', 'AC-302', '4th Semester', '2024', 'B'),
('Tuesday', '09:25-10:15', 'Software Engineering', 'Lec. Hira Javed', 'AC-302', '4th Semester', '2024', 'B'),
('Tuesday', '10:20-11:10', 'Theory of Automata', 'Dr. Imran Siddiqui', 'AC-302', '4th Semester', '2024', 'B'),
('Wednesday', '08:30-09:20', 'Design & Analysis of Algorithms', 'Dr. Usman Tariq', 'AC-302', '4th Semester', '2024', 'B'),
('Wednesday', '12:50-13:40', 'Database Systems Lab', 'Lec. Noushin Saba', 'CL-03', '4th Semester', '2024', 'B');

-- 4. INSERT SECTION C SCHEDULE
INSERT INTO timetable_entries (day, time_slot, subject, faculty_name, venue, semester, batch, section) VALUES
('Monday', '08:30-09:20', 'Design & Analysis of Algorithms', 'Dr. Usman Tariq', 'AC-205', '4th Semester', '2024', 'C'),
('Monday', '09:25-10:15', 'Software Engineering', 'Lec. Hira Javed', 'AC-205', '4th Semester', '2024', 'C'),
('Monday', '10:20-11:10', 'Theory of Automata', 'Dr. Imran Siddiqui', 'AC-205', '4th Semester', '2024', 'C'),
('Monday', '12:50-13:40', 'Algorithms Lab', 'Dr. Usman Tariq', 'Programming Lab 3', '4th Semester', '2024', 'C'),
('Tuesday', '08:30-09:20', 'Database Systems', 'Lec. Noushin Saba', 'AC-303', '4th Semester', '2024', 'C'),
('Tuesday', '09:25-10:15', 'Software Engineering', 'Lec. Hira Javed', 'AC-303', '4th Semester', '2024', 'C'),
('Wednesday', '09:25-10:15', 'Theory of Automata', 'Dr. Imran Siddiqui', 'AC-303', '4th Semester', '2024', 'C'),
('Wednesday', '12:50-13:40', 'Database Systems Lab', 'Lec. Noushin Saba', 'Programming Lab 3', '4th Semester', '2024', 'C');
