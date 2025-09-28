// ================== Preferences ==================

const examLayoutContainer = document.getElementById("exam-layout");
const resultsContainer = document.getElementById("results-container");
const examSetupContainer = document.getElementById("exam-setup");
const questionRandomizedInput = document.getElementById("question-randomize");
const algorithmTypes = document.getElementById("algorithm-types-section");
const algorithmOptions = document.getElementsByName("algorithms");
const toggleBtn = document.querySelectorAll(".toggle-btn");
const examSettingsForm = document.getElementById("exam-settings-form");
const typeWarning = document.getElementById("type-warning");

examLayoutContainer.classList.add("hidden");
resultsContainer.classList.add("hidden");

questionRandomizedInput.checked ? algorithmTypes.classList.add("hidden") : algorithmTypes.classList.remove("hidden");

questionRandomizedInput.addEventListener("change", () => {
     questionRandomizedInput.checked ? algorithmTypes.classList.add("hidden") : algorithmTypes.classList.remove("hidden");
});

toggleBtn.forEach(btn => {
     btn.addEventListener("click", () => {
          if(btn.dataset.action === "select-all") {
               for (const algorithmOption of algorithmOptions) {
                    algorithmOption.checked = true;
               }
          }
          else if(btn.dataset.action === "clear-all") {
               for(const algorithmOption of algorithmOptions) {
                    algorithmOption.checked = false;
               }
          }
     });
});


examSettingsForm.addEventListener("submit", (event) => {
     event.preventDefault();
     typeWarning.classList.add("hidden");
     const examConfig = {algorithm: null, totalQuestionCount: null, timeLimit: null, algorithmProbability: {}};
     let algorithmList = []
     if(questionRandomizedInput.checked) {
          for (const algorithmOption of algorithmOptions) {
                    algorithmOption.checked = true;
                    algorithmList.push(algorithmOption.value);
               }     
     }
     else if(!questionRandomizedInput.checked){
          const anyChecked = [...algorithmOptions].some(option => option.checked);
          if(!anyChecked) {
               typeWarning.classList.remove("hidden");
               return;
          } 
          algorithmList = ([...algorithmOptions].filter(option => option.checked).map(option => option.value));
     }
     const numOfQuestionList = document.getElementsByName("number-of-questions");
     const timeLimitList = document.getElementsByName("time-limit");
     examConfig.algorithm = algorithmList;
     examConfig.totalQuestionCount = Number([...numOfQuestionList].find(option => option.checked).value);
     const chosenTimeLimit = [...timeLimitList].find(option => option.checked).value;
     chosenTimeLimit == "null" ? examConfig.timeLimit = null : examConfig.timeLimit = Number(chosenTimeLimit); 

     let currentStart = 0;
     const baseProbability = 1/algorithmList.length;
     for(const algorithm of algorithmList) {
          examConfig.algorithmProbability[algorithm] = {count: 0, weight: 1, probability: baseProbability, range: {start: currentStart, end: currentStart + baseProbability}
          }
          currentStart += baseProbability;
     }

     createExam(examConfig);
});



// ================== Exam ==================

function createExam(examConfig) {
     // create questions inside examConfig with number and algorithm. use loop to create numbers and create the randomize algorithm in order to randomly pick a question.
     renderExam(examConfig);     
}

function renderExam(examConfig) {
     examSetupContainer.classList.add("hidden");
     examLayoutContainer.classList.remove("hidden");
}

