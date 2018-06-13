def reverse(word):
	x = ''
	for i in range(len(word)):
		x += word[len(word)-1-i]
	return x

list = ["girl","ana","is","sisi","cojoc","reper","unu","madam"]

resultedList = []
print reverse("alex")
for x in list:
    if x == reverse(x):
        resultedList.append(x)
    print reverse(x)
print resultedList