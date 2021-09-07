import csv
import sys

from htmlBuilder.attributes import Class, Rel, Type, Href, Content, Name, Id, Src, Oninput, Placeholder, Value, \
    Onchange, For, Onload, Onclick
from htmlBuilder.tags import Tr, Td, Text, Html, Head, Title, Link, Body, P, H1, Table, Tbody, Col, Meta, Ul, Li, A, Input, \
    Script, Span, Select, Option, Label, Button, Br


def create_student_list():
    try:
        with open("studentdata.csv", newline="") as student_data:
            students = []

            lines = list(csv.reader(student_data, delimiter=","))
            for x in range(int((len(lines) + 1) / 12)):
                line = lines[12 * x]
                next_names = line[1].split(" ")
                students.append(Li(A(Href("/student/{}".format(line[0])),
                                     Span(
                                         Class("first-name"), Text("{} ".format(" ".join(next_names[0:-1])))
                                     ),
                                     Span(
                                         Class("last-name"), Text(next_names[-1])
                                     )
                                     )))

        html = Html(
            Head(
                Title(Text("Locate Reborn")),
                Link(Rel("icon"), Type("image/png"), Href("monocle_cat.png")),
                Link(Rel("stylesheet"), Href("styles.css")),
                Script(Src("filter.js")),
                Script(Src("sort.js")),
                Meta(Name("og:title"), Content("Locate Reborn")),
                Meta(Name("og:description"), Content("Stalk your BCA friends!")),
                Meta(Name("og:image"), Content("https://locate-reborn.glitch.me/monocle_cat.png")),
                Meta(Name("theme-color"), Content("#FFD700"))
            ),
            Body(
                Onload("filter(); sort()"),
                H1(Text("Students/Teachers")),
                Span(Class("inline"), P(Text("Report bugs&nbsp")), A(Href("bugs/bugtracker.html"), Class("bug"), Text("here"))),
                Span(Class("inline"),
                     Input(Id("filter-text"), Type("text"), Placeholder("Filter..."), Oninput("filter()")),
                     Span(Text("Filter by:")),
                     Select(Id("filter-type"), Onchange("filter(); sort()"),
                            Option(Value("any"), Text("Any")),
                            Option(Value("first"), Text("First Name")),
                            Option(Value("last"), Text("Last Name"))
                            ),
                     Input(Id("alphabetical"), Type("checkbox"), Name("alphabetical"), Onchange("sort()")),
                     Label(For("alphabetical"), Text("Sort Descending")),
                     ),
                Ul(Id("students"), *students)
            )
        )
        print(html.render())
    except FileNotFoundError:
        sys.stderr.write("No studentdata.csv file!")
    return


def create_course_list(course_id):
    try:
        with open("studentdata.csv", newline="") as student_data, open("coursedata.csv", newline="") as course_data:
            student_lines = list(csv.reader(student_data, delimiter=","))[0::12]
            students = []
            for line in csv.reader(course_data, delimiter=",", quoting=csv.QUOTE_ALL):
                if line[0] == course_id:
                    for student_id in line[2::]:
                        students.append(Li(A(Href("/student/{}".format(student_id)), Text(
                            [student_name for student_name in student_lines if student_name[0] == student_id][0][1]))))
                    break

            course_name = line[1]

            html = Html(
                Head(
                    Title(Text("Locate Reborn")),
                    Link(Rel("icon"), Type("image/png"), Href("monocle_cat.png")),
                    Link(Rel("stylesheet"), Href("styles.css")),
                    Meta(Name("og:title"), Content("Locate Reborn")),
                    Meta(Name("og:description"), Content("Student Info and Schedule for {}".format(course_name))),
                    Meta(Name("theme-color"), Content("#FFD700"))
                ),
                Body(
                    H1(Text(course_name)),
                    Ul(Id("students"), *students),
                    Br(),
                    Span(Class("inline"),
                         Button(A(Onclick("location.href = \"https://locate-reborn.glitch.me/\""), Text("Home"))),
                         Button(A(Onclick("window.history.back()"), Text("Back"))),
                         )
                )
            )
            print(html.render())
    except FileNotFoundError:
        sys.stderr.write("Integral files are missing from the server!")
    return


def create_row(course_lines, courses_dict, line, row_number):
    cols = []
    for x in range(0, 6):
        if line[x] not in courses_dict:
            for course_line in course_lines:
                if line[x] == course_line[0]:
                    components = course_line[1].split(":")
                    components[1] = components[1][components[1].find("(") + 1:components[1].find(")")]

                    courses_dict[line[x]] = components
                    break
            if line[x] not in courses_dict:
                courses_dict[line[x]] = [line[x]]

        cols.append(Td(Class(" ".join(courses_dict[line[x]])), A(Href("/course/{}".format(line[x])), Text(courses_dict[line[x]][0]))))

    return Tr(Class("row{}".format(str(row_number))), *cols)


def create_course_table(student_id):
    try:
        with open("studentdata.csv", newline="") as student_data, open("coursedata.csv", newline='') as course_data:
            student_lines = list(csv.reader(student_data, delimiter=","))
            for index in range(int((len(student_lines) + 1) / 12)):
                if student_lines[12 * index][0] == student_id:
                    break
            else:
                sys.stderr.write("Student data for id {} does not exist!".format(student_id))
                return

            index *= 12
            student_name = student_lines[index][1]

            cols = []
            for x in range(0, 6):
                cols.append(Col(Class("col" + str(x))))

            rows = []
            course_lines = list(csv.reader(course_data, delimiter=',', quoting=csv.QUOTE_ALL))
            courses_dict = {}
            for x in range(1, 11):
                rows.append(create_row(course_lines, courses_dict, student_lines[index + x], x))

            html = Html(
                Head(
                    Title(Text("Locate Reborn")),
                    Link(Rel("icon"), Type("image/png"), Href("monocle_cat.png")),
                    Link(Rel("stylesheet"), Href("styles.css")),
                    Script(Src("lunch.js")),
                    Script(Src("studyhall.js")),
                    Meta(Name("og:title"), Content("Locate Reborn")),
                    Meta(Name("og:description"), Content("Student Info and Schedule for {}".format(student_name))),
                    Meta(Name("theme-color"), Content("#FFD700"))
                ),
                Body(
                    H1(Text(student_name)),
                    Table(*cols, Tbody(*rows)),
                    Br(),
                    Span(Class("inline"),
                         Button(Onclick("location.href = \"https://locate-reborn.glitch.me/\""), Text("Home")),
                         Button(Onclick("window.history.back()"), Text("Back")),
                         Input(Id("lunch"), Type("checkbox"), Name("lunch"), Onchange("toggleLunch()")),
                         Label(For("lunch"), Text("Hide lunch")),
                         Input(Id("studyhall"), Type("checkbox"), Name("studyhall"), Onchange("toggleStudyHall()")),
                         Label(For("studyhall"), Text("Hide Study Halls"))
                         )
                )
            )
        print(html.render())
    except FileNotFoundError:
        sys.stderr.write("Integral files are missing from the server!")
    return


command = sys.argv[1]

try:
    if command == "main":
        create_student_list()
    elif command == "student":
        create_course_table(sys.argv[2])
    elif command == "course":
        create_course_list(sys.argv[2])
except:
    sys.stderr.write("An unknown error occurred!")
