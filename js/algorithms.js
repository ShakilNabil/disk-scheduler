let inputArr = [2, 3, 4, 6, 3, 6, 7].map(Number);
let headPos = 1;

console.log(calculateFCFS(inputArr, headPos));

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
     requestArr.push(currentHeadPos);
     requestArr.sort((a, b) => a - b);
     let currentHeadIndex = requestArr.indexOf(headPos);
     while(requestProcessed < requestArr.length - 1){
          let leftIndex = null;
          let rightIndex = null;
          let leftDistance = 0;
          let rightDistance = 0;
          if(currentHeadIndex === 0){
               leftDistance = Infinity;
               rightIndex = currentHeadIndex + 1;     
          }
          else if(currentHeadIndex === requestArr.length - 1) {
               rightDistance = Infinity;
               leftIndex = currentHeadIndex - 1;
          }
          else{
               leftIndex = currentHeadIndex - 1;
               rightIndex = currentHeadIndex + 1;
          }
          if(leftIndex === null || rightIndex === null) {
               if(leftIndex === null && rightIndex < requestArr.length) {
                    rightDistance = Math.abs(requestArr[currentHeadIndex] - requestArr[rightIndex]);     
               } 
               else if(rightIndex === null && leftIndex >=  0) {
                    leftDistance = Math.abs(requestArr[currentHeadIndex] - requestArr[leftIndex]);
               }
               if(rightDistance <= leftDistance) {
                    currentHeadIndex = rightIndex;
                    
               }

          }

               
     }     
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