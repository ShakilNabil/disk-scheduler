// ================== Preferences ==================

const examLayoutContainer = document.getElementById("exam-layout");
const resultsContainer = document.getElementById("results-container");
const questionRandomizedInput = document.getElementById("question-randomize");
const algorithmTypes = document.getElementById("algorithm-types-section");
const algorithmOptions = document.getElementsByName("algorithms");
const toggleBtn = document.querySelectorAll(".toggle-btn");
const examSettingsForm = document.getElementById("exam-settings-form");

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
     if(questionRandomizedInput.checked) {
          for (const algorithmOption of algorithmOptions) {
                    algorithmOption.checked = true;
               }     
     }     
});



