-- ==========================================
-- FINAL CONSOLIDATED TIMETABLE: SEMESTER 2 (CS-2024)
-- Sections: A, B, C
-- ==========================================

-- 1. DELETE OLD DATA
DELETE FROM timetable_entries 
WHERE semester = '2nd Semester' 
  AND (batch = '2024' OR batch = 'CS-2024')
  AND section IN ('A', 'B', 'C');

-- 2. SECTION A (Theory: AC-301)
INSERT INTO timetable_entries (day, time_slot, subject, faculty_name, venue, semester, batch, section) VALUES
('Monday', '08:30-09:20', 'Multivariable Calculus', 'Dr. Ahsan Abbas', 'AC-301', '2nd Semester', '2024', 'A'),
('Monday', '10:20-11:10', 'Linear Algebra', 'Dr. Muhammad Asim', 'AC-301', '2nd Semester', '2024', 'A'),
('Monday', '12:50-13:40', 'Digital Logic Design Lab', 'Lec. Tahreem Khalil', 'DLD Lab', '2nd Semester', '2024', 'A'),
('Tuesday', '08:30-09:20', 'Multivariable Calculus', 'Dr. Ahsan Abbas', 'AC-301', '2nd Semester', '2024', 'A'),
('Tuesday', '09:25-10:15', 'Linear Algebra', 'Dr. Muhammad Asim', 'AC-301', '2nd Semester', '2024', 'A'),
('Tuesday', '10:20-11:10', 'Object Oriented Programming', 'Lec. Tayyaba Kalsoom', 'AC-301', '2nd Semester', '2024', 'A'),
('Tuesday', '12:50-13:40', 'Database Systems Lab', 'Lec. Noushin Saba', 'CL-01', '2nd Semester', '2024', 'A'),
('Wednesday', '08:30-09:20', 'Database Systems', 'Lec. Noushin Saba', 'AC-301', '2nd Semester', '2024', 'A'),
('Wednesday', '09:25-10:15', 'Digital Logic Design', 'Lec. Rizwan Yousaf', 'AC-301', '2nd Semester', '2024', 'A'),
('Wednesday', '12:50-13:40', 'Object Oriented Programming Lab', 'Lec. Tayyaba Kalsoom', 'CL-02', '2nd Semester', '2024', 'A'),
('Thursday', '08:30-09:20', 'Object Oriented Programming', 'Lec. Tayyaba Kalsoom', 'AC-301', '2nd Semester', '2024', 'A'),
('Thursday', '09:25-10:15', 'Database Systems', 'Lec. Noushin Saba', 'AC-301', '2nd Semester', '2024', 'A');

-- 3. SECTION B (Theory: AC-302/AC-204, Rotated Labs)
INSERT INTO timetable_entries (day, time_slot, subject, faculty_name, venue, semester, batch, section) VALUES
('Monday', '08:30-09:20', 'Multivariable Calculus', 'Dr. Ahsan Abbas', 'AC-302', '2nd Semester', '2024', 'B'),
('Monday', '10:20-11:10', 'Linear Algebra', 'Dr. Muhammad Asim', 'AC-302', '2nd Semester', '2024', 'B'),
('Monday', '11:15-12:05', 'Digital Logic Design Lab', 'Lec. Tahreem Khalil', 'Programming Lab 2', '2nd Semester', '2024', 'B'),
('Tuesday', '08:30-09:20', 'Multivariable Calculus', 'Dr. Ahsan Abbas', 'AC-302', '2nd Semester', '2024', 'B'),
('Tuesday', '09:25-10:15', 'Linear Algebra', 'Dr. Muhammad Asim', 'AC-302', '2nd Semester', '2024', 'B'),
('Tuesday', '10:20-11:10', 'Object Oriented Programming', 'Lec. Tayyaba Kalsoom', 'AC-204', '2nd Semester', '2024', 'B'),
('Tuesday', '11:15-12:05', 'Database Systems Lab', 'Lec. Noushin Saba', 'CL-03', '2nd Semester', '2024', 'B'),
('Wednesday', '08:30-09:20', 'Database Systems', 'Lec. Noushin Saba', 'AC-302', '2nd Semester', '2024', 'B'),
('Wednesday', '09:25-10:15', 'Digital Logic Design', 'Lec. Rizwan Yousaf', 'AC-302', '2nd Semester', '2024', 'B'),
('Wednesday', '11:15-12:05', 'Object Oriented Programming Lab', 'Lec. Tayyaba Kalsoom', 'CL-04', '2nd Semester', '2024', 'B'),
('Thursday', '08:30-09:20', 'Object Oriented Programming', 'Lec. Tayyaba Kalsoom', 'AC-204', '2nd Semester', '2024', 'B'),
('Thursday', '09:25-10:15', 'Database Systems', 'Lec. Noushin Saba', 'AC-302', '2nd Semester', '2024', 'B');

-- 4. SECTION C (Theory: AC-205/AC-303, Lab: Programming Lab 3)
INSERT INTO timetable_entries (day, time_slot, subject, faculty_name, venue, semester, batch, section) VALUES
('Monday', '08:30-09:20', 'Multivariable Calculus', 'Dr. Ahsan Abbas', 'AC-205', '2nd Semester', '2024', 'C'),
('Monday', '10:20-11:10', 'Linear Algebra', 'Dr. Muhammad Asim', 'AC-205', '2nd Semester', '2024', 'C'),
('Monday', '12:50-13:40', 'Digital Logic Design Lab', 'Lec. Tahreem Khalil', 'Programming Lab 3', '2nd Semester', '2024', 'C'),
('Tuesday', '10:20-11:10', 'Object Oriented Programming', 'Lec. Tayyaba Kalsoom', 'AC-303', '2nd Semester', '2024', 'C'),
('Tuesday', '12:50-13:40', 'Database Systems Lab', 'Lec. Noushin Saba', 'Programming Lab 3', '2nd Semester', '2024', 'C'),
('Wednesday', '08:30-09:20', 'Database Systems', 'Lec. Noushin Saba', 'AC-303', '2nd Semester', '2024', 'C'),
('Wednesday', '09:25-10:15', 'Digital Logic Design', 'Lec. Rizwan Yousaf', 'AC-303', '2nd Semester', '2024', 'C'),
('Wednesday', '12:50-13:40', 'Object Oriented Programming Lab', 'Lec. Tayyaba Kalsoom', 'Programming Lab 3', '2nd Semester', '2024', 'C');
