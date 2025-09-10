# 4)	Write a class schedule formatting program that does the following (25 points):
# a.	Parses “classesInput.txt” for the following info (on the corresponding line):
# Line 0: Number of courses (the following data should exist for each course)
# Line 1: Course department
# Line 2: Course number 
# Line 3: Course name
# Line 4: Credits
# Line 5: Lecture days
# Line 6: Start time of the lecture
# Line 7: End time of the lecture
# Line 8: Average grade (percentage) for the course
# b.	Outputs a file with the data formatted as follows:
# COURSE 1: <Course department><Course number>:<Course name>
# Number of Credits: <Credits>
# Days of Lectures: <Lecture days>
# Lecture Time: <Start time> - <End time>
# Stat: on average, students get <average grade> in this course

# REPEAT for each additional class, up to <Number of courses>
# c.	Example:
# Input:
# 2
# CSE
# 030
# Data Structures
# 4
# Monday, Wednesday
# 4:30pm
# 5:45pm
# 85
# CSE
# 165
# Introduction to Object Oriented Programming
# 4 
# Tuesday, Thursday 
# 9:00am
# 10:15am 
# 87

# Output:
# COURSE 1: CSE030: Data Structures
# Number of Credits: 4
# Days of Lectures: Monday, Wednesday
# Lecture Time: 4:30pm – 5:45pm
# Stat: on average, students get 85% in this course

# COURSE 2: CSE165: Introduction to Object Oriented Programming
# Number of Credits: 4
# Days of Lectures: Tuesday, Thursday
# Lecture Time: 9:00am – 10:15am
# Stat: on average, students get 87% in this course
# d.	Note: to get full points, you must create a Python class that holds the above data and has a format function that returns, or outputs the formatted text 


class Course:
    def __init__(self, dept, num, name, credits, days, start_time, end_time, avg_grade):
        self.dept = dept
        self.num = num
        self.name = name
        self.credits = credits
        self.days = days
        self.start_time = start_time
        self.end_time = end_time
        self.avg_grade = avg_grade


    
    def format(self):
        return(

            f"COURSE: {self.dept}{self.num}: {self.name}\n"
            f"Number of Credits: {self.credits}\n"
            f"Days of Lectures: {self.days}\n"
            f"Lecture Time: {self.start_time} - {self.end_time}\n"
            f"Stat: on average, students get {self.avg_grade}% in this course\n"
        )

def class_sched():
    with open("classesInput.txt", "r") as file:
        lines = file.readlines()