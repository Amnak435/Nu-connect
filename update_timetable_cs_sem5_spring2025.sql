-- ==========================================
-- TIMETABLE UPDATE: SEMESTER 5 (CS)
-- Session: Spring-2025
-- Sections: A, B
-- ==========================================

-- 1. DELETE OLD DATA for Semester 5 to prevent overlaps
DELETE FROM timetable_entries 
WHERE semester = '5th Semester' 
  AND (batch = '2022' OR batch = 'CS-2022')
  AND section IN ('A', 'B');

-- 2. INSERT SECTION A SCHEDULE
-- Theory: AC-201 (unless specified), Labs: CL-04 / Physics Lab
INSERT INTO timetable_entries (day, time_slot, subject, faculty_name, venue, semester, batch, section) VALUES
-- Monday
('Monday', '08:30-09:20', 'Computer Organization and Assembly Language', 'Maj. Sikandar Mehmood', 'AC-201', '5th Semester', '2022', 'A'),
('Monday', '10:20-11:10', 'Expository Writing', 'Lec. Muqadass Inayat', 'AC-201', '5th Semester', '2022', 'A'),
('Monday', '13:45-14:35', 'Linear Algebra (Pre-Med)', 'Lec Muhammad Zeshan', 'AC-203', '5th Semester', '2022', 'A'),
-- Tuesday
('Tuesday', '08:30-09:20', 'Advance Database Management Systems', 'Maj. Babar Yousaf', 'AC-201', '5th Semester', '2022', 'A'),
('Tuesday', '10:20-11:10', 'Islamic Studies', 'Dr Arslan Butt (TVF)', 'AC-203', '5th Semester', '2022', 'A'),
('Tuesday', '13:45-14:35', 'Computer Organization and Assembly Language Lab', 'Maj. Sikandar Mehmood', 'CL-04', '5th Semester', '2022', 'A'),
-- Wednesday
('Wednesday', '08:30-09:20', 'Applied Physics', 'Dr Khush Bakhat Shamraiz', 'AC-201', '5th Semester', '2022', 'A'),
('Wednesday', '10:20-11:10', 'Theory of Automata', 'Lec. Zainab Iftkhar', 'AC-201', '5th Semester', '2022', 'A'),
('Wednesday', '13:45-14:35', 'Advance Database Management Systems Lab', 'Maj. Babar Yousaf', 'CL-04', '5th Semester', '2022', 'A'),
-- Thursday
('Thursday', '08:30-09:20', 'Theory of Automata', 'Lec. Zainab Iftkhar', 'AC-201', '5th Semester', '2022', 'A'),
('Thursday', '10:20-11:10', 'Expository Writing', 'Lec. Muqadass Inayat', 'AC-201', '5th Semester', '2022', 'A'),
('Thursday', '13:45-14:35', 'Applied Physics Lab', 'Dr Khush Bakhat Shamraiz', 'Physics Lab', '5th Semester', '2022', 'A');

-- 3. INSERT SECTION B SCHEDULE
-- Theory: AC-202 (unless specified), Labs: CL-05 / Physics Lab
INSERT INTO timetable_entries (day, time_slot, subject, faculty_name, venue, semester, batch, section) VALUES
-- Monday
('Monday', '08:30-09:20', 'Theory of Automata', 'Lec. Zainab Iftkhar', 'AC-202', '5th Semester', '2022', 'B'),
('Monday', '13:45-14:35', 'Linear Algebra (Pre-Med)', 'Lec Muhammad Zeshan', 'AC-203', '5th Semester', '2022', 'B'),
-- Tuesday
('Tuesday', '08:30-09:20', 'Computer Organization and Assembly Language', 'Maj. Sikandar Mehmood', 'AC-202', '5th Semester', '2022', 'B'),
('Tuesday', '10:20-11:10', 'Islamic Studies', 'Dr Arslan Butt (TVF)', 'AC-203', '5th Semester', '2022', 'B'),
('Tuesday', '13:45-14:35', 'Applied Physics Lab', 'Dr. Khush Bakhat Shamraiz', 'Physics-Lab', '5th Semester', '2022', 'B'),
-- Wednesday
('Wednesday', '08:30-09:20', 'Advance Database Management Systems', 'Maj. Babar Yousaf', 'AC-202', '5th Semester', '2022', 'B'),
('Wednesday', '10:20-11:10', 'Expository Writing', 'Lec Zaigham Aizad', 'AC-202', '5th Semester', '2022', 'B'),
('Wednesday', '11:15-12:05', 'Theory of Automata', 'Lec. Zainab Iftkhar', 'AC-202', '5th Semester', '2022', 'B'),
('Wednesday', '13:45-14:35', 'Computer Organization and Assembly Language Lab', 'Maj. Sikandar Mehmood', 'CL-05', '5th Semester', '2022', 'B'),
-- Thursday
('Thursday', '08:30-09:20', 'Expository Writing', 'Lec Zaigham Aizad', 'AC-202', '5th Semester', '2022', 'B'),
('Thursday', '10:20-11:10', 'Applied Physics', 'Dr. Khush Bakhat Shamraiz', 'AC-202', '5th Semester', '2022', 'B'),
('Thursday', '13:45-14:35', 'Advance Database Management Systems Lab', 'Maj. Babar Yousaf', 'CL-04', '5th Semester', '2022', 'B');
