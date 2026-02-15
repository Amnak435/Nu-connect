-- ==========================================
-- TIMETABLE UPDATE: SEMESTER 6 (CS)
-- Session: Fall-2025
-- Sections: A, B, C
-- ==========================================

-- 1. DELETE OLD DATA for Semester 6 to prevent overlaps
DELETE FROM timetable_entries 
WHERE semester = '6th Semester' 
  AND (batch = '2022' OR batch = 'CS-2022')
  AND section IN ('A', 'B', 'C');

-- 2. INSERT SECTION A SCHEDULE
-- ----------------------------------------------------------------
INSERT INTO timetable_entries (day, time_slot, subject, faculty_name, venue, semester, batch, section) VALUES
-- Monday
('Monday', '08:30-09:20', 'Information Security', 'Lec Attia Ashraf', 'AC-301', '6th Semester', '2022', 'A'),
('Monday', '10:10-11:00', 'Software Engineering', 'Lec. Saima Yasmeen', 'AC-301', '6th Semester', '2022', 'A'),
('Monday', '13:30-14:20', 'Information Security Lab', 'Lec. Bilal Rehman', 'Security Lab', '6th Semester', '2022', 'A'),
-- Tuesday
('Tuesday', '08:30-09:20', 'Artificial Intelligence', 'Lec. Noushin Saba', 'AC-301', '6th Semester', '2022', 'A'),
('Tuesday', '10:10-11:00', 'Probability & Statistics', 'Dr Faryal Younus', 'AC-301', '6th Semester', '2022', 'A'),
('Tuesday', '13:30-14:20', 'Data Structures Lab', 'Lec. Mehran Yousaf', 'Programming Lab 1', '6th Semester', '2022', 'A'),
-- Wednesday
('Wednesday', '08:30-09:20', 'Probability & Statistics', 'Dr Faryal Younus', 'AC-301', '6th Semester', '2022', 'A'),
('Wednesday', '10:10-11:00', 'Computer Networks', 'Lec. Naveed Yousaf', 'AC-301', '6th Semester', '2022', 'A'),
('Wednesday', '11:50-12:40', 'Data Structures', 'Lec. Mehran Yousaf', 'AC-301', '6th Semester', '2022', 'A'),
('Wednesday', '12:40-13:30', 'Multivariable Calculus (Pre-Med)', 'Dr Ahsan Abbas', 'AC-301', '6th Semester', '2022', 'A'),
('Wednesday', '13:30-14:20', 'Artificial Intelligence Lab', 'Lec. Noushin Saba / L.E Ijlal', 'AI Lab', '6th Semester', '2022', 'A'),
-- Thursday
('Thursday', '08:30-09:20', 'Data Structures', 'Lec. Mehran Yousaf', 'AC-301', '6th Semester', '2022', 'A'),
('Thursday', '10:10-11:00', 'Software Engineering', 'Lec. Saima Yasmeen', 'AC-301', '6th Semester', '2022', 'A'),
('Thursday', '11:50-12:40', 'Multivariable Calculus (Pre-Med)', 'Dr Ahsan Abbas', 'AC-301', '6th Semester', '2022', 'A'),
('Thursday', '13:30-14:20', 'Computer Networks Lab', 'Lec. Naveed Yousaf', 'Networking Lab', '6th Semester', '2022', 'A');

-- 3. INSERT SECTION B SCHEDULE
-- ----------------------------------------------------------------
INSERT INTO timetable_entries (day, time_slot, subject, faculty_name, venue, semester, batch, section) VALUES
-- Monday
('Monday', '08:30-09:20', 'Artificial Intelligence Lab', 'Lec. Noushin Saba / L.E Ijlal', 'AI Lab', '6th Semester', '2022', 'B'),
('Monday', '11:00-11:50', 'Data Structures', 'Lec. Mehran Yousaf', 'AC-302', '6th Semester', '2022', 'B'),
('Monday', '12:40-13:30', 'Probability & Statistics', 'Dr Faryal Younus', 'AC-302', '6th Semester', '2022', 'B'),
('Monday', '14:20-15:10', 'Artificial Intelligence', 'Lec. Noushin Saba', 'AC-302', '6th Semester', '2022', 'B'),
-- Tuesday
('Tuesday', '08:30-09:20', 'Computer Networks Lab', 'Lec. Naveed Yousaf', 'Networking Lab', '6th Semester', '2022', 'B'),
('Tuesday', '11:00-11:50', 'Information Security', 'Lec Attia Ashraf', 'AC-302', '6th Semester', '2022', 'B'),
('Tuesday', '12:40-13:30', 'Software Engineering', 'Lec. Saima Yasmeen', 'AC-302', '6th Semester', '2022', 'B'),
('Tuesday', '14:20-15:10', 'Probability & Statistics', 'Dr Faryal Younus', 'AC-302', '6th Semester', '2022', 'B'),
-- Wednesday
('Wednesday', '08:30-09:20', 'Data Structures Lab', 'Lec. Mehran Yousaf', 'Programming Lab 2', '6th Semester', '2022', 'B'),
('Wednesday', '12:40-13:30', 'Multivariable Calculus (Pre-Med)', 'Dr Ahsan Abbas', 'AC-302', '6th Semester', '2022', 'B'),
('Wednesday', '13:30-14:20', 'Data Structures', 'Lec. Mehran Yousaf', 'AC-302', '6th Semester', '2022', 'B'),
('Wednesday', '14:20-15:10', 'Computer Networks', 'Lec. Naveed Yousaf', 'AC-302', '6th Semester', '2022', 'B'),
-- Thursday
('Thursday', '08:30-09:20', 'Information Security Lab', 'Lec. Bilal Rehman', 'Security Lab', '6th Semester', '2022', 'B'),
('Thursday', '11:50-12:40', 'Multivariable Calculus (Pre-Med)', 'Dr Ahsan Abbas', 'AC-302', '6th Semester', '2022', 'B'),
('Thursday', '14:20-15:10', 'Software Engineering', 'Lec. Saima Yasmeen', 'AC-302', '6th Semester', '2022', 'B');

-- 4. INSERT SECTION C SCHEDULE
-- ----------------------------------------------------------------
INSERT INTO timetable_entries (day, time_slot, subject, faculty_name, venue, semester, batch, section) VALUES
-- Monday
('Monday', '08:30-09:20', 'Probability & Statistics', 'Dr Faryal Younus', 'AC-303', '6th Semester', '2022', 'C'),
('Monday', '10:10-11:00', 'Data Structures', 'Lec. Mehran Yousaf', 'AC-303', '6th Semester', '2022', 'C'),
('Monday', '12:40-13:30', 'Multivariable Calculus (Pre-Med)', 'Dr Ahsan Abbas', 'AC-303', '6th Semester', '2022', 'C'),
('Monday', '13:30-14:20', 'Information Security Lab', 'Lec. Bilal Rehman', 'Security Lab', '6th Semester', '2022', 'C'),
-- Tuesday
('Tuesday', '08:30-09:20', 'Artificial Intelligence', 'Lec. Noushin Saba', 'AC-303', '6th Semester', '2022', 'C'),
('Tuesday', '10:10-11:00', 'Software Engineering', 'Lec. Saima Yasmeen', 'AC-303', '6th Semester', '2022', 'C'),
('Tuesday', '11:50-12:40', 'Multivariable Calculus (Pre-Med)', 'Dr Ahsan Abbas', 'AC-303', '6th Semester', '2022', 'C'),
('Tuesday', '13:30-14:20', 'Data Structures Lab', 'Lec. Mehran Yousaf', 'Programming Lab 3', '6th Semester', '2022', 'C'),
-- Wednesday
('Wednesday', '08:30-09:20', 'Software Engineering', 'Lec. Saima Yasmeen', 'AC-303', '6th Semester', '2022', 'C'),
('Wednesday', '10:10-11:00', 'Data Structures', 'Lec. Mehran Yousaf', 'AC-303', '6th Semester', '2022', 'C'),
('Wednesday', '13:30-14:20', 'Artificial Intelligence Lab', 'Lec. Noushin Saba / L.E Ijlal', 'AI Lab', '6th Semester', '2022', 'C'),
-- Thursday
('Thursday', '08:30-09:20', 'Information Security', 'Lec Attia Ashraf', 'AC-303', '6th Semester', '2022', 'C'),
('Thursday', '10:10-11:00', 'Probability & Statistics', 'Dr Faryal Younus', 'AC-303', '6th Semester', '2022', 'C'),
('Thursday', '11:00-11:50', 'Computer Networks', 'Lec. Naveed Yousaf', 'AC-303', '6th Semester', '2022', 'C'),
('Thursday', '13:30-14:20', 'Computer Networks Lab', 'Lec. Naveed Yousaf', 'Networking Lab', '6th Semester', '2022', 'C');
