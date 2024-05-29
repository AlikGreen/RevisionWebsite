const setInputElement = document.getElementById("set-input");
const wordTextElement = document.getElementById("word-text");
const wordInputElement = document.getElementById("word-input");
const submitButtonElement = document.getElementById("submit-btn");
const nextButtonElement = document.getElementById("next-btn");
const correctTextElement = document.getElementById("correct-text");
const scoreTextElement = document.getElementById("score-text");

const sets =
[
    "VocabSets/spanish 0-280.json",
    "VocabSets/spanish 280-560.json",
    "VocabSets/spanish 560-840.json",
    "VocabSets/spanish 840-1120.json",
    "VocabSets/spanish vocab.json",
    "VocabSets/french vocab.json",
]

document.addEventListener("DOMContentLoaded", () =>
{
    sets.forEach((setPath) =>
    {
        const setElement = document.createElement("option");
        setElement.value = setPath;
        setElement.innerText = GetFileName(setPath);

        setInputElement.appendChild(setElement);
    });
    LoadSet(setInputElement.value);
});

var wordsSet;

setInputElement.addEventListener("change", (event) =>
{
    LoadSet(event.target.value)
    score = 0;
    answered = 0;
    index = 0;
});
nextButtonElement.addEventListener("click", NextWord);
submitButtonElement.addEventListener("click", CheckAnswer);


function LoadSet(filename) 
{
    // Construct the path to the JSON file
    const filePath = filename;

    // Create a new XMLHttpRequest object
    const xhr = new XMLHttpRequest();

    // Configure the request to get the file contents
    xhr.open("GET", filePath, true);

    // Set the responseType to "text"
    xhr.responseType = "text";

    // Define the onload event handler
    xhr.onload = function() {
        if (xhr.status === 200) 
        {
            // File contents retrieved successfully
            let jsonData = JSON.parse(xhr.responseText);
            console.log(jsonData); // Output the parsed JSON data
            // Do something with the data (e.g., assign it to a global variable)
            wordsSet = ShuffleArray(jsonData);
        } else 
        {
            // Error handling if the file retrieval fails
            console.error("Failed to load JSON file:", xhr.statusText);
        }
    };

    // Define the onerror event handler
    xhr.onerror = function() {
        console.error("Network error occurred while trying to load JSON file:", xhr.statusText);
    };

    // Send the request
    xhr.send();
}


var currentWord;
var isSpanishToEnglish;

var index = 0;

function NextWord()
{
    currentWord = wordsSet[index];
    
    isSpanishToEnglish = RandomChoice([true, false])
    if(isSpanishToEnglish)
    {
        wordTextElement.textContent = RandomChoice(currentWord['spanishwords']);
    }
    else
    {
        wordTextElement.textContent = RandomChoice(currentWord['englishwords']);
    }
    wordInputElement.value = "";
    correctTextElement.innerText = "";

    index++;
}

var score = 0;
var answered = 0;

function CheckAnswer() 
{
    const answer = wordInputElement.value;
    let userAnswer = ConvertToAscii(answer.trim().toLowerCase());
    let correctAnswers;
    if (isSpanishToEnglish) 
    {
        correctAnswers = currentWord.englishwords.map(word => ConvertToAscii(word.toLowerCase()));
    } else 
    {
        correctAnswers = currentWord.spanishwords.map(word => ConvertToAscii(word.toLowerCase()));
    }
  
    let isCorrect = false;
    
    correctAnswers.forEach((ans) =>
    {
        if(EditDistance(userAnswer, ans) <= 1)
        {
            isCorrect = true;
        }
    });

    if (!isCorrect && userAnswer.length > 3) 
    {
        for (const ans of correctAnswers) 
        {
            if (userAnswer.includes(ans)) 
            {
              isCorrect = true;
              break;
            }
        }
    }
  
    let correctAnswersStr = correctAnswers.join(', ');
    if (isCorrect) 
    {
        correctTextElement.innerText = `Correct! Correct answer(s): ${correctAnswersStr}`;
        correctTextElement.style.color = 'rgb(0, 175, 0)';
        score++;
    } else 
    {
        correctTextElement.innerText = `Incorrect! Correct answer(s): ${correctAnswersStr}`;
        correctTextElement.style.color = 'rgb(175, 0, 0)';
    }
  
    answered++;
    scoreTextElement.innerText = `Score: ${score}/${answered}`;
}
  

function EditDistance(str1, str2) 
{
    // Create a 2D array to store the distances
    const dp = [];
    for (let i = 0; i <= str1.length; i++) {
        dp[i] = [];
        for (let j = 0; j <= str2.length; j++) {
            if (i === 0) {
                dp[i][j] = j;
            } else if (j === 0) {
                dp[i][j] = i;
            } else {
                dp[i][j] = 0;
            }
        }
    }

    // Fill in the array using the Levenshtein distance algorithm
    for (let i = 1; i <= str1.length; i++) {
        for (let j = 1; j <= str2.length; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.min(
                    dp[i - 1][j - 1], // substitution
                    dp[i][j - 1],     // insertion
                    dp[i - 1][j]      // deletion
                ) + 1;
            }
        }
    }

    // Return the Levenshtein distance between the two strings
    return dp[str1.length][str2.length];
}
  

function GetFileName(path)
{
    const fileNameWithExtension = path.split("/").pop(); // "first 100.json"
    const fileNameWithoutExtension = fileNameWithExtension.split(".")[0]; // "first 100"

    return fileNameWithoutExtension;
}

function RandomChoice(choices) 
{
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

function ConvertToAscii(inputString) 
{
    // Normalize the string to remove accents
    const normalizedString = inputString.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    // Convert the normalized string to ASCII
    const asciiString = normalizedString.replace(/[^\x00-\x7F]/g, function(character) {
        return character.charCodeAt(0);
    });
    return asciiString;
}

function ShuffleArray(array) 
{
    for (var i = array.length - 1; i > 0; i--) 
    {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}