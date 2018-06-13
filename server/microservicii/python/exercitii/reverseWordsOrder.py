def reverseWord(w):
    return ' '.join(w.split()[::-1])    


word = "Ana are mere multe si le mananca zilnic"
print reverseWord(word)