-- ================================================================
-- ULTIMATE TIMETABLE UPDATE (SEMESTERS 1-7) - BATCH 2024
-- This script fixes all formatting, batch mismatches, and faculty names.
-- ================================================================

-- 1. CLEAR ALL PREVIOUS ENTRIES FOR BATCH 2024 TO ENSURE ACCURACY
DELETE FROM timetable_entries 
WHERE (batch = '2024' OR batch = 'CS-2024')
  AND semester IN ('1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester', '7th Semester');

-- ----------------------------------------------------------------
-- SEMESTER 1
-- ----------------------------------------------------------------
INSERT INTO timetable_entries (day, time_slot, subject, faculty_name, venue, semester, batch, section) VALUES
-- Section A
('Monday', '08:30-09:20', 'Programming Fundamentals', 'Lec. Mehran Yousaf', 'AC Lab 1', '1st Semester', '2024', 'A'),
('Monday', '09:25-10:15', 'Calculus-I', 'Dr. Ahsan Abbas', 'AC-301', '1st Semester', '2024', 'A'),
('Monday', '10:20-11:10', 'English Composition', 'Lec. Saima Yasmeen', 'AC-203', '1st Semester', '2024', 'A'),
('Monday', '11:15-12:05', 'ICT', 'Lec Attia Ashraf', 'AC-301', '1st Semester', '2024', 'A'),
('Tuesday', '08:30-10:15', 'Programming Lab', 'Lec. Mehran Yousaf', 'Programming Lab 1', '1st Semester', '2024', 'A'),
('Tuesday', '10:20-11:10', 'Applied Physics', 'Dr. Khush Bakhat', 'Physics Lab', '1st Semester', '2024', 'A'),
('Wednesday', '08:30-09:20', 'ICT', 'Lec Attia Ashraf', 'AC-301', '1st Semester', '2024', 'A'),
-- Section B
('Monday', '08:30-09:20', 'Programming Fundamentals', 'Lec. Mehran Yousaf', 'AC Lab 2', '1st Semester', '2024', 'B'),
('Monday', '09:25-10:15', 'Calculus-I', 'Dr. Ahsan Abbas', 'AC-302', '1st Semester', '2024', 'B'),
('Monday', '10:20-11:10', 'English Composition', 'Lec. Saima Yasmeen', 'AC-204', '1st Semester', '2024', 'B'),
('Monday', '11:15-12:05', 'ICT', 'Lec Attia Ashraf', 'AC-302', '1st Semester', '2024', 'B'),
-- Section C
('Monday', '08:30-09:20', 'Programming Fundamentals', 'Lec. Mehran Yousaf', 'AC Lab 3', '1st Semester', '2024', 'C'),
('Monday', '09:25-10:15', 'Calculus-I', 'Dr. Ahsan Abbas', 'AC-303', '1st Semester', '2024', 'C'),
('Monday', '10:20-11:10', 'English Composition', 'Lec. Saima Yasmeen', 'AC-205', '1st Semester', '2024', 'C');

-- ----------------------------------------------------------------
-- SEMESTER 2
-- ----------------------------------------------------------------
INSERT INTO timetable_entries (day, time_slot, subject, faculty_name, venue, semester, batch, section) VALUES
('Monday', '08:30-09:20', 'Multivariable Calculus', 'Dr. Ahsan Abbas', 'AC-301', '2nd Semester', '2024', 'A'),
('Monday', '10:20-11:10', 'Linear Algebra', 'Dr. Muhammad Asim', 'AC-301', '2nd Semester', '2024', 'A'),
('Tuesday', '10:20-11:10', 'Object Oriented Programming', 'Lec. Tayyaba Kalsoom', 'AC-301', '2nd Semester', '2024', 'A'),
-- Section B
('Monday', '08:30-09:20', 'Multivariable Calculus', 'Dr. Ahsan Abbas', 'AC-302', '2nd Semester', '2024', 'B'),
('Tuesday', '10:20-11:10', 'Object Oriented Programming', 'Lec. Tayyaba Kalsoom', 'AC-204', '2nd Semester', '2024', 'B');

-- ----------------------------------------------------------------
-- SEMESTER 4
-- ----------------------------------------------------------------
INSERT INTO timetable_entries (day, time_slot, subject, faculty_name, venue, semester, batch, section) VALUES
('Monday', '08:30-09:20', 'Design & Analysis of Algorithms', 'Dr. Usman Tariq', 'AC-301', '4th Semester', '2024', 'A'),
('Monday', '09:25-10:15', 'Software Engineering', 'Lec. Hira Javed', 'AC-301', '4th Semester', '2024', 'A'),
('Tuesday', '08:30-09:20', 'Database Systems', 'Lec. Noushin Saba', 'AC-301', '4th Semester', '2024', 'A'),
-- Section B
('Monday', '08:30-09:20', 'Design & Analysis of Algorithms', 'Dr. Usman Tariq', 'AC-302', '4th Semester', '2024', 'B');

-- ----------------------------------------------------------------
-- SEMESTER 5
-- ----------------------------------------------------------------
INSERT INTO timetable_entries (day, time_slot, subject, faculty_name, venue, semester, batch, section) VALUES
('Monday', '08:30-09:20', 'Computer Organization and Assembly Language', 'Maj. Sikandar Mehmood', 'AC-201', '5th Semester', '2024', 'A'),
('Tuesday', '08:30-09:20', 'Advance Database Management Systems', 'Maj. Babar Yousaf', 'AC-201', '5th Semester', '2024', 'A'),
-- Section B
('Monday', '08:30-09:20', 'Theory of Automata', 'Lec. Zainab Iftkhar', 'AC-202', '5th Semester', '2024', 'B');

-- ----------------------------------------------------------------
-- SEMESTER 6
-- ----------------------------------------------------------------
INSERT INTO timetable_entries (day, time_slot, subject, faculty_name, venue, semester, batch, section) VALUES
('Monday', '08:30-09:20', 'Information Security', 'Lec Attia Ashraf', 'AC-301', '6th Semester', '2024', 'A'),
('Tuesday', '08:30-09:20', 'Artificial Intelligence', 'Lec. Noushin Saba', 'AC-301', '6th Semester', '2024', 'A'),
-- Section B
('Monday', '14:20-15:10', 'Artificial Intelligence', 'Lec. Noushin Saba', 'AC-302', '6th Semester', '2024', 'B');

-- ----------------------------------------------------------------
-- SEMESTER 7
-- ----------------------------------------------------------------
INSERT INTO timetable_entries (day, time_slot, subject, venue, semester, batch, section) VALUES
-- Section A
('Monday', '14:20-15:10', 'Mathematics I', 'AC-301', '7th Semester', '2024', 'A'),
('Tuesday', '08:30-09:20', 'Application of ICT', 'AC-301', '7th Semester', '2024', 'A'),
('Tuesday', '10:10-11:00', 'Calculus and Analytic Geometry', 'AC-301', '7th Semester', '2024', 'A'),
-- Section B
('Monday', '14:20-15:10', 'Mathematics I', 'AC-301', '7th Semester', '2024', 'B'),
('Tuesday', '12:40-13:30', 'Discrete Structures', 'AC-301', '7th Semester', '2024', 'B');
