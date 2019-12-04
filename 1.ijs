F =: '/Users/bhaines/Downloads/input.txt'
data =: 1!:1 < F
n =: > ". each cutopen data
+/<.(n%3)-2
