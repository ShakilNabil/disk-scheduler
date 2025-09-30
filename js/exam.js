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
     const examConfig = {algorithms: null, totalQuestionCount: null, timeLimit: null, algorithmProbability: {}};
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
     examConfig.algorithms = algorithmList;
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

     createExam(examConfig, algorithmList.length);
});



// ================== Exam ==================

function createExam(examConfig, startWeight) {
     let totalWeight = startWeight; 
     examConfig.questions = [] 
     for(let i = 0; i < examConfig.totalQuestionCount; i++) {
          let chosenAlgorithm = null;
          let rangeStart = 0;
          let randomValue = Math.random();
          for(const [key, value] of Object.entries(examConfig.algorithmProbability)) {
               if(randomValue >= value.range.start && randomValue < value.range.end) {
                    value.count++;
                    totalWeight -= value.weight;
                    value.weight = 1/(value.count + 1);
                    totalWeight += value.weight;
                    chosenAlgorithm = key; 
                    break;            
               }
          }
          
          for(const [key, value] of Object.entries(examConfig.algorithmProbability)) {
               value.probability = value.weight / totalWeight;
               value.range.start = rangeStart;
               value.range.end = rangeStart + value.probability;
               rangeStart = value.range.end;           
          }
          examConfig.questions.push({number: i + 1, algo: chosenAlgorithm});
     }
     console.log(examConfig.questions);
     renderExam(examConfig);     
}

function renderExam(examConfig) {
     examSetupContainer.classList.add("hidden");
     examLayoutContainer.classList.remove("hidden");
     const questionDiv = document.createElement("div");
     const questionTitle = document.getElementById("question-title");
     questionDiv.id = "side-display-questions-section"
     let btnsHTML = "";
     for (let i = 1; i <= examConfig.totalQuestionCount; i++) {
          i === 1 ? btnsHTML += `<button type="button" class="question-btn current" data-question="${i}">${i}</button>` : btnsHTML += `<button type="button" class="question-btn" data-question="${i}">${i}</button>`;      
     }
     questionDiv.innerHTML = btnsHTML;
     questionTitle.insertAdjacentElement("afterend", questionDiv);
     const questionBtn = document.querySelectorAll(".question-btn");
     for(const btn of questionBtn) {
          btn.addEventListener("click", () => {
               for(const button of questionBtn) {
                    button.classList.remove("current");
               }
               btn.classList.add("current");
               
          })
     }

}

