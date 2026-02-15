-- ==========================================
-- TIMETABLE UPDATE: SEMESTER 3 (CS-2024)
-- Sections: A, B, C
-- ==========================================

-- 1. DELETE OLD DATA for Semester 3 (Batch 2024) to prevent overlaps
DELETE FROM timetable_entries 
WHERE semester = '3rd Semester' 
  AND (batch = '2024' OR batch = 'CS-2024')
  AND section IN ('A', 'B', 'C');

-- 2. INSERT SECTION A SCHEDULE
INSERT INTO timetable_entries (day, time_slot, subject, faculty_name, venue, semester, batch, section) VALUES
('Monday', '08:30-09:20', 'Data Structures & Algorithms', 'Lec. Mehran Yousaf', 'AC-301', '3rd Semester', '2024', 'A'),
('Monday', '09:25-10:15', 'Probability & Statistics', 'Dr. Faryal Khan', 'AC-301', '3rd Semester', '2024', 'A'),
('Monday', '10:20-11:10', 'Computer Networks', 'Lec. Naveed Ahmed', 'AC-301', '3rd Semester', '2024', 'A'),
('Monday', '12:50-13:40', 'Data Structures Lab', 'Lec. Mehran Yousaf', 'Programming Lab 1', '3rd Semester', '2024', 'A'),
('Tuesday', '08:30-09:20', 'Operating Systems', 'Lec. Hina Batool', 'AC-301', '3rd Semester', '2024', 'A'),
('Tuesday', '09:25-10:15', 'Computer Networks', 'Lec. Naveed Ahmed', 'AC-301', '3rd Semester', '2024', 'A'),
('Tuesday', '10:20-11:10', 'Probability & Statistics', 'Dr. Faryal Khan', 'AC-301', '3rd Semester', '2024', 'A'),
('Wednesday', '08:30-09:20', 'Data Structures & Algorithms', 'Lec. Mehran Yousaf', 'AC-301', '3rd Semester', '2024', 'A'),
('Wednesday', '09:25-10:15', 'Operating Systems', 'Lec. Hina Batool', 'AC-301', '3rd Semester', '2024', 'A'),
('Wednesday', '12:50-13:40', 'Computer Networks Lab', 'Lec. Naveed Ahmed', 'Networking Lab', '3rd Semester', '2024', 'A'),
('Thursday', '08:30-09:20', 'Probability & Statistics', 'Dr. Faryal Khan', 'AC-301', '3rd Semester', '2024', 'A'),
('Thursday', '09:25-10:15', 'Operating Systems', 'Lec. Hina Batool', 'AC-301', '3rd Semester', '2024', 'A');

-- 3. INSERT SECTION B SCHEDULE
INSERT INTO timetable_entries (day, time_slot, subject, faculty_name, venue, semester, batch, section) VALUES
('Monday', '08:30-09:20', 'Data Structures & Algorithms', 'Lec. Mehran Yousaf', 'AC-302', '3rd Semester', '2024', 'B'),
('Monday', '09:25-10:15', 'Probability & Statistics', 'Dr. Faryal Khan', 'AC-302', '3rd Semester', '2024', 'B'),
('Monday', '10:20-11:10', 'Computer Networks', 'Lec. Naveed Ahmed', 'AC-302', '3rd Semester', '2024', 'B'),
('Monday', '12:50-13:40', 'Data Structures Lab', 'Lec. Mehran Yousaf', 'Programming Lab 2', '3rd Semester', '2024', 'B'),
('Tuesday', '08:30-09:20', 'Operating Systems', 'Lec. Hina Batool', 'AC-302', '3rd Semester', '2024', 'B'),
('Tuesday', '09:25-10:15', 'Computer Networks', 'Lec. Naveed Ahmed', 'AC-302', '3rd Semester', '2024', 'B'),
('Tuesday', '10:20-11:10', 'Probability & Statistics', 'Dr. Faryal Khan', 'AC-302', '3rd Semester', '2024', 'B'),
('Wednesday', '08:30-09:20', 'Data Structures & Algorithms', 'Lec. Mehran Yousaf', 'AC-302', '3rd Semester', '2024', 'B'),
('Wednesday', '09:25-10:15', 'Operating Systems', 'Lec. Hina Batool', 'AC-302', '3rd Semester', '2024', 'B'),
('Wednesday', '12:50-13:40', 'Computer Networks Lab', 'Lec. Naveed Ahmed', 'Networking Lab', '3rd Semester', '2024', 'B');

-- 4. INSERT SECTION C SCHEDULE
INSERT INTO timetable_entries (day, time_slot, subject, faculty_name, venue, semester, batch, section) VALUES
('Monday', '08:30-09:20', 'Data Structures & Algorithms', 'Lec. Mehran Yousaf', 'AC-205', '3rd Semester', '2024', 'C'),
('Monday', '09:25-10:15', 'Probability & Statistics', 'Dr. Faryal Khan', 'AC-205', '3rd Semester', '2024', 'C'),
('Monday', '10:20-11:10', 'Computer Networks', 'Lec. Naveed Ahmed', 'AC-205', '3rd Semester', '2024', 'C'),
('Monday', '12:50-13:40', 'Data Structures Lab', 'Lec. Mehran Yousaf', 'Programming Lab 3', '3rd Semester', '2024', 'C'),
('Tuesday', '08:30-09:20', 'Operating Systems', 'Lec. Hina Batool', 'AC-303', '3rd Semester', '2024', 'C'),
('Tuesday', '10:20-11:10', 'Probability & Statistics', 'Dr. Faryal Khan', 'AC-303', '3rd Semester', '2024', 'C'),
('Wednesday', '09:25-10:15', 'Operating Systems', 'Lec. Hina Batool', 'AC-303', '3rd Semester', '2024', 'C'),
('Wednesday', '12:50-13:40', 'Computer Networks Lab', 'Lec. Naveed Ahmed', 'Networking Lab', '3rd Semester', '2024', 'C');
