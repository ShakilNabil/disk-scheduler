// let inputArr = [2, 3, 4, 6, 3, 6, 7].map(Number);
// let headPos = 1;

let inputArr = [150, 180, 130, 160].map(Number);
let headPos = 100;

//console.log(calculateFCFS(inputArr, headPos));
console.log(calculateSSTF(inputArr, headPos));

function calculateFCFS(requestArr, headPos) {
     let totalSeekTime = 0;
     let currentHeadPos = headPos;
     let requestProcessed = requestArr.length;
     let stepBreakdown = [];
     for(let i = 0; i < requestArr.length; i++) {
          let calculateSeekTime = Math.abs(currentHeadPos - requestArr[i]);
          totalSeekTime += calculateSeekTime;
          stepBreakdown.push({step: i+1, from: currentHeadPos, to: requestArr[i], seekTime: calculateSeekTime, runningTotal: totalSeekTime});
          currentHeadPos = requestArr[i];     
     }

     let avgSeekTime = requestArr.length === 0 ? 0 : Math.round(totalSeekTime / requestProcessed);
     
     return {requestArr, stepBreakdown, totalSeekTime, avgSeekTime, requestProcessed, finalHead: currentHeadPos};
}

function calculateSSTF(requestArr, headPos) {
     let totalSeekTime = 0;
     let currentHeadPos = headPos;
     let requestProcessed = 0;
     let stepBreakdown = [];
     let requestArrCopy = [...requestArr];
     requestArrCopy.push(currentHeadPos);
     requestArrCopy.sort((a, b) => a - b);
     let currentHeadIndex = requestArrCopy.indexOf(headPos);
     let leftIndex = (currentHeadIndex - 1 >= 0) ? currentHeadIndex - 1 : null;
     let rightIndex = (currentHeadIndex + 1 < requestArrCopy.length) ? currentHeadIndex + 1 : null;
     while(leftIndex !== null || rightIndex !== null){
          let leftDistance = (leftIndex !== null) ? Math.abs(currentHeadPos - requestArrCopy[leftIndex]) : Infinity;
          let rightDistance = (rightIndex !== null) ? Math.abs(currentHeadPos - requestArrCopy[rightIndex]) : Infinity;
          if(rightDistance <= leftDistance) {
               currentHeadIndex = rightIndex;
               rightIndex++;
               if(rightIndex >= requestArrCopy.length) rightIndex = null;
          }
          else {
               currentHeadIndex = leftIndex;
               leftIndex--;
               if(leftIndex < 0) leftIndex = null;
          }

          let calculateSeekTime = Math.min(leftDistance, rightDistance);
          totalSeekTime += calculateSeekTime;
          stepBreakdown.push({step: requestProcessed + 1, from: currentHeadPos, to: requestArrCopy[currentHeadIndex], seekTime: calculateSeekTime, runningTotal: totalSeekTime});
          currentHeadPos = requestArrCopy[currentHeadIndex];
          requestProcessed++;

     }

     let avgSeekTime = requestArr.length === 0 ? 0 : Math.round(totalSeekTime / requestProcessed);
     
     return {requestArr, stepBreakdown, totalSeekTime, avgSeekTime, requestProcessed, finalHead: currentHeadPos};
     
}

function checkRequest(requestArr) {
     let message = "";
     for(let i = 0; i < requestArr.length; i++) {
          if(Number.isNaN(requestArr[i]) || !Number.isInteger(requestArr[i])) {
               message = "Invalid input \nonly integers are allowed";
               break;
          }
          if(requestArr[i] < 0 || requestArr[i] > 499) {
               message = "Track Length range has to be [0, 499]";
               break;
          } 
     };
     return message === "" ? {ok: true} : {ok: false, message};  
}

function checkHeadPos(headPos) {
     let message = ""
     if(headPos == null) message = "Please select starting head";
 
     else if(!Number.isInteger(headPos)) message = "Invalid input \nonly integers are allowed"; 

     else if(headPos < 0 || headPos > 499) message = "Head position range has to be [0, 499]";  

     return message === "" ? {ok: true} : {ok: false, message};
}