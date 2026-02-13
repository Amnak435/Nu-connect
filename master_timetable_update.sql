-- ================================================================
-- MASTER TIMETABLE UPDATE (SEMESTERS 1-4) - BATCH CS-2024
-- ================================================================

-- 1. CLEAR ALL PREVIOUS ENTRIES FOR THIS BATCH TO ENSURE ACCURACY
DELETE FROM timetable_entries 
WHERE (batch = '2024' OR batch = 'CS-2024')
  AND semester IN ('1st Semester', '2nd Semester', '3rd Semester', '4th Semester');

-- ----------------------------------------------------------------
-- SEMESTER 1 (Sections A, B, C)
-- ----------------------------------------------------------------
INSERT INTO timetable_entries (day, time_slot, subject, venue, semester, batch, section) VALUES
-- Section A
('Monday', '08:30-09:20', 'Programming Fundamentals', 'AC Lab 1', '1st Semester', '2024', 'A'),
('Monday', '09:25-10:15', 'Calculus-I', 'AC-301', '1st Semester', '2024', 'A'),
('Monday', '10:20-11:10', 'English Composition', 'AC-203', '1st Semester', '2024', 'A'),
('Monday', '11:15-12:05', 'ICT', 'AC-301', '1st Semester', '2024', 'A'),
('Tuesday', '08:30-10:15', 'Programming Lab', 'Programming Lab 1', '1st Semester', '2024', 'A'),
('Tuesday', '10:20-11:10', 'Applied Physics', 'Physics Lab', '1st Semester', '2024', 'A'),
('Tuesday', '11:15-12:05', 'Calculus-I', 'AC-301', '1st Semester', '2024', 'A'),
('Wednesday', '08:30-09:20', 'ICT', 'AC-301', '1st Semester', '2024', 'A'),
('Wednesday', '09:25-10:15', 'Programming Fundamentals', 'AC Lab 1', '1st Semester', '2024', 'A'),
('Wednesday', '10:20-11:10', 'English Composition', 'AC-203', '1st Semester', '2024', 'A'),
('Wednesday', '11:15-12:05', 'Applied Physics', 'Physics Lab', '1st Semester', '2024', 'A'),
('Thursday', '08:30-09:20', 'Calculus-I', 'AC-301', '1st Semester', '2024', 'A'),
('Thursday', '09:25-10:15', 'ICT', 'AC-301', '1st Semester', '2024', 'A'),
('Thursday', '10:20-12:05', 'Physics Lab', 'Physics Lab', '1st Semester', '2024', 'A'),
('Friday', '08:30-09:20', 'Programming Fundamentals', 'AC Lab 1', '1st Semester', '2024', 'A'),
('Friday', '09:25-10:15', 'English Composition', 'AC-203', '1st Semester', '2024', 'A'),
-- Section B
('Monday', '08:30-09:20', 'Programming Fundamentals', 'AC Lab 2', '1st Semester', '2024', 'B'),
('Monday', '09:25-10:15', 'Calculus-I', 'AC-302', '1st Semester', '2024', 'B'),
('Monday', '10:20-11:10', 'English Composition', 'AC-204', '1st Semester', '2024', 'B'),
('Monday', '11:15-12:05', 'ICT', 'AC-302', '1st Semester', '2024', 'B'),
('Tuesday', '08:30-10:15', 'Programming Lab', 'Programming Lab 2', '1st Semester', '2024', 'B'),
('Tuesday', '10:20-11:10', 'Applied Physics', 'Physics Lab', '1st Semester', '2024', 'B'),
('Tuesday', '11:15-12:05', 'Calculus-I', 'AC-302', '1st Semester', '2024', 'B'),
('Wednesday', '08:30-09:20', 'ICT', 'AC-302', '1st Semester', '2024', 'B'),
('Wednesday', '09:25-10:15', 'Programming Fundamentals', 'AC Lab 2', '1st Semester', '2024', 'B'),
('Wednesday', '10:20-11:10', 'English Composition', 'AC-204', '1st Semester', '2024', 'B'),
('Wednesday', '11:15-12:05', 'Applied Physics', 'Physics Lab', '1st Semester', '2024', 'B'),
('Thursday', '08:30-09:20', 'Calculus-I', 'AC-302', '1st Semester', '2024', 'B'),
('Thursday', '09:25-10:15', 'ICT', 'AC-302', '1st Semester', '2024', 'B'),
('Thursday', '10:20-12:05', 'Physics Lab', 'Physics Lab', '1st Semester', '2024', 'B'),
('Friday', '08:30-09:20', 'Programming Fundamentals', 'AC Lab 2', '1st Semester', '2024', 'B'),
('Friday', '09:25-10:15', 'English Composition', 'AC-204', '1st Semester', '2024', 'B'),
-- Section C
('Monday', '08:30-09:20', 'Programming Fundamentals', 'AC Lab 3', '1st Semester', '2024', 'C'),
('Monday', '09:25-10:15', 'Calculus-I', 'AC-303', '1st Semester', '2024', 'C'),
('Monday', '10:20-11:10', 'English Composition', 'AC-205', '1st Semester', '2024', 'C'),
('Monday', '11:15-12:05', 'ICT', 'AC-303', '1st Semester', '2024', 'C'),
('Tuesday', '08:30-10:15', 'Programming Lab', 'Programming Lab 3', '1st Semester', '2024', 'C'),
('Tuesday', '10:20-11:10', 'Applied Physics', 'Physics Lab', '1st Semester', '2024', 'C'),
('Tuesday', '11:15-12:05', 'Calculus-I', 'AC-303', '1st Semester', '2024', 'C'),
('Wednesday', '08:30-09:20', 'ICT', 'AC-303', '1st Semester', '2024', 'C'),
('Wednesday', '09:25-10:15', 'Programming Fundamentals', 'AC Lab 3', '1st Semester', '2024', 'C'),
('Wednesday', '10:20-11:10', 'English Composition', 'AC-205', '1st Semester', '2024', 'C'),
('Wednesday', '11:15-12:05', 'Applied Physics', 'Physics Lab', '1st Semester', '2024', 'C'),
('Thursday', '08:30-09:20', 'Calculus-I', 'AC-303', '1st Semester', '2024', 'C'),
('Thursday', '09:25-10:15', 'ICT', 'AC-303', '1st Semester', '2024', 'C'),
('Thursday', '10:20-12:05', 'Physics Lab', 'Physics Lab', '1st Semester', '2024', 'C'),
('Friday', '08:30-09:20', 'Programming Fundamentals', 'AC Lab 3', '1st Semester', '2024', 'C'),
('Friday', '09:25-10:15', 'English Composition', 'AC-205', '1st Semester', '2024', 'C');

-- ----------------------------------------------------------------
-- SEMESTER 2 (Sections A, B, C)
-- ----------------------------------------------------------------
INSERT INTO timetable_entries (day, time_slot, subject, faculty_name, venue, semester, batch, section) VALUES
-- Section A
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
('Thursday', '09:25-10:15', 'Database Systems', 'Lec. Noushin Saba', 'AC-301', '2nd Semester', '2024', 'A'),
-- Section B
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
('Thursday', '09:25-10:15', 'Database Systems', 'Lec. Noushin Saba', 'AC-302', '2nd Semester', '2024', 'B'),
-- Section C
('Monday', '08:30-09:20', 'Multivariable Calculus', 'Dr. Ahsan Abbas', 'AC-205', '2nd Semester', '2024', 'C'),
('Monday', '10:20-11:10', 'Linear Algebra', 'Dr. Muhammad Asim', 'AC-205', '2nd Semester', '2024', 'C'),
('Monday', '12:50-13:40', 'Digital Logic Design Lab', 'Lec. Tahreem Khalil', 'Programming Lab 3', '2nd Semester', '2024', 'C'),
('Tuesday', '10:20-11:10', 'Object Oriented Programming', 'Lec. Tayyaba Kalsoom', 'AC-303', '2nd Semester', '2024', 'C'),
('Tuesday', '12:50-13:40', 'Database Systems Lab', 'Lec. Noushin Saba', 'Programming Lab 3', '2nd Semester', '2024', 'C'),
('Wednesday', '08:30-09:20', 'Database Systems', 'Lec. Noushin Saba', 'AC-303', '2nd Semester', '2024', 'C'),
('Wednesday', '09:25-10:15', 'Digital Logic Design', 'Lec. Rizwan Yousaf', 'AC-303', '2nd Semester', '2024', 'C'),
('Wednesday', '12:50-13:40', 'Object Oriented Programming Lab', 'Lec. Tayyaba Kalsoom', 'Programming Lab 3', '2nd Semester', '2024', 'C');

-- ----------------------------------------------------------------
-- SEMESTER 3 (Sections A, B, C)
-- ----------------------------------------------------------------
INSERT INTO timetable_entries (day, time_slot, subject, faculty_name, venue, semester, batch, section) VALUES
-- Section A
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
('Thursday', '09:25-10:15', 'Operating Systems', 'Lec. Hina Batool', 'AC-301', '3rd Semester', '2024', 'A'),
-- Section B
('Monday', '08:30-09:20', 'Data Structures & Algorithms', 'Lec. Mehran Yousaf', 'AC-302', '3rd Semester', '2024', 'B'),
('Monday', '09:25-10:15', 'Probability & Statistics', 'Dr. Faryal Khan', 'AC-302', '3rd Semester', '2024', 'B'),
('Monday', '10:20-11:10', 'Computer Networks', 'Lec. Naveed Ahmed', 'AC-302', '3rd Semester', '2024', 'B'),
('Monday', '12:50-13:40', 'Data Structures Lab', 'Lec. Mehran Yousaf', 'Programming Lab 2', '3rd Semester', '2024', 'B'),
('Tuesday', '08:30-09:20', 'Operating Systems', 'Lec. Hina Batool', 'AC-302', '3rd Semester', '2024', 'B'),
('Tuesday', '09:25-10:15', 'Computer Networks', 'Lec. Naveed Ahmed', 'AC-302', '3rd Semester', '2024', 'B'),
('Tuesday', '10:20-11:10', 'Probability & Statistics', 'Dr. Faryal Khan', 'AC-302', '3rd Semester', '2024', 'B'),
('Wednesday', '08:30-09:20', 'Data Structures & Algorithms', 'Lec. Mehran Yousaf', 'AC-302', '3rd Semester', '2024', 'B'),
('Wednesday', '09:25-10:15', 'Operating Systems', 'Lec. Hina Batool', 'AC-302', '3rd Semester', '2024', 'B'),
('Wednesday', '12:50-13:40', 'Computer Networks Lab', 'Lec. Naveed Ahmed', 'Networking Lab', '3rd Semester', '2024', 'B'),
-- Section C
('Monday', '08:30-09:20', 'Data Structures & Algorithms', 'Lec. Mehran Yousaf', 'AC-205', '3rd Semester', '2024', 'C'),
('Monday', '09:25-10:15', 'Probability & Statistics', 'Dr. Faryal Khan', 'AC-205', '3rd Semester', '2024', 'C'),
('Monday', '10:20-11:10', 'Computer Networks', 'Lec. Naveed Ahmed', 'AC-205', '3rd Semester', '2024', 'C'),
('Monday', '12:50-13:40', 'Data Structures Lab', 'Lec. Mehran Yousaf', 'Programming Lab 3', '3rd Semester', '2024', 'C'),
('Tuesday', '08:30-09:20', 'Operating Systems', 'Lec. Hina Batool', 'AC-303', '3rd Semester', '2024', 'C'),
('Tuesday', '10:20-11:10', 'Probability & Statistics', 'Dr. Faryal Khan', 'AC-303', '3rd Semester', '2024', 'C'),
('Wednesday', '09:25-10:15', 'Operating Systems', 'Lec. Hina Batool', 'AC-303', '3rd Semester', '2024', 'C'),
('Wednesday', '12:50-13:40', 'Computer Networks Lab', 'Lec. Naveed Ahmed', 'Networking Lab', '3rd Semester', '2024', 'C');

-- ----------------------------------------------------------------
-- SEMESTER 4 (Sections A, B, C)
-- ----------------------------------------------------------------
INSERT INTO timetable_entries (day, time_slot, subject, faculty_name, venue, semester, batch, section) VALUES
-- Section A
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
('Thursday', '09:25-10:15', 'Theory of Automata', 'Dr. Imran Siddiqui', 'AC-301', '4th Semester', '2024', 'A'),
-- Section B
('Monday', '08:30-09:20', 'Design & Analysis of Algorithms', 'Dr. Usman Tariq', 'AC-302', '4th Semester', '2024', 'B'),
('Monday', '09:25-10:15', 'Software Engineering', 'Lec. Hira Javed', 'AC-302', '4th Semester', '2024', 'B'),
('Monday', '10:20-11:10', 'Theory of Automata', 'Dr. Imran Siddiqui', 'AC-302', '4th Semester', '2024', 'B'),
('Monday', '12:50-13:40', 'Algorithms Lab', 'Dr. Usman Tariq', 'Programming Lab 2', '4th Semester', '2024', 'B'),
('Tuesday', '08:30-09:20', 'Database Systems', 'Lec. Noushin Saba', 'AC-302', '4th Semester', '2024', 'B'),
('Tuesday', '09:25-10:15', 'Software Engineering', 'Lec. Hira Javed', 'AC-302', '4th Semester', '2024', 'B'),
('Tuesday', '10:20-11:10', 'Theory of Automata', 'Dr. Imran Siddiqui', 'AC-302', '4th Semester', '2024', 'B'),
('Wednesday', '08:30-09:20', 'Design & Analysis of Algorithms', 'Dr. Usman Tariq', 'AC-302', '4th Semester', '2024', 'B'),
('Wednesday', '12:50-13:40', 'Database Systems Lab', 'Lec. Noushin Saba', 'CL-03', '4th Semester', '2024', 'B'),
-- Section C
('Monday', '08:30-09:20', 'Design & Analysis of Algorithms', 'Dr. Usman Tariq', 'AC-205', '4th Semester', '2024', 'C'),
('Monday', '09:25-10:15', 'Software Engineering', 'Lec. Hira Javed', 'AC-205', '4th Semester', '2024', 'C'),
('Monday', '10:20-11:10', 'Theory of Automata', 'Dr. Imran Siddiqui', 'AC-205', '4th Semester', '2024', 'C'),
('Monday', '12:50-13:40', 'Algorithms Lab', 'Dr. Usman Tariq', 'Programming Lab 3', '4th Semester', '2024', 'C'),
('Tuesday', '08:30-09:20', 'Database Systems', 'Lec. Noushin Saba', 'AC-303', '4th Semester', '2024', 'C'),
('Tuesday', '09:25-10:15', 'Software Engineering', 'Lec. Hira Javed', 'AC-303', '4th Semester', '2024', 'C'),
('Wednesday', '09:25-10:15', 'Theory of Automata', 'Dr. Imran Siddiqui', 'AC-303', '4th Semester', '2024', 'C'),
('Wednesday', '12:50-13:40', 'Database Systems Lab', 'Lec. Noushin Saba', 'Programming Lab 3', '4th Semester', '2024', 'C');
