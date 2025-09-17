export function getFormValues(form) {
     const requestSequence = form["request-sequence"].value;
     let headPosition = form["head-position"].value;
     headPosition = headPosition === "" ? null : Number(headPosition);
     const direction = form["request-direction"].value;
     const requestArr = requestSequence.split(/[\s,]+/).filter(x => x !== "").map(x => Number(x));
     return {requestArr, headPosition, direction};
}