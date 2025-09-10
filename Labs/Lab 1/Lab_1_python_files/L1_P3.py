# 3)	Write a word count program in Python that does the following (25 points):
# a.	Prompt the user to enter a word
# b.	Parse PythonSummary.txt and count the number of times the word occurs in the file
# c.	Tell the user how many times the word occurs
# d.	Note: It should find the word regardless of case (upper or lower) or punctuation
# e.	Example:
# i.	The user enters: python 
# ii.	The program should print: The word python occurs 13 times 
import os
import string

# print("current directory: " , os.getcwd())


def word_count():
    word = input("Enter a word to search: \n").lower()
    
    file_name = r"Labs\Lab 1\Lab_1_python_files\PythonSummary.txt"

    if not os.path.exists(file_name):
        print(f"Error: The {file_name} file does not exist in the current directory")
        return
    
    try:
        with open(file_name, "r") as file:
            # converts the letter in file to lowercase
            content = file.read().lower()
            # create a translation table from a dictionary that maps each punctuation char to a space
            translator = str.maketrans({key: " " for key in string.punctuation})
            # replaces all punctiation with spaces " "
            content = content.translate(translator)
            word_count = content.split().count(word)
        
        print(f"The word {word} occurs {word_count} times")
    except Exception as e: 
        print(f"An error occured while reading the file: {e}")

word_count()