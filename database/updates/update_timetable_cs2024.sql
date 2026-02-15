-- ==========================================
-- TIMETABLE UPDATE: SEMESTER 1 (CS-2024)
-- Sections: A, B, C
-- ==========================================

-- 1. DELETE OLD DATA to prevent overlaps
DELETE FROM timetable_entries 
WHERE semester = '1st Semester' 
  AND (batch = 'CS-2024' OR batch = '2024')
  AND section IN ('A', 'B', 'C');

-- 2. INSERT SECTION A SCHEDULE
INSERT INTO timetable_entries (day, time_slot, subject, venue, semester, batch, section) VALUES
('Monday', '08:30-09:20', 'Programming Fundamentals', 'AC Lab 1', '1st Semester', 'CS-2024', 'A'),
('Monday', '09:25-10:15', 'Calculus-I', 'AC-301', '1st Semester', 'CS-2024', 'A'),
('Monday', '10:20-11:10', 'English Composition', 'AC-203', '1st Semester', 'CS-2024', 'A'),
('Monday', '11:15-12:05', 'ICT', 'AC-301', '1st Semester', 'CS-2024', 'A'),
('Tuesday', '08:30-10:15', 'Programming Lab', 'Programming Lab 1', '1st Semester', 'CS-2024', 'A'),
('Tuesday', '10:20-11:10', 'Applied Physics', 'Physics Lab', '1st Semester', 'CS-2024', 'A'),
('Tuesday', '11:15-12:05', 'Calculus-I', 'AC-301', '1st Semester', 'CS-2024', 'A'),
('Wednesday', '08:30-09:20', 'ICT', 'AC-301', '1st Semester', 'CS-2024', 'A'),
('Wednesday', '09:25-10:15', 'Programming Fundamentals', 'AC Lab 1', '1st Semester', 'CS-2024', 'A'),
('Wednesday', '10:20-11:10', 'English Composition', 'AC-203', '1st Semester', 'CS-2024', 'A'),
('Wednesday', '11:15-12:05', 'Applied Physics', 'Physics Lab', '1st Semester', 'CS-2024', 'A'),
('Thursday', '08:30-09:20', 'Calculus-I', 'AC-301', '1st Semester', 'CS-2024', 'A'),
('Thursday', '09:25-10:15', 'ICT', 'AC-301', '1st Semester', 'CS-2024', 'A'),
('Thursday', '10:20-12:05', 'Physics Lab', 'Physics Lab', '1st Semester', 'CS-2024', 'A'),
('Friday', '08:30-09:20', 'Programming Fundamentals', 'AC Lab 1', '1st Semester', 'CS-2024', 'A'),
('Friday', '09:25-10:15', 'English Composition', 'AC-203', '1st Semester', 'CS-2024', 'A');

-- 3. INSERT SECTION B SCHEDULE
INSERT INTO timetable_entries (day, time_slot, subject, venue, semester, batch, section) VALUES
('Monday', '08:30-09:20', 'Programming Fundamentals', 'AC Lab 2', '1st Semester', 'CS-2024', 'B'),
('Monday', '09:25-10:15', 'Calculus-I', 'AC-302', '1st Semester', 'CS-2024', 'B'),
('Monday', '10:20-11:10', 'English Composition', 'AC-204', '1st Semester', 'CS-2024', 'B'),
('Monday', '11:15-12:05', 'ICT', 'AC-302', '1st Semester', 'CS-2024', 'B'),
('Tuesday', '08:30-10:15', 'Programming Lab', 'Programming Lab 2', '1st Semester', 'CS-2024', 'B'),
('Tuesday', '10:20-11:10', 'Applied Physics', 'Physics Lab', '1st Semester', 'CS-2024', 'B'),
('Tuesday', '11:15-12:05', 'Calculus-I', 'AC-302', '1st Semester', 'CS-2024', 'B'),
('Wednesday', '08:30-09:20', 'ICT', 'AC-302', '1st Semester', 'CS-2024', 'B'),
('Wednesday', '09:25-10:15', 'Programming Fundamentals', 'AC Lab 2', '1st Semester', 'CS-2024', 'B'),
('Wednesday', '10:20-11:10', 'English Composition', 'AC-204', '1st Semester', 'CS-2024', 'B'),
('Wednesday', '11:15-12:05', 'Applied Physics', 'Physics Lab', '1st Semester', 'CS-2024', 'B'),
('Thursday', '08:30-09:20', 'Calculus-I', 'AC-302', '1st Semester', 'CS-2024', 'B'),
('Thursday', '09:25-10:15', 'ICT', 'AC-302', '1st Semester', 'CS-2024', 'B'),
('Thursday', '10:20-12:05', 'Physics Lab', 'Physics Lab', '1st Semester', 'CS-2024', 'B'),
('Friday', '08:30-09:20', 'Programming Fundamentals', 'AC Lab 2', '1st Semester', 'CS-2024', 'B'),
('Friday', '09:25-10:15', 'English Composition', 'AC-204', '1st Semester', 'CS-2024', 'B');

-- 4. INSERT SECTION C SCHEDULE
INSERT INTO timetable_entries (day, time_slot, subject, venue, semester, batch, section) VALUES
('Monday', '08:30-09:20', 'Programming Fundamentals', 'AC Lab 3', '1st Semester', 'CS-2024', 'C'),
('Monday', '09:25-10:15', 'Calculus-I', 'AC-303', '1st Semester', 'CS-2024', 'C'),
('Monday', '10:20-11:10', 'English Composition', 'AC-205', '1st Semester', 'CS-2024', 'C'),
('Monday', '11:15-12:05', 'ICT', 'AC-303', '1st Semester', 'CS-2024', 'C'),
('Tuesday', '08:30-10:15', 'Programming Lab', 'Programming Lab 3', '1st Semester', 'CS-2024', 'C'),
('Tuesday', '10:20-11:10', 'Applied Physics', 'Physics Lab', '1st Semester', 'CS-2024', 'C'),
('Tuesday', '11:15-12:05', 'Calculus-I', 'AC-303', '1st Semester', 'CS-2024', 'C'),
('Wednesday', '08:30-09:20', 'ICT', 'AC-303', '1st Semester', 'CS-2024', 'C'),
('Wednesday', '09:25-10:15', 'Programming Fundamentals', 'AC Lab 3', '1st Semester', 'CS-2024', 'C'),
('Wednesday', '10:20-11:10', 'English Composition', 'AC-205', '1st Semester', 'CS-2024', 'C'),
('Wednesday', '11:15-12:05', 'Applied Physics', 'Physics Lab', '1st Semester', 'CS-2024', 'C'),
('Thursday', '08:30-09:20', 'Calculus-I', 'AC-303', '1st Semester', 'CS-2024', 'C'),
('Thursday', '09:25-10:15', 'ICT', 'AC-303', '1st Semester', 'CS-2024', 'C'),
('Thursday', '10:20-12:05', 'Physics Lab', 'Physics Lab', '1st Semester', 'CS-2024', 'C'),
('Friday', '08:30-09:20', 'Programming Fundamentals', 'AC Lab 3', '1st Semester', 'CS-2024', 'C'),
('Friday', '09:25-10:15', 'English Composition', 'AC-205', '1st Semester', 'CS-2024', 'C');
