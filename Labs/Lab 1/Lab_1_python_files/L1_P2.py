import os
# 2)	Write a punishment automation program in Python that does the following (15 points):
# Ask the user to enter a sentence and the times a sentence should be repeated
# The program should write the sentence (with a line break) the number of times specified by the user to a file called “CompletedPunishment.txt”
# Example: 
# The user enters this for the sentence: I will not sleep in class 
# The user enters this for the number of repeats: 100 
# The program should write “I will not sleep in class” 100 times to “CompletedPunishment.txt”.

def is_valid_sentence(s):
    for char in s:
        if char.isalpha():
            return True
    return False

def punishment():
    attempts = 0

    while attempts < 3:
        sentence = input("Enter a sentence: \n")

        if is_valid_sentence(sentence):
            break
        else:
            print("Invalid input, sentence not detected try again")
            attempts += 1
    
    if attempts == 3:
        print("Too many incorrect attempts. Exiting program...Goodbye")
        return
    
    reps = int(input("Enter the number of times to repeat the sentence: \n"))

    file_path = "CompletedPunishment.txt"

    try:
        with open("CompletedPunishment.txt", "w") as file:
            for i in range(reps):
                file.write(sentence + "\n")
        
        print(f"{sentence} has been written {reps} times to {file_path}")
    
    except IOError as e:
        print(f"An error occurred while writing to the file: {e}")

    


punishment()

    
# sentence = input("Please input a sentence:  ")
# num_of_reps = int(input("Please input a number: "))

# try: 
#     with open("CompletedPunishment.txt", "w") as file:
#         for i in range(num_of_reps):
#             file.write(sentence + "\n")
# except ValueError: