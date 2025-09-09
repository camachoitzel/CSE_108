# 2)	Write a punishment automation program in Python that does the following (15 points):
# Ask the user to enter a sentence and the times a sentence should be repeated
# The program should write the sentence (with a line break) the number of times specified by the user to a file called “CompletedPunishment.txt”
# Example: 
# The user enters this for the sentence: I will not sleep in class 
# The user enters this for the number of repeats: 100 
# The program should write “I will not sleep in class” 100 times to “CompletedPunishment.txt”.

sentence = input("Please input a sentence:  ")
num_of_reps = int(input("Please input a number: "))

try: 
    with open("CompletedPunishment.txt", "w") as file:
        for i in range(num_of_reps):
            file.write(sentence + "\n")
except ValueError: