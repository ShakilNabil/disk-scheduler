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

const simulationForm = document.getElementById("simulation-form");

simulationForm.addEventListener("submit", (event) => {
     event.preventDefault();
     const {requestArr, headPosition, direction} = getFormValues(event.target);
     let requestMessage = checkRequest(requestArr);
     let headPosMessage = checkHeadPos(headPosition);
     if (!requestMessage.ok) {
          return window.alert(requestMessage.message);
     }
     if (!headPosMessage.ok) {
          return window.alert(headPosMessage.message);
     }
     const {requestArr: request, stepBreakdown, totalSeekTime, avgSeekTime, requestProcessed, finalHead} = calculateFCFS(requestArr, headPosition);

     const results = {
          FCFS: calculateFCFS(requestArr, headPosition),
          SSTF: calculateSSTF(requestArr, headPosition),
          SCAN: calculateSCAN(requestArr, headPosition, direction),
          "C-SCAN": calculateCSCAN(requestArr, headPosition, direction),
          LOOK: calculateLOOK(requestArr, headPosition, direction),
          "C-LOOK": calculateCLOOK(requestArr, headPosition, direction),
     };
     const parentDiv = document.getElementById("compare-result-container");

     for(const [algoName, result] of Object.entries(results)) {
          const card = document.createElement("div");
          card.classList.add("algo-result");

          card.innerHTML = `
          <h3>${algoName}</h3>
          <p>Total Seek Time: ${result.totalSeekTime}</p>
          <p>Average Seek Time: ${result.avgSeekTime}</p>
          <ul>
          ${result.stepBreakdown.map(step =>
          `<li>Step ${step.step}: Head ${step.from} → ${step.to}, Seek Time=${step.seekTime}, Running Total=${step.runningTotal}</li>`
          ).join("")}
          </ul>` 

          parentDiv.appendChild(card);
     }

});