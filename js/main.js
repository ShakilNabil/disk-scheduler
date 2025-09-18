import { getFormValues } from "./formUtils.js";
import { 
     calculateFCFS,
     calculateSSTF,
     calculateSCAN,
     calculateCSCAN,
     calculateLOOK,
     calculateCLOOK,
     checkRequest,
     checkHeadPos
} from "./algorithms.js";
const algorithmOption = document.getElementsByClassName("algorithm-options");

const currentAlgorithmDisplay= document.getElementById("current-algorithm-display");

const moreInfoBtn = document.getElementById("more-info-btn");

let currentAlgorithm = "FCFS"; 

const simulationForm = document.getElementById("simulation-form"); 

const directionWrapper = document.getElementById("direction-wrapper");

const parentDiv = document.getElementById("simulate-result-container");

for (const element of algorithmOption) {
     element.addEventListener("click", () => {
          parentDiv.replaceChildren();
          for (const e of algorithmOption) {
               e.classList.remove("current-algorithm");     
          }
          element.classList.add("current-algorithm");
          currentAlgorithm = element.dataset.algorithm;
          currentAlgorithm === "FCFS" || currentAlgorithm === "SSTF" ?
          directionWrapper.classList.add("hidden") :   directionWrapper.classList.remove("hidden");
          
          document.getElementById("request-sequence").value = "";
          document.getElementById("head-position").value = "";
          document.getElementById("request-direction").value = "Right";
     
          updateAlgorithmDisplay(element.dataset.algorithm);    
     })   
}
updateAlgorithmDisplay("FCFS");
function updateAlgorithmDisplay(element){
     const algoTitle = currentAlgorithmDisplay.querySelector("h3");
     const displayDescriptions = {
          FCFS: ": First-Come-First-Served",
          SSTF: ": Shortest Seek Time First",
          SCAN: ": Scan",
          "C-SCAN": ": Circular Scan",
          LOOK: ": Look",
          "C-LOOK": ": Circular Look",
     };

     algoTitle.innerHTML = `${element}${displayDescriptions[element] || ""}`; 
     
     moreInfoBtn.innerHTML = `Learn About ${element}`;
}

simulationForm.addEventListener("submit", (event) => {
     event.preventDefault();
     const {requestArr, headPosition, direction} = getFormValues(event.target)
     let requestMessage = checkRequest(requestArr);
     let headPosMessage = checkHeadPos(headPosition);
     if (!requestMessage.ok) {
          return window.alert(requestMessage.message);
     }
     if (!headPosMessage.ok) {
          return window.alert(headPosMessage.message);
     }
     const algorithms = {
          "FCFS": calculateFCFS,
          "SSTF": calculateSSTF,
          "SCAN": calculateSCAN,
          "C-SCAN": calculateCSCAN,
          "LOOK": calculateLOOK,
          "C-LOOK": calculateCLOOK,
     };
     const result = currentAlgorithm === "FCFS" || currentAlgorithm === "SSTF" ?    
          algorithms[currentAlgorithm](requestArr, headPosition) : algorithms[currentAlgorithm](requestArr, headPosition, direction);

     const card = document.createElement("div");
     card.id = "algo-result";
     card.innerHTML = `
          <h3>${currentAlgorithm}</h3>
          <p>Total Seek Time: ${result.totalSeekTime}</p>
          <p>Average Seek Time: ${result.avgSeekTime}</p>
          <ul>
          ${result.stepBreakdown.map(step =>
          `<li>Step ${step.step}: Head ${step.from} → ${step.to}, Seek Time=${step.seekTime}, Running Total=${step.runningTotal}</li>`
          ).join("")}
          </ul>`
     
     parentDiv.appendChild(card);
     
});

