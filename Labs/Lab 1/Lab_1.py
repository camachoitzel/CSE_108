# 1)	Write an adding program that does the following (10 points):
# 	Ask the user to enter two or more numbers separated by spaces
# 	Print the sum of all the numbers to the console
# 	Throw an error if they do not enter at least two numbers or contain a string
# 	Note: the numbers can be integers or decimals
# 	Example: 
# 	The user enters: 1 2 3 4 
# 	The program prints: 10

valid_num = True
while valid_num:
    input_nums = input("Please input 2 or more numbers separated by a space: \n")
    nums = input_nums.split()

    if len(nums) < 2:
        print("At least 2 numbers are needed for a valid input \n")
        continue

    try:
        nums_lst = []
        for num in nums:
            nums_lst.append(float(num))
        nums = nums_lst

        print(f"The sum of your numbers is: {sum(nums)} \n")
        valid_num = False
    except ValueError:
        print("The value you input is not valid, try again \n")








