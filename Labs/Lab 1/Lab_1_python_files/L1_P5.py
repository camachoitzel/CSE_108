# 5)	Create a grades program that does the following (25 points):
# a.	Allows a user to create a student name and grade
# b.	Allows a user to ask for a grade, given the full name of the student
# c.	Allows a user to edit a grade
# d.	Allows a user to delete a grade
# e.	Reads/writes to grades.txt to store grade data persistently in JSON format
# f.	Stores grades in memory data as a dictionary and updates grades.txt with any changes
# g.	Loads grade data from grades.txt into dictionary on program start-up

import os
import json

# move to curr directory
os.chdir(r'Labs\Lab 1\Lab_1_python_files')
# check the curr directory to make sure it is correct
# print(os.getcwd())

def load_grades():
    # empty dictioanry for json
    grades = {}
    # check if grades.txt exists
    if os.path.exists("grades.txt"):
        # print("grades.txt was found")
        # open grades.txt in read mode
        with open("grades.txt" , "r") as file:
            # print("reading grades and loading grades into dict")
            # load json data in grades dict
            grades = json.load(file)
            # print("grades have been read and loaded into dict")
        
    else:
        # grades not found return an empty dict
        return {}
    
    # return the grades dict
    return grades


def save_grades(grades):
    # open grades.txt in write mode
    with open("grades.txt", "w") as file:
        # write to json file the grades passed onto it
        json.dump(grades, file)


def create_grade(grades):
    # get student name
    name = input("Enter student's full name: \n" )
    # get grade
    grade = input("Enter the grade: \n")

    # add the name to the dict and the grade if not in keys
    # update the grade of the student if it already exists in the keys
    grades[name] = grade
    save_grades(grades)
    # confirmation that the step was done
    print(f"Grade for {name} added. \n")


def get_grade(grades):
    # get name to search
    name_search = input("Enter the student's full name to get the grade: \n")
    
    # check if name is in dict
    if name_search in grades.keys():
        # get the grade if name is in dict
        grade = name_search.get()
        # print the student's grade
        print(f"{name_search}'s grade: {grade} \n")
    else:
        # student not in dict
        print("Student not found \n")


def edit_grade(grades):
    name = input("Enter a student's full name to edit the grade: /n")

    if name in grades.keys():
        new_grade = input(f"Enter the new grade for {name}: \n")
        grades[name] = new_grade
        save_grades(grades)
        print(f"{name}'s grade updated \n")
    else:
        print("Student not found \n")

def delete_grade(grades):
    name = input("Enter a student't full name to delete grade: \n")

    if name in grades.keys():
        grades[name] = None
        save_grades(grades)
        print(f"{name}'s grade has been deleted \n")
    else:
        print("Student not found \n")

def grade_prgrm():
    grades = load_grades()

    while True:
        print("MENU: \n")
        print("1. Add a grade")
        print("2. Get a grade")
        print("3. Edit a grade")
        print("4. Delete a grade")
        print("5. Exit")

        user_choice = input("Choose an option: \n")

        if user_choice == "1":
            create_grade(grades)
        elif user_choice == "2":
            get_grade(grades)
        elif user_choice == "3":
            edit_grade(grades)
        elif user_choice == "4":
            delete_grade(grades)
        elif user_choice == "5":
            print("Exiting program")
            break
        else:
            print("Invalid input, please try again. \n")




