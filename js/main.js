const algorithmOption = document.getElementsByClassName("algorithm-options");

const currentAlgorithmDisplay= document.getElementById("current-algorithm-display");

const moreInfoBtn = document.getElementById("more-info-btn");


for (const element of algorithmOption) {
     element.addEventListener("click", () => {
          for (const e of algorithmOption) {
               e.classList.remove("current-algorithm");     
          }
          element.classList.add("current-algorithm");
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