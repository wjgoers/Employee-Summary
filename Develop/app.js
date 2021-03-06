const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const teamArray = []
const teamId = []

function askQuestions() {
    inquirer
        .prompt([{
                type: "input",
                message: "What is your name?",
                name: "name",
            },
            {
                type: "number",
                message: "What is your ID?",
                name: "id",
            }, {
                type: "input",
                message: "What is your email address?",
                name: "email",
            },
            {
                type: "list",
                message: "What is your role?",
                name: "role",
                choices: ["Engineer", "Intern", "Manager"]
            }
        ])
        .then(
            function(answer) {
                switch (answer.role) {
                    case "Engineer":
                        inquirer
                            .prompt({
                                type: "input",
                                message: "What is your GitHub username?",
                                name: "github"
                            }).then(
                                function(engineerAnswer) {
                                   const engineer = new Engineer(answer.name, answer.id, answer.email, engineerAnswer.github)
                                   teamArray.push(engineer)
                                   teamId.push(answer.id)
                                    addOtherMembers(teamArray)
                                }
                            )
                        break
                    case "Intern":
                        inquirer
                            .prompt({
                                type: "input",
                                message: "What school do you attend?",
                                name: "school"
                            }).then(
                                function(internAnswer) {
                                    const intern = new Intern(answer.name, answer.id, answer.email, internAnswer.school)
                                    teamArray.push(intern)
                                    teamId.push(answer.id)
                                    addOtherMembers(teamArray)
                                }
                            )
                        break
                    case "Manager":
                        inquirer
                            .prompt({
                                type: "input",
                                message: "What is your Office Number?",
                                name: "officeNumber"
                            }).then(
                                function(managerAnswer) {
                                    const manager = new Manager(answer.name, answer.id, answer.email, managerAnswer.officeNumber)
                                    teamArray.push(manager)
                                    teamId.push(answer.id)
                                    console.log(teamArray)
                                    addOtherMembers(teamArray)
                                }
                            )
                        break
                }
            })
}


function addOtherMembers(teamArray) {
    inquirer.prompt({
            type: "confirm",
            message: "Add other Team Members?",
            name: "addOtherMembers"
        }).then(
            function({ addOtherMembers }) {
                console.log("add other members", addOtherMembers, teamArray)
                if (addOtherMembers) {
                    askQuestions()
                } else {
                    renderHTML(teamArray)
                }
            }
        )
        .catch(err => {
            console.log("Error adding other members", err)
            throw err
        })
}
function renderHTML(teamArray){
    fs.writeFileSync(outputPath, render(teamArray), function(error){
        if(error){
            console.log(error)
        }
        else{
            console.log('success')
        }
    })

}

askQuestions()


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated div for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
