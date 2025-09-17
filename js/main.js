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

for (const element of algorithmOption) {
     element.addEventListener("click", () => {
          for (const e of algorithmOption) {
               e.classList.remove("current-algorithm");     
          }
          element.classList.add("current-algorithm");
          currentAlgorithm = element.dataset.algorithm;
          currentAlgorithm === "FCFS" || currentAlgorithm === "SSTF" ?
          directionWrapper.classList.add("hidden") :   directionWrapper.classList.remove("hidden");
          
     
          updateAlgorithmDisplay(element.dataset.algorithm);    
     })   
}
updateAlgorithmDisplay("FCFS");
function updateAlgorithmDisplay(element){
     let displayNameInfo = "";
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
     currentAlgorithm === "FCFS" || currentAlgorithm === "SSTF" ?    
          console.log(algorithms[currentAlgorithm](requestArr, headPosition)) :          console.log(algorithms[currentAlgorithm](requestArr, headPosition, direction));
     
});

