


export function calculateFCFS(requestArr, headPos) {
     let totalSeekTime = 0;
     let currentHeadPos = headPos;
     let requestProcessed = 0;
     let stepBreakdown = [];
     for(let i = 0; i < requestArr.length; i++) {
          let calculateSeekTime = Math.abs(currentHeadPos - requestArr[i]);
          totalSeekTime += calculateSeekTime;
          stepBreakdown.push({step: requestProcessed + 1, from: currentHeadPos, to: requestArr[i], seekTime: calculateSeekTime, runningTotal: totalSeekTime});
          currentHeadPos = requestArr[i]; 
          requestProcessed++;    
     }

     let avgSeekTime = requestArr.length === 0 ? 0 : Math.round(totalSeekTime / requestProcessed);
     
     return {requestArr, stepBreakdown, totalSeekTime, avgSeekTime, requestProcessed, finalHead: currentHeadPos};
}

export function calculateSSTF(requestArr, headPos) {
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

export function calculateSCAN(requestArr, headPos, headDirection) {
     let totalSeekTime = 0;
     let currentHeadPos = headPos;
     let requestProcessed = 0;
     let step = 0;
     let stepBreakdown = [];
     if(requestArr.length === 0) {
          let avgSeekTime = 0;
          return {requestArr, stepBreakdown, totalSeekTime, avgSeekTime, requestProcessed, finalHead: currentHeadPos};
     }
     let requestArrCopy = [...requestArr];
     requestArrCopy.push(headPos);
     requestArrCopy.sort((a, b) => a - b);
     let headPosIndex = requestArrCopy.indexOf(headPos);
     let addedEdge = false
     if(headPosIndex !== 0 && requestArrCopy[requestArrCopy.length - 1] !== 499 && headDirection === "Right") {
          requestArrCopy.push(499);
          addedEdge = true;
     }
     else if(headPosIndex !== requestArrCopy.length - 1 && requestArrCopy[0] !== 0 && headDirection === "Left") {
          requestArrCopy.unshift(0);
          headPosIndex++;
          addedEdge = true;
     }
     if(headDirection === "Right") {
          for(let i = headPosIndex + 1; i < requestArrCopy.length; i++){
               let calculateSeekTime = Math.abs(currentHeadPos - requestArrCopy[i])
               totalSeekTime += calculateSeekTime;
               step++;
               stepBreakdown.push({step: step, from: currentHeadPos, to: requestArrCopy[i], seekTime: calculateSeekTime, runningTotal: totalSeekTime});
               currentHeadPos = requestArrCopy[i];
               if(addedEdge && i === requestArrCopy.length - 1) continue;     
               requestProcessed++;     
          }

          for(let i = headPosIndex - 1; i >= 0; i--){
               let calculateSeekTime = Math.abs(currentHeadPos - requestArrCopy[i])
               totalSeekTime += calculateSeekTime;
               step++;
               stepBreakdown.push({step: step, from: currentHeadPos, to: requestArrCopy[i], seekTime: calculateSeekTime, runningTotal: totalSeekTime});
               currentHeadPos = requestArrCopy[i];
               requestProcessed++;     
          } 

     }
     else if(headDirection === "Left") {
          for(let i = headPosIndex + 1; i < requestArrCopy.length; i++){
               if(requestArrCopy[i] !== headPos){
                    headPosIndex = --i;
                    break;
               } 
          }
          for(let i = headPosIndex - 1; i >= 0; i--){
               let calculateSeekTime = Math.abs(currentHeadPos - requestArrCopy[i])
               totalSeekTime += calculateSeekTime;
               step++
               stepBreakdown.push({step: step, from: currentHeadPos, to: requestArrCopy[i], seekTime: calculateSeekTime, runningTotal: totalSeekTime});
               currentHeadPos = requestArrCopy[i];
               if(addedEdge && i === 0) continue;
               requestProcessed++;     
          }
          
          for(let i = headPosIndex + 1; i < requestArrCopy.length; i++){
               let calculateSeekTime = Math.abs(currentHeadPos - requestArrCopy[i])
               totalSeekTime += calculateSeekTime;
               step++;
               stepBreakdown.push({step: step, from: currentHeadPos, to: requestArrCopy[i], seekTime: calculateSeekTime, runningTotal: totalSeekTime});
               currentHeadPos = requestArrCopy[i];
               requestProcessed++;     
          }
     }

     let avgSeekTime = requestArr.length === 0 ? 0 : Math.round(totalSeekTime / requestProcessed);
     return {requestArr, stepBreakdown, totalSeekTime, avgSeekTime, requestProcessed, finalHead: currentHeadPos};
}


export function calculateCSCAN(requestArr, headPos, headDirection) {
     let totalSeekTime = 0;
     let currentHeadPos = headPos;
     let requestProcessed = 0;
     let step = 0;
     let stepBreakdown = [];
     if(requestArr.length === 0) {
          let avgSeekTime = 0;
          return {requestArr, stepBreakdown, totalSeekTime, avgSeekTime, requestProcessed, finalHead: currentHeadPos};
     }
     let requestArrCopy = [...requestArr];
     requestArrCopy.push(headPos);
     requestArrCopy.sort((a, b) => a - b);
     let headPosIndex = requestArrCopy.indexOf(headPos);
     let addedEdge = false
     if(headPosIndex !== 0 && requestArrCopy[requestArrCopy.length - 1] !== 499 && headDirection === "Right") {
          requestArrCopy.push(499);
          addedEdge = true;
     }
     else if(headPosIndex !== requestArrCopy.length - 1 && requestArrCopy[0] !== 0 && headDirection === "Left") {
          requestArrCopy.unshift(0);
          headPosIndex++;
          addedEdge = true;
     }
     if(headDirection === "Right") {
          for(let i = headPosIndex + 1; i < requestArrCopy.length; i++){
               let calculateSeekTime = Math.abs(currentHeadPos - requestArrCopy[i])
               totalSeekTime += calculateSeekTime;
               step++;
               stepBreakdown.push({step: step, from: currentHeadPos, to: requestArrCopy[i], seekTime: calculateSeekTime, runningTotal: totalSeekTime});
               currentHeadPos = requestArrCopy[i];
               if(addedEdge && i === requestArrCopy.length - 1) continue;     
               requestProcessed++;     
          }
          
          for(let i = 0; i < headPosIndex; i++){
          
               let calculateSeekTime;
               if(i === 0 && requestArrCopy[0] === 0) {
                    currentHeadPos = requestArrCopy[0];
               }
               else if(i === 0 && requestArrCopy[0] !== 0){
                    currentHeadPos = 0;
                    calculateSeekTime = Math.abs(currentHeadPos - requestArrCopy[i]);
                    
               }
               else{
                    calculateSeekTime = Math.abs(currentHeadPos - requestArrCopy[i]);  
               }
               
               totalSeekTime += calculateSeekTime;
               step++;
               stepBreakdown.push({step: step, from: currentHeadPos, to: requestArrCopy[i], seekTime: calculateSeekTime, runningTotal: totalSeekTime});
               currentHeadPos = requestArrCopy[i];
               requestProcessed++;     
          } 

     }
     else if(headDirection === "Left") {
          for(let i = headPosIndex + 1; i < requestArrCopy.length; i++){
               if(requestArrCopy[i] !== headPos){
                    headPosIndex = --i;
                    break;
               } 
          }
          for(let i = headPosIndex - 1; i >= 0; i--){
               let calculateSeekTime = Math.abs(currentHeadPos - requestArrCopy[i])
               totalSeekTime += calculateSeekTime;
               step++
               stepBreakdown.push({step: step, from: currentHeadPos, to: requestArrCopy[i], seekTime: calculateSeekTime, runningTotal: totalSeekTime});
               currentHeadPos = requestArrCopy[i];
               if(addedEdge && i === 0) continue;
               requestProcessed++;     
          }
          
          for(let i = requestArrCopy.length - 1; i > headPosIndex; i--){
               let calculateSeekTime;
               if(i === requestArrCopy.length - 1 && requestArrCopy[requestArrCopy.length - 1] === 499) {
                    currentHeadPos = requestArrCopy[requestArrCopy.length - 1];
               }
               else if(i === requestArrCopy.length - 1 && requestArrCopy[requestArrCopy.length - 1] !== 499){
                    currentHeadPos = 499;
                    calculateSeekTime = Math.abs(currentHeadPos - requestArrCopy[i]);
                    
               }
               else{
                    calculateSeekTime = Math.abs(currentHeadPos - requestArrCopy[i]);  
               }
               totalSeekTime += calculateSeekTime;
               step++;
               stepBreakdown.push({step: step, from: currentHeadPos, to: requestArrCopy[i], seekTime: calculateSeekTime, runningTotal: totalSeekTime});
               currentHeadPos = requestArrCopy[i];
               requestProcessed++;     
          }
     }

     let avgSeekTime = requestArr.length === 0 ? 0 : Math.round(totalSeekTime / requestProcessed);
     return {requestArr, stepBreakdown, totalSeekTime, avgSeekTime, requestProcessed, finalHead: currentHeadPos};
}


export function calculateLOOK(requestArr, headPos, headDirection) {
     let totalSeekTime = 0;
     let currentHeadPos = headPos;
     let requestProcessed = 0;
     let step = 0;
     let stepBreakdown = [];
     if(requestArr.length === 0) {
          let avgSeekTime = 0;
          return {requestArr, stepBreakdown, totalSeekTime, avgSeekTime, requestProcessed, finalHead: currentHeadPos};
     }
     let requestArrCopy = [...requestArr];
     requestArrCopy.push(headPos);
     requestArrCopy.sort((a, b) => a - b);
     let headPosIndex = requestArrCopy.indexOf(headPos);
     if(headDirection === "Right") {
          for(let i = headPosIndex + 1; i < requestArrCopy.length; i++){
               let calculateSeekTime = Math.abs(currentHeadPos - requestArrCopy[i])
               totalSeekTime += calculateSeekTime;
               step++;
               stepBreakdown.push({step: step, from: currentHeadPos, to: requestArrCopy[i], seekTime: calculateSeekTime, runningTotal: totalSeekTime});
               currentHeadPos = requestArrCopy[i];    
               requestProcessed++;     
          }

          for(let i = headPosIndex - 1; i >= 0; i--){
               let calculateSeekTime = Math.abs(currentHeadPos - requestArrCopy[i])
               totalSeekTime += calculateSeekTime;
               step++;
               stepBreakdown.push({step: step, from: currentHeadPos, to: requestArrCopy[i], seekTime: calculateSeekTime, runningTotal: totalSeekTime});
               currentHeadPos = requestArrCopy[i];
               requestProcessed++;     
          } 

     }
     else if(headDirection === "Left") {
          for(let i = headPosIndex + 1; i < requestArrCopy.length; i++){
               if(requestArrCopy[i] !== headPos){
                    headPosIndex = --i;
                    break;
               } 
          }
          for(let i = headPosIndex - 1; i >= 0; i--){
               let calculateSeekTime = Math.abs(currentHeadPos - requestArrCopy[i])
               totalSeekTime += calculateSeekTime;
               step++
               stepBreakdown.push({step: step, from: currentHeadPos, to: requestArrCopy[i], seekTime: calculateSeekTime, runningTotal: totalSeekTime});
               currentHeadPos = requestArrCopy[i];
               requestProcessed++;     
          }
          
          for(let i = headPosIndex + 1; i < requestArrCopy.length; i++){
               let calculateSeekTime = Math.abs(currentHeadPos - requestArrCopy[i])
               totalSeekTime += calculateSeekTime;
               step++;
               stepBreakdown.push({step: step, from: currentHeadPos, to: requestArrCopy[i], seekTime: calculateSeekTime, runningTotal: totalSeekTime});
               currentHeadPos = requestArrCopy[i];
               requestProcessed++;     
          }
     }

     let avgSeekTime = requestArr.length === 0 ? 0 : Math.round(totalSeekTime / requestProcessed);
     return {requestArr, stepBreakdown, totalSeekTime, avgSeekTime, requestProcessed, finalHead: currentHeadPos};     
}


export function calculateCLOOK(requestArr, headPos, headDirection) {
     let totalSeekTime = 0;
     let currentHeadPos = headPos;
     let requestProcessed = 0;
     let step = 0;
     let stepBreakdown = [];
     if(requestArr.length === 0) {
          let avgSeekTime = 0;
          return {requestArr, stepBreakdown, totalSeekTime, avgSeekTime, requestProcessed, finalHead: currentHeadPos};
     }
     let requestArrCopy = [...requestArr];
     requestArrCopy.push(headPos);
     requestArrCopy.sort((a, b) => a - b);
     let headPosIndex = requestArrCopy.indexOf(headPos);
     if(headDirection === "Right") {
          for(let i = headPosIndex + 1; i < requestArrCopy.length; i++){
               let calculateSeekTime = Math.abs(currentHeadPos - requestArrCopy[i])
               totalSeekTime += calculateSeekTime;
               step++;
               stepBreakdown.push({step: step, from: currentHeadPos, to: requestArrCopy[i], seekTime: calculateSeekTime, runningTotal: totalSeekTime});
               currentHeadPos = requestArrCopy[i];    
               requestProcessed++;     
          }

          for(let i = 0; i < headPosIndex; i++){
               if(i === 0) {
                    currentHeadPos = requestArrCopy[i];
                    if(i + 1 === headPosIndex) {
                         stepBreakdown.push({step: step + 1, from: currentHeadPos, to: requestArrCopy[i], seekTime: 0, runningTotal: totalSeekTime});     
                    }
                    requestProcessed++;
                    continue;
               }
               let calculateSeekTime = Math.abs(currentHeadPos - requestArrCopy[i])
               totalSeekTime += calculateSeekTime;
               step++;
               stepBreakdown.push({step: step, from: currentHeadPos, to: requestArrCopy[i], seekTime: calculateSeekTime, runningTotal: totalSeekTime});
               currentHeadPos = requestArrCopy[i];
               requestProcessed++;     
          } 

     }
     else if(headDirection === "Left") {
          for(let i = headPosIndex + 1; i < requestArrCopy.length; i++){
               if(requestArrCopy[i] !== headPos){
                    headPosIndex = --i;
                    break;
               } 
          }
          for(let i = headPosIndex - 1; i >= 0; i--){
               let calculateSeekTime = Math.abs(currentHeadPos - requestArrCopy[i])
               totalSeekTime += calculateSeekTime;
               step++
               stepBreakdown.push({step: step, from: currentHeadPos, to: requestArrCopy[i], seekTime: calculateSeekTime, runningTotal: totalSeekTime});
               currentHeadPos = requestArrCopy[i];
               requestProcessed++;     
          }
          
          for(let i = requestArrCopy.length - 1; i > headPosIndex; i--){
               if(i === requestArrCopy.length - 1) {
                    currentHeadPos = requestArrCopy[i];
                    if(i - 1 === headPosIndex) {
                         stepBreakdown.push({step: step + 1, from: currentHeadPos, to: requestArrCopy[i], seekTime: 0, runningTotal: totalSeekTime});     
                    }
                    requestProcessed++;
                    continue;
               }
               let calculateSeekTime = Math.abs(currentHeadPos - requestArrCopy[i])
               totalSeekTime += calculateSeekTime;
               step++;
               stepBreakdown.push({step: step, from: currentHeadPos, to: requestArrCopy[i], seekTime: calculateSeekTime, runningTotal: totalSeekTime});
               currentHeadPos = requestArrCopy[i];
               requestProcessed++;     
          }
     }

     let avgSeekTime = requestArr.length === 0 ? 0 : Math.round(totalSeekTime / requestProcessed);
     return {requestArr, stepBreakdown, totalSeekTime, avgSeekTime, requestProcessed, finalHead: currentHeadPos};     
}

export function checkRequest(requestArr) {
     let message = "";
     if(requestArr.length === 0) return {ok: false, message: "Request can not be empty"};
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

export function checkHeadPos(headPos) {
     let message = ""
     if(headPos == null) message = "Please select starting head";
 
     else if(!Number.isInteger(headPos)) message = "Invalid input \nonly integers are allowed"; 

     else if(headPos < 0 || headPos > 499) message = "Head position range has to be [0, 499]";  

     return message === "" ? {ok: true} : {ok: false, message};
}
