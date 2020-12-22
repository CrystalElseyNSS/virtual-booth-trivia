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

// Get quiz data by exhibitor id:

const exhibitorId = window.location.pathname.split("/").pop()

const getQuizData = (id) => {
    $.post(`https://us-central1-sw-booth-trivia.cloudfunctions.net/getQuizData?exhibitorId=${id}`, function (data, status) {
        console.log("new deploy")
        console.log(status)
        const questions = [data.qOne, data.qTwo, data.qThree, data.qFour]
        const qOneAnswers = [data.qOne_aOne, data.qOne_aTwo, data.qOne_aThree, data.qOne_aFour]
        const qOneCorrect = data.qOneCorrect
        console.log(questions)
        console.log(qOneAnswers)
        console.log(qOneCorrect)
    })
}

document.onload = getQuizData(exhibitorId)

// Renders and iterates through questions:

// const questions = [
//     'Q1 80 character question on both lines 1 and 2, includes spaces and punctuation?',
//     'Q2 80 character question on both lines 1 and 2, includes spaces and punctuation?',
//     'Q3 80 character question on both lines 1 and 2, includes spaces and punctuation?',
//     'Q4 80 character question on both lines 1 and 2, includes spaces and punctuation?'
// ]

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
    console.log(next)
    qDiv.innerText = next.value
    if (qNo === 4) {
        nextQText.innerText = 'Thanks for playing!'
        nextArrows.style.display = 'none'
    }
}

// Sets, clears, and renders multiple choice answers:

const clearAnswers = () => {
    tries = 0
    const leftTabs = document.querySelectorAll('.answer--left')
    const rightTabs = document.querySelectorAll('.answer--right')
    const grayTabLeft = "https://eventfinity-production-assets.s3.amazonaws.com/materials/739171/original/GreyBarLeft_DropShadow.png"
    const grayTabRight = "https://eventfinity-production-assets.s3.amazonaws.com/materials/739161/original/GreyBarRight_DropShadow.png"
    leftTabs[0].style.backgroundImage = `url(${grayTabLeft})`
    leftTabs[1].style.backgroundImage = `url(${grayTabLeft})`
    rightTabs[0].style.backgroundImage = `url(${grayTabRight})`
    rightTabs[1].style.backgroundImage = `url(${grayTabRight})`
}

// const qOneAnswers = [
//     'qOneAnswer',
//     'Wrong Answer',
//     'Wrong Answer',
//     'Wrong Answer'
// ]

const qTwoAnswers = [
    'qTwoAnswer',
    'Wrong Answer',
    'Wrong Answer',
    'Wrong Answer'
]

const qThreeAnswers = [
    'qThreeAnswer',
    'Wrong Answer',
    'Wrong Answer',
    'Wrong Answer'
]

const qFourAnswers = [
    'qFourAnswer',
    'Wrong Answer',
    'Wrong Answer',
    'Wrong Answer'
]

answerA.innerText = qOneAnswers[0]
answerB.innerText = qOneAnswers[1]
answerC.innerText = qOneAnswers[2]
answerD.innerText = qOneAnswers[3]

const setAnswers = () => {
    if (qNo === 2) {
        answerA.innerText = qTwoAnswers[0]
        answerB.innerText = qTwoAnswers[1]
        answerC.innerText = qTwoAnswers[2]
        answerD.innerText = qTwoAnswers[3]
    } else if (qNo === 3) {
        answerA.innerText = qThreeAnswers[0]
        answerB.innerText = qThreeAnswers[1]
        answerC.innerText = qThreeAnswers[2]
        answerD.innerText = qThreeAnswers[3]
    } else if (qNo === 4) {
        answerA.innerText = qFourAnswers[0]
        answerB.innerText = qFourAnswers[1]
        answerC.innerText = qFourAnswers[2]
        answerD.innerText = qFourAnswers[3]
    }
}

// Checks answer, prevents multiple selection, changes tab color, adds points:

$(".answer--option").click(function (e) {
    tries += 1
    console.log('Tries: ' + tries)
    const greenTabLeft = "https://eventfinity-production-assets.s3.amazonaws.com/materials/739081/original/Green_CorrectBarLeft_DropShadow.png"
    const redTabLeft = "https://eventfinity-production-assets.s3.amazonaws.com/materials/739101/original/Red_WrongBarLeft_DropShadow.png"
    const greenTabRight = "https://eventfinity-production-assets.s3.amazonaws.com/materials/739091/original/Green_CorrectBarRight_DropShadow.png"
    const redTabRight = "https://eventfinity-production-assets.s3.amazonaws.com/materials/739111/original/Red_WrongBarRight_DropShadow.png"

    if (tries < 2) {
        let result = e.target.dataset.result
        let answerId = $(e.target).parent()[0].id
        let selected = document.getElementById(answerId)
        let pointsDiv = document.getElementById("pointsDiv")

        if (answerId === "optionA" || answerId === "optionC") {
            if (result === "right") {
                selected.style.backgroundImage = `url(${greenTabLeft})`
                pointsDiv.innerHTML = points += 10
            } else if (result === "wrong") {
                let answerId = $(e.target).parent()[0].id
                let selected = document.getElementById(answerId)
                selected.style.backgroundImage = `url(${redTabLeft})`
            }
        } else if (answerId === "optionB" || answerId === "optionD") {
            if (result === "right") {
                selected.style.backgroundImage = `url(${greenTabRight})`
                pointsDiv.innerHTML = points = + 10
            } else if (result === "wrong") {
                let answerId = $(e.target).parent()[0].id
                let selected = document.getElementById(answerId)
                selected.style.backgroundImage = `url(${redTabRight})`
            }
        }
        console.log('Points: ' + points)
    }
})