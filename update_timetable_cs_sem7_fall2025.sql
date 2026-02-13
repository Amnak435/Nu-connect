-- ==========================================
-- TIMETABLE UPDATE: SEMESTER 7 (CS)
-- Session: Fall-2025
-- Sections: A, B, C
-- NOTE: Subjects listed (PF, Calculus, ICT) are typically 1st Semester.
-- Updated as 7th Semester per request.
-- ==========================================

-- 1. DELETE OLD DATA for Semester 7 to prevent overlaps
DELETE FROM timetable_entries 
WHERE semester = '7th Semester' 
  AND (batch = '2022' OR batch = 'CS-2022' OR batch = '2021')
  AND section IN ('A', 'B', 'C');

-- 2. INSERT SECTION A SCHEDULE
-- Primary Venue: AC-301 (Theory), CL-01 (Labs)
INSERT INTO timetable_entries (day, time_slot, subject, venue, semester, batch, section) VALUES
('Monday', '11:00-11:50', 'Application of Information & Communication Technologies Lab', 'CL-01', '7th Semester', '2022', 'A'),
('Monday', '14:20-15:10', 'Mathematics I', 'AC-301', '7th Semester', '2022', 'A'),
('Tuesday', '08:30-09:20', 'Application of Information & Communication Technologies', 'AC-301', '7th Semester', '2022', 'A'),
('Tuesday', '10:10-11:00', 'Calculus and Analytic Geometry', 'AC-301', '7th Semester', '2022', 'A'),
('Tuesday', '11:00-11:50', 'Programming Fundamentals Lab', 'CL-01', '7th Semester', '2022', 'A'),
('Tuesday', '14:20-15:10', 'Functional English', 'AC-301', '7th Semester', '2022', 'A'),
('Wednesday', '10:10-11:00', 'Mathematics I', 'AC-301', '7th Semester', '2022', 'A'),
('Wednesday', '11:00-11:50', 'Calculus and Analytic Geometry', 'AC-301', '7th Semester', '2022', 'A'),
('Wednesday', '12:40-13:30', 'Discrete Structures', 'AC-301', '7th Semester', '2022', 'A'),
('Wednesday', '14:20-15:10', 'Mathematics II', 'AC-301', '7th Semester', '2022', 'A'),
('Thursday', '08:30-09:20', 'Programming Fundamentals', 'AC-301', '7th Semester', '2022', 'A'),
('Thursday', '11:00-11:50', 'Discrete Structures', 'AC-301', '7th Semester', '2022', 'A'),
('Thursday', '12:40-13:30', 'Functional English', 'AC-301', '7th Semester', '2022', 'A'),
('Thursday', '13:30-14:20', 'Mathematics II', 'AC-301', '7th Semester', '2022', 'A'),
('Friday', '08:30-09:20', 'Programming Fundamentals', 'AC-301', '7th Semester', '2022', 'A'),
('Friday', '10:10-11:00', 'ELP', 'AC-301', '7th Semester', '2022', 'A');

-- 3. INSERT SECTION B SCHEDULE
-- Primary Venue: AC-301 (Theory), CL-01 (Labs)
INSERT INTO timetable_entries (day, time_slot, subject, venue, semester, batch, section) VALUES
('Monday', '10:10-11:00', 'Functional English', 'AC-301', '7th Semester', '2022', 'B'),
('Monday', '11:00-11:50', 'Calculus and Analytic Geometry', 'AC-301', '7th Semester', '2022', 'B'),
('Monday', '12:40-13:30', 'Programming Fundamentals', 'AC-301', '7th Semester', '2022', 'B'),
('Monday', '14:20-15:10', 'Mathematics I', 'AC-301', '7th Semester', '2022', 'B'),
('Tuesday', '11:00-11:50', 'Functional English', 'AC-301', '7th Semester', '2022', 'B'),
('Tuesday', '12:40-13:30', 'Discrete Structures', 'AC-301', '7th Semester', '2022', 'B'),
('Wednesday', '10:10-11:00', 'Mathematics I', 'AC-301', '7th Semester', '2022', 'B'),
('Wednesday', '11:00-11:50', 'Application of Information & Communication Technologies Lab', 'CL-01', '7th Semester', '2022', 'B'),
('Wednesday', '13:30-14:20', 'Calculus and Analytic Geometry', 'AC-301', '7th Semester', '2022', 'B'),
('Wednesday', '14:20-15:10', 'Mathematics II', 'AC-301', '7th Semester', '2022', 'B'),
('Thursday', '09:20-10:10', 'Application of Information & Communication Technologies', 'AC-301', '7th Semester', '2022', 'B'),
('Thursday', '11:00-11:50', 'Programming Fundamentals Lab', 'CL-01', '7th Semester', '2022', 'B'),
('Thursday', '13:30-14:20', 'Mathematics II', 'AC-301', '7th Semester', '2022', 'B'),
('Thursday', '14:20-15:10', 'Discrete Structures', 'AC-301', '7th Semester', '2022', 'B'),
('Friday', '10:10-11:00', 'ELP', 'AC-301', '7th Semester', '2022', 'B'),
('Friday', '11:00-11:50', 'Programming Fundamentals', 'AC-301', '7th Semester', '2022', 'B');

-- 4. INSERT SECTION C SCHEDULE
-- Primary Venue: AC-303 (Theory), CL-04 (Labs), Math Venue: AC-304
INSERT INTO timetable_entries (day, time_slot, subject, venue, semester, batch, section) VALUES
('Monday', '08:30-09:20', 'Programming Fundamentals', 'AC-303', '7th Semester', '2022', 'C'),
('Monday', '11:00-11:50', 'Application of Information & Communication Technologies Lab', 'CL-04', '7th Semester', '2022', 'C'),
('Monday', '14:20-15:10', 'Functional English', 'AC-303', '7th Semester', '2022', 'C'),
('Tuesday', '10:10-11:00', 'Functional English', 'AC-303', '7th Semester', '2022', 'C'),
('Tuesday', '11:00-11:50', 'Programming Fundamentals Lab', 'CL-04', '7th Semester', '2022', 'C'),
('Tuesday', '14:20-15:10', 'Mathematics I', 'AC-304', '7th Semester', '2022', 'C'),
('Wednesday', '10:10-11:00', 'Mathematics I', 'AC-304', '7th Semester', '2022', 'C'),
('Wednesday', '11:00-11:50', 'Calculus and Analytic Geometry', 'AC-303', '7th Semester', '2022', 'C'),
('Wednesday', '12:40-13:30', 'Discrete Structures', 'AC-303', '7th Semester', '2022', 'C'),
('Wednesday', '14:20-15:10', 'Mathematics II', 'AC-304', '7th Semester', '2022', 'C'),
('Thursday', '08:30-09:20', 'Programming Fundamentals', 'AC-303', '7th Semester', '2022', 'C'),
('Thursday', '11:00-11:50', 'Discrete Structures', 'AC-303', '7th Semester', '2022', 'C'),
('Thursday', '12:40-13:30', 'Calculus and Analytic Geometry', 'AC-303', '7th Semester', '2022', 'C'),
('Thursday', '13:30-14:20', 'Mathematics II', 'AC-304', '7th Semester', '2022', 'C'),
('Friday', '10:10-11:00', 'ELP', 'AC-303', '7th Semester', '2022', 'C'),
('Friday', '11:00-11:50', 'Application of Information & Communication Technologies', 'AC-303', '7th Semester', '2022', 'C');
