// ---------- GLOBAL DECLARATIONS ---------->

let quizData
let questions = []
let qOneAnswers = []
let qTwoAnswers = []
let qThreeAnswers = []
let qFourAnswers = []
let qOneCorrect
let qTwoCorrect
let qThreeCorrect
let qFourCorrect

const urlParams = window.location.pathname.split("-")
const boothToTrim = urlParams[0]
const booth = boothToTrim.substring(1)
const attendee = urlParams[1]
const awarded = booth + 'producttrivia'

// ---------- FETCHES DATA FROM DATABASE ---------->  

function fetchData() {

    // Fetch data by booth id:
    return fetch(`https://us-central1-sw-booth-trivia.cloudfunctions.net/getQuizData?exhibitorId=${booth}`)
        .then(response => response.json())
        .then(function (response) {
            quizData = response
            return quizData
        })

        // Store data in global variables: 
        .then(function (quizData) {
            questions.push(quizData.qOne, quizData.qTwo, quizData.qThree, quizData.qFour)
            qOneAnswers.push(quizData.qOne_aOne, quizData.qOne_aTwo, quizData.qOne_aThree, quizData.qOne_aFour)
            qTwoAnswers.push(quizData.qTwo_aOne, quizData.qTwo_aTwo, quizData.qTwo_aThree, quizData.qTwo_aFour)
            qThreeAnswers.push(quizData.qThree_aOne, quizData.qThree_aTwo, quizData.qThree_aThree, quizData.qThree_aFour)
            qFourAnswers.push(quizData.qFour_aOne, quizData.qFour_aTwo, quizData.qFour_aThree, quizData.qFour_aFour)
            qOneCorrect = quizData.qOneCorrect
            qTwoCorrect = quizData.qTwoCorrect
            qThreeCorrect = quizData.qThreeCorrect
            qFourCorrect = quizData.qFourCorrect
        })
}

// ---------- POPULATES QUIZ ----------> 

function runQuiz() {
    
    // Declarations:

    const qNoHeader = document.getElementById('header--qNo')
    const qNoFooter = document.getElementById('footer--qNo')
    const nextQText = document.getElementById('nextQ')
    const nextArrows = document.getElementById('next')
    const qDiv = document.getElementById('question')
    const answerA = document.getElementById('answerA')
    const answerB = document.getElementById('answerB')
    const answerC = document.getElementById('answerC')
    const answerD = document.getElementById('answerD')
    let qNo = 1
    let tries = 0
    let points = 0
    
    // Renders and iterates through questions:

    qNoHeader.innerHTML = `QUESTION #${qNo}`
    const q = questions[Symbol.iterator]();
    let next = q.next();
    qDiv.innerText = next.value

    nextArrows.onclick = function () {
        qNo += 1
        clearAnswers()
        setAnswers()
        qNoHeader.innerHTML = `QUESTION #${qNo}`
        qNoFooter.innerHTML = `${qNo} of 4`
        let next = q.next();
        qDiv.innerText = next.value
        if (qNo === 4) {
            nextQText.innerText = 'Thanks for playing!'
            nextArrows.style.display = 'none'
        }
    }

    const endGame = () => {
        fetch(`https://us-central1-sw-leaderboard.cloudfunctions.net/checkPathStatusFromGame?attendee=${attendee}`)
            .then(response => response.json())
            .then(data => {
                console.log("data: " + data)
                if ( data === false ) {
                    qDiv.innerHTML = "You are not yet eligible to earn points. Visit the leaderboard to view game rules!"
                } else if (data === true) {
                    qDiv.innerHTML = `Your points have been added! Visit the leaderboard to see your new score!`
                    return fetch(`https://us-central1-sw-leaderboard.cloudfunctions.net/addPoints?points=${points}&attendee=${attendee}&awarded=${awarded}`)
                    .then(response => response.json())
                }
            })
    }  

    // Sets, clears, and renders multiple choice answers:

    const clearAnswers = () => {
        tries = 0
        const leftTabs = document.querySelectorAll('.left')
        const rightTabs = document.querySelectorAll('.right')
        const grayTabLeft = "https://eventfinity-production-assets.s3.amazonaws.com/materials/739171/original/GreyBarLeft_DropShadow.png"
        const grayTabRight = "https://eventfinity-production-assets.s3.amazonaws.com/materials/739161/original/GreyBarRight_DropShadow.png"
        leftTabs[0].style.backgroundImage = `url(${grayTabLeft})`
        leftTabs[1].style.backgroundImage = `url(${grayTabLeft})`
        rightTabs[0].style.backgroundImage = `url(${grayTabRight})`
        rightTabs[1].style.backgroundImage = `url(${grayTabRight})`
    }

    answerA.innerText = qOneAnswers[0]
    answerB.innerText = qOneAnswers[1]
    answerC.innerText = qOneAnswers[2]
    answerD.innerText = qOneAnswers[3]
    let correctAnswer = qOneCorrect

    const setAnswers = () => {
        if (qNo === 2) {
            answerA.innerText = qTwoAnswers[0]
            answerB.innerText = qTwoAnswers[1]
            answerC.innerText = qTwoAnswers[2]
            answerD.innerText = qTwoAnswers[3]
            correctAnswer = qTwoCorrect
        } else if (qNo === 3) {
            answerA.innerText = qThreeAnswers[0]
            answerB.innerText = qThreeAnswers[1]
            answerC.innerText = qThreeAnswers[2]
            answerD.innerText = qThreeAnswers[3]
            correctAnswer = qThreeCorrect
        } else if (qNo === 4) {
            answerA.innerText = qFourAnswers[0]
            answerB.innerText = qFourAnswers[1]
            answerC.innerText = qFourAnswers[2]
            answerD.innerText = qFourAnswers[3]
            correctAnswer = qFourCorrect
        }
    }

    // Checks answer, prevents multiple selection, changes tab color, adds points:

    $(".option").click(function (e) {
        tries += 1
        console.log('Tries: ' + tries)
        const greenTabLeft = "https://eventfinity-production-assets.s3.amazonaws.com/materials/739081/original/Green_CorrectBarLeft_DropShadow.png"
        const redTabLeft = "https://eventfinity-production-assets.s3.amazonaws.com/materials/739101/original/Red_WrongBarLeft_DropShadow.png"
        const greenTabRight = "https://eventfinity-production-assets.s3.amazonaws.com/materials/739091/original/Green_CorrectBarRight_DropShadow.png"
        const redTabRight = "https://eventfinity-production-assets.s3.amazonaws.com/materials/739111/original/Red_WrongBarRight_DropShadow.png"

        if (tries < 2) {
       
            let answerId = $(e.target).parent()[0].id
            let answerSide = $(e.target).parent()[0].className
            let selected = document.getElementById(answerId)
            let pointsDiv = document.getElementById("pointsDiv")

            if (answerId === correctAnswer) {
                if (answerSide === "left") {
                    selected.style.backgroundImage = `url(${greenTabLeft})`
                    pointsDiv.innerHTML = points += 10
                } else if (answerSide === "right") {
                    selected.style.backgroundImage = `url(${greenTabRight})`
                    pointsDiv.innerHTML = points += 10
                }
            } else if (answerId !== correctAnswer) {
                if (answerSide === "left") {
                    selected.style.backgroundImage = `url(${redTabLeft})`
                } else if (answerSide === "right") {
                    selected.style.backgroundImage = `url(${redTabRight})`
                }
            }
            console.log('Points: ' + points)
        }

        if (qNo === 4) {
            endGame()
        }
    })
}

// ---------- WAITS FOR DATA TO STORE BEFORE LOADING QUIZ ----------> 

fetchData().then(runQuiz)