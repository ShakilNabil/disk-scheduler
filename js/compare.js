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
     const newDiv = document.createElement("div");
     newDiv.id = "compare-result-container";
      
     console.log(stepBreakdown);
});