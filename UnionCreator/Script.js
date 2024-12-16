// To do:
// Add the ability to show unions of greater than two.
// Functionality for using specific pieces. The user inputs the pieces that they care about in the textarea.
// The ability to save the contents of the tables.
// Maybe moving the individual turn functions from the cube states function into their own separate functions will make the program faster.
// Also try moving the state function call to the top of the createTables function as was done with findCoverage and findUnions.
// Try declaring a global variable like "let involvedPieces = document.getElementById("InvolvedPieces").value.split("\n");"
///// Then inside the applyAlg function have the cube variable and the code to remove uninvolved pieces.
// In the compareStates function, combine the main two sets of variables into one set.
// In the getInverse function, change the final else to an else if for the prime symbol.
///// Then remove the "(", ")", and whatever else and replace that with a final else which covers
///// anything that isn't turn notation in an alg.
// Build a Google Sheets batch solver alg list formatter.
// Update the various alg checking lines to cover not only ' for prime, but also ’.

function algToArray(algorithm) {
  const regex = /[RLUDFBMESXYZrludfb]'?2?/g;
  return algorithm.match(regex) || [];
}

/********************************************************************************/
/*****************************COVERAGE BUTTON*********************************/
/********************************************************************************/

let coverageButton = document.querySelector("#CoverageButton");

coverageButton.addEventListener("click", () => {
  document.getElementById("Coverage").value = findCoverage();
});

/********************************************************************************/
/*****************************TABLE BUTTON*********************************/
/********************************************************************************/

let tableButton = document.querySelector("#TableButton");

tableButton.addEventListener("click", () => {
  // Get id for the container that holds the tables.
  let table = document.getElementById("comboTableContainer");
  // If tables aren't already on the page, create new ones.
  // If statement can be removed if users want the ability to generate more than one set of tables.
  if (!table) {
    createTables();
  }
});

/********************************************************************************/
/*****************************UNIONS BUTTON*********************************/
/********************************************************************************/

let unionsButton = document.querySelector("#UnionsButton");

unionsButton.addEventListener("click", () => {
  // Get id for the container that holds the tables.
  /*let tables = document.getElementById("tableContainer");
  // If tables aren't already on the page, create new ones.
  // If statement can be removed if users want the ability to generate more than one set of tables.
  if (!tables) {
    createTables();
  }*/
  document.getElementById("Unions").value = findBestUnions();
});

/********************************************************************************/
/*****************************CLEAR OUTPUT BUTTON********************************/
/********************************************************************************/

let clearOutputButton = document.querySelector("#ClearOutputButton");

clearOutputButton.addEventListener("click", () => {
  // Clear the coerage and unions output.
  let coverage = (document.getElementById("Coverage").value = "");
  let unions = (document.getElementById("Unions").value = "");
});

/********************************************************************************/
/*****************************CLEAR TABLE BUTTON********************************/
/********************************************************************************/

let clearTableButton = document.querySelector("#ClearTableButton");

clearTableButton.addEventListener("click", () => {
  /*****Clear the tables*****/
  // Get id for the container that holds the tables.
  let table = document.getElementById("comboTableContainer");

  // Remove the container.
  if (table) {
    table.parentNode.removeChild(table);
  }
});

/********************************************************************************/
/*****************************MULTI UNIONS FUNCTION******************************/
/********************************************************************************/

function multiUnions() {
  // Get the user input cases and states.
  let inputCases = document.getElementById("Cases").value.split("\n");
  let desiredStates = document
    .getElementById("DesiredStates")
    .value.split("\n");
  // Create a main array to contain the coverage for each case.
  let coverage = [];

  // Step 1: Find all cases which the current row case can solve to the desired states.
  // This is the same as the crossed cases process used in the previous columns.
  // An array of a list of numbers for each row is produced. Each one fills the "Cases this case covers" column
  // Each row of covered cases is pushed to the coverage array.
  for (let row = 0; row < inputCases.length; row++) {
    let rowCoverage = []; // Variable to push the covered cases for the current row.
    for (let col = 0; col < desiredStates.length; col++) {
      rowCoverage.push(compareStates(desiredStates[col], inputCases[row])); // Add the current case to the row coverage.
    }
    coverage.push(rowCoverage); // Add the row coverage array to the main coverage array.
  }
}

/********************************************************************************/
/*****************************CREATE TABLES FUNCTION*****************************/
/********************************************************************************/

function createTables() {
  // Variables to use the user input cases and desired states.
  let inputCases = document.getElementById("Cases").value.split("\n");
  let desiredStates = document
    .getElementById("DesiredStates")
    .value.split("\n");
  // Get all of the unions into a single variable for use throughout the tables.
  //let allUnions = findUnions();
  let allCoverage = findCoverage();

  /*****Combo Table*****/
  // Create and add main combo table elements
  let comboTableContainer = document.createElement("div");
  comboTableContainer.id = "comboTableContainer";
  let comboTable = document.createElement("Table");
  let comboTableHeader = document.createElement("THead");
  let comboTableBody = document.createElement("TBody");

  comboTable.appendChild(comboTableHeader);
  comboTable.appendChild(comboTableBody);

  comboTableContainer.append(comboTable);
  document.getElementById("Body").appendChild(comboTableContainer);

  // Create and add top header
  let row1 = document.createElement("tr");
  let casesHeader = document.createElement("th");
  casesHeader.innerHTML = "Cases";
  casesHeader.colSpan = 4;
  casesHeader.rowSpan = 1;
  let statesHeader = document.createElement("th");
  statesHeader.innerHTML = "Desired end states and resulting combinations";
  statesHeader.colSpan = desiredStates.length;

  row1.appendChild(casesHeader);
  row1.appendChild(statesHeader);
  comboTableHeader.appendChild(row1);

  // Create and add secondary header that lists all desired states.
  let row2 = document.createElement("tr");
  let caseNumberHeading = document.createElement("th");
  caseNumberHeading.innerHTML = "Case Number";
  let image3DHeading = document.createElement("th");
  image3DHeading.innerHTML = "3D Image";
  let imageOverheadHeading = document.createElement("th");
  imageOverheadHeading.innerHTML = "Overhead Image";
  let algorithmHeading = document.createElement("th");
  algorithmHeading.innerHTML = "Algorithm";

  row2.appendChild(caseNumberHeading);
  row2.appendChild(image3DHeading);
  row2.appendChild(imageOverheadHeading);
  row2.appendChild(algorithmHeading);

  // Add individual border styles here to prevent see-through borders.
  // A better solution can be found later.
  caseNumberHeading.style =
    "box-shadow: inset 0 1px 0 white, inset 0 -1px 0 white";
  image3DHeading.style =
    "box-shadow: inset 0 1px 0 white, inset 0 -1px 0 white";
  imageOverheadHeading.style =
    "box-shadow: inset 0 1px 0 white, inset 0 -1px 0 white";
  algorithmHeading.style =
    "box-shadow: inset 0 1px 0 white, inset 0 -1px 0 white";

  // Loop through all of the desired states in the array and add each to this subheader.
  for (s = 0; s < desiredStates.length; s++) {
    let subHeading = document.createElement("th");
    subHeading.innerHTML = desiredStates[s];
    subHeading.style = "box-shadow: inset 0 1px 0 white, inset 0 -1px 0 white";
    row2.appendChild(subHeading);
  }

  comboTableHeader.appendChild(row2);

  // Create and add all remaining rows.
  // Adds case number, image, case alg, crossed cases, covered cases, and unions to each row
  let casesCoverage = []; // An array to hold all of the covered cases. For use in the coverage and unions columns.
  for (let row = 0; row < inputCases.length; row++) {
    let nextRow = document.createElement("tr");
    let caseNumber = document.createElement("td");
    caseNumber.innerHTML = row + 1;
    nextRow.appendChild(caseNumber);

    // Add 3D image of case. Spaces are removed from the algorithms for VisualCube compatibility.
    let image3D = document.createElement("td");
    let image3DSource =
      "<img src=https://cubing.net/api/visualcube/?fmt=svg&size=100&case=" +
      inputCases[row].replace(/\s/g, "") +
      ">";
    image3D.innerHTML = image3DSource;
    nextRow.appendChild(image3D);

    // Add overhead image of case.
    let imageOverhead = document.createElement("td");
    let imageOverheadSource =
      "<img src=https://cubing.net/api/visualcube/?fmt=svg&size=100&view=plan&case=" +
      inputCases[row].replace(/\s/g, "") +
      ">";
    imageOverhead.innerHTML = imageOverheadSource;
    nextRow.appendChild(imageOverhead);

    // Add covered cases list and list of cases the current case can union with.
    let alg = document.createElement("td");
    alg.innerHTML = inputCases[row];
    nextRow.appendChild(alg);
    for (let col = 0; col < desiredStates.length; col++) {
      let crossedCase = document.createElement("td");
      crossedCase.innerHTML = compareStates(
        desiredStates[col],
        inputCases[row]
      );
      nextRow.appendChild(crossedCase);
    }
    // Add the current row to the comboTable.
    comboTable.appendChild(nextRow);
  }
}

/********************************************************************************/
/*****************************CROSS CASES FUNCTION*******************************/
/********************************************************************************/

function crossCases() {
  // Add covered cases list and list of cases the current case can union with.
  let inputCases = document.getElementById("Cases").value.split("\n");
  let desiredStates = document
    .getElementById("DesiredStates")
    .value.split("\n");
  let crossedCases = [];

  // Populate crossedCases
  for (let row = 0; row < inputCases.length; row++) {
    for (let col = 0; col < desiredStates.length; col++) {
      crossedCases.push(compareStates(desiredStates[col], inputCases[row]));
    }
  }

  // Split crossedCases into groups based on desiredStates length
  let groupedCases = [];
  for (let i = 0; i < crossedCases.length; i += desiredStates.length) {
    groupedCases.push(
      crossedCases.slice(i, i + desiredStates.length).join(", ")
    );
  }

  // Return the formatted result
  return groupedCases.join("\n");
}

/********************************************************************************/
/*****************************FIND COVERAGE FUNCTION*****************************/
/********************************************************************************/

function findCoverage() {
  let inputCases = document.getElementById("Cases").value.split("\n");
  let desiredStates = document
    .getElementById("DesiredStates")
    .value.split("\n");
  let findUnionsCasesCoverage = []; // Variable to hold all covered cases for each row.
  // Loop through the total number of algs in the user input list
  for (let row = 0; row < inputCases.length; row++) {
    let findUnionsRowCoverage = []; // Variable to push the covered cases for the current row.
    for (let col = 0; col < desiredStates.length; col++) {
      findUnionsRowCoverage.push(
        compareStates(desiredStates[col], inputCases[row])
      ); // Add the current case to the row coverage.
    }
    findUnionsCasesCoverage.push(findUnionsRowCoverage); // Add the row coverage array to the main coverage array. This creates an array for later use.
  }

  // Sort coverage and accumulate the results into sortedCoverage
  let sortedCoverage = "";
  for (let row = 0; row < inputCases.length; row++) {
    // Process and format the current row
    let sortedRow = [...new Set(findUnionsCasesCoverage[row])]
      .sort((a, b) => a - b) // Sort numerically
      .join(", "); // Convert to a string with ", " separator

    // Append to the final result with a newline for clarity
    sortedCoverage += (row > 0 ? "\n" : "") + sortedRow;
  }

  // Return the covered cases
  return sortedCoverage;
}

/********************************************************************************/
/*****************************FIND UNIONS FUNCTION*******************************/
/********************************************************************************/

function findUnions() {
  // Get the user input cases and states.
  let inputCases = document.getElementById("Cases").value.split("\n");
  let desiredStates = document
    .getElementById("DesiredStates")
    .value.split("\n");

  // Step 1: Find all cases which the current row case can solve to the desired states.
  // This is the same as the crossed cases process used in the previous columns.
  // An array of a list of numbers for each row is produced. Each one fills the "Cases this case covers" column
  // Each row of covered cases is pushed to the findUnionsCasesCoverage array.

  // Create a main array to contain the coverage for each case.
  let findUnionsCasesCoverage = [];

  for (let row = 0; row < inputCases.length; row++) {
    let findUnionsRowCoverage = []; // Variable to push the covered cases for the current row.
    for (let col = 0; col < desiredStates.length; col++) {
      findUnionsRowCoverage.push(
        compareStates(desiredStates[col], inputCases[row])
      ); // Add the current case to the row coverage.
    }
    findUnionsCasesCoverage.push(findUnionsRowCoverage); // Add the row coverage array to the main coverage array.
  }

  const maxNumber = Math.max(...findUnionsCasesCoverage.flat()); // Find the maximum number in all the lists
  let minListsNeeded = Infinity; // Track the minimum number of lists needed
  let combinations = [];

  function getCombinations(currentListIndex, selectedLists, selectedNumbers) {
    if (selectedNumbers.size === maxNumber) {
      // All numbers are covered
      if (selectedLists.length < minListsNeeded) {
        // Update the minimum number of lists needed
        minListsNeeded = selectedLists.length;
        combinations = [
          selectedLists.map(
            (list) => findUnionsCasesCoverage.indexOf(list) + 1
          ),
        ]; // Start a new list of combinations
      } else if (selectedLists.length === minListsNeeded) {
        // Add the current combination to the list of combinations
        combinations.push(
          selectedLists.map((list) => findUnionsCasesCoverage.indexOf(list) + 1)
        );
      }
      return;
    }

    if (currentListIndex >= findUnionsCasesCoverage.length) {
      // Reached the end of the list of lists
      return;
    }

    const list = findUnionsCasesCoverage[currentListIndex];
    const remainingNumbers = new Set(
      [...list].filter((num) => !selectedNumbers.has(num))
    );

    // Try including the current list in the combination
    getCombinations(
      currentListIndex + 1,
      [...selectedLists, list],
      new Set([...selectedNumbers, ...list])
    );

    // Try excluding the current list in the combination
    getCombinations(currentListIndex + 1, selectedLists, selectedNumbers);
  }

  getCombinations(0, [], new Set());

  return combinations.join("\n");
}

/********************************************************************************/
/*****************************FIND BEST UNIONS FUNCTION*******************************/
/********************************************************************************/

function findBestUnions() {
  let inputCases = document.getElementById("Cases").value.split("\n");
  let desiredStates = document
    .getElementById("DesiredStates")
    .value.split("\n");
  // Parse user-specified sets from DesiredAlgs input
  let desiredAlgs = document
    .getElementById("DesiredAlgs")
    .value.split(" ")
    .map(Number);
  let undesiredAlgs = document
    .getElementById("UndesiredAlgs")
    .value.split(" ")
    .map(Number);
  let cover = [];
  let uncovered = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24,
  ];

  // Step 1: Find all cases which the current row case can solve to the desired states.
  // This is the same as the crossed cases process used in the previous columns.
  // An array of a list of numbers for each row is produced. Each one fills the "Cases this case covers" column
  // Each row of covered cases is pushed to the findUnionsCasesCoverage array.

  // Create a main array to contain the coverage for each case.
  let findUnionsCasesCoverage = [];

  for (let row = 0; row < inputCases.length; row++) {
    let findUnionsRowCoverage = []; // Variable to push the covered cases for the current row.
    for (let col = 0; col < desiredStates.length; col++) {
      findUnionsRowCoverage.push(
        compareStates(desiredStates[col], inputCases[row])
      ); // Add the current case to the row coverage.
    }
    findUnionsCasesCoverage.push(findUnionsRowCoverage); // Add the row coverage array to the main coverage array.
  }

  //Sort each array and remove any duplicates.
  findUnionsCasesCoverage = findUnionsCasesCoverage.map((subArray) =>
    [...new Set(subArray)].sort((a, b) => a - b)
  );

  // Flatten all sets into a single array to calculate universal coverage
  const universalSet = [...new Set(findUnionsCasesCoverage.flat())];

  let covered = new Set(); // Elements already covered
  let selectedSets = []; // Indices of selected sets
  let remainingSets = findUnionsCasesCoverage.map((set, index) => ({
    set: new Set(set),
    index,
  }));

  // Step 1: Prioritize user-specified desired sets
  desiredAlgs.forEach((algIndex) => {
    const desiredSet = remainingSets.find((s) => s.index === algIndex - 1); // Adjust for 1-based input
    if (desiredSet && !selectedSets.includes(desiredSet.index)) {
      selectedSets.push(desiredSet.index);
      desiredSet.set.forEach((element) => covered.add(element));
      remainingSets = remainingSets.filter((s) => s.index !== desiredSet.index); // Remove used set
    }
  });

  // Step 2: Filter out undesired sets
  remainingSets = remainingSets.filter(
    (s) => !undesiredAlgs.includes(s.index + 1)
  ); // Adjust for 1-based indexing

  // Step 3: Apply greedy algorithm for remaining sets
  while (covered.size < universalSet.length) {
    let bestSet = null;
    let maxUncovered = 0;

    // Find the set that covers the most uncovered elements
    for (const { set, index } of remainingSets) {
      const uncovered = [...set].filter(
        (element) => !covered.has(element)
      ).length;
      if (uncovered > maxUncovered) {
        maxUncovered = uncovered;
        bestSet = index;
      }
    }

    // If no set can cover any new elements, terminate to avoid infinite loop
    if (!bestSet && maxUncovered === 0) break;

    // Add the best set to the solution
    const selectedSet = remainingSets.find((s) => s.index === bestSet);
    selectedSets.push(selectedSet.index);
    selectedSet.set.forEach((element) => covered.add(element));
    remainingSets = remainingSets.filter((s) => s.index !== selectedSet.index); // Remove used set
  }

  // Return the indices of selected sets sorted numerically (convert to 1-based indexing for user convenience)
  return selectedSets.map((index) => index + 1).sort((a, b) => a - b);
}

/********************************************************************************/
/*****************************COMPARE STATES FUNCTION****************************/
/********************************************************************************/

function compareStates(desiredState, alg) {
  let inputCases = document.getElementById("Cases").value.split("\n");
  let combo = getInverse(desiredState) + " " + getInverse(alg);
  let noAUF = combo;
  let noAUFU = combo + " U";
  let noAUFU2 = combo + " U2";
  let noAUFUP = combo + " U'";
  let UAUF = "U " + combo;
  let UAUFU = "U " + combo + " U";
  let UAUFU2 = "U " + combo + " U2";
  let UAUFUP = "U " + combo + " U'";
  let U2AUF = "U2 " + combo;
  let U2AUFU = "U2 " + combo + " U";
  let U2AUFU2 = "U2 " + combo + " U2";
  let U2AUFUP = "U2 " + combo + " U'";
  let UPAUF = "U' " + combo;
  let UPAUFU = "U' " + combo + " U";
  let UPAUFU2 = "U' " + combo + " U2";
  let UPAUFUP = "U' " + combo + " U'";
  let caseNumber = 0;

  // For each alg in the user input list, check if the desired state + alg combo state is equal.
  for (i = 0; i < inputCases.length; i++) {
    let caseState = String(applyAlg(getInverse(inputCases[i])));
    let noAUFState = String(applyAlg(noAUF));
    let noAUFUState = String(applyAlg(noAUFU));
    let noAUFU2State = String(applyAlg(noAUFU2));
    let noAUFUPState = String(applyAlg(noAUFUP));
    let UAUFState = String(applyAlg(UAUF));
    let UAUFUState = String(applyAlg(UAUFU));
    let UAUFU2State = String(applyAlg(UAUFU2));
    let UAUFUPState = String(applyAlg(UAUFUP));
    let U2AUFState = String(applyAlg(U2AUF));
    let U2AUFUState = String(applyAlg(U2AUFU));
    let U2AUFU2State = String(applyAlg(U2AUFU2));
    let U2AUFUPState = String(applyAlg(U2AUFUP));
    let UPAUFState = String(applyAlg(UPAUF));
    let UPAUFUState = String(applyAlg(UPAUFU));
    let UPAUFU2State = String(applyAlg(UPAUFU2));
    let UPAUFUPState = String(applyAlg(UPAUFUP));
    if (
      caseState == noAUFState ||
      caseState == noAUFUState ||
      caseState == noAUFU2State ||
      caseState == noAUFUPState ||
      caseState == UAUFState ||
      caseState == UAUFUState ||
      caseState == UAUFU2State ||
      caseState == UAUFUPState ||
      caseState == U2AUFState ||
      caseState == U2AUFUState ||
      caseState == U2AUFU2State ||
      caseState == U2AUFUPState ||
      caseState == UPAUFState ||
      caseState == UPAUFUState ||
      caseState == UPAUFU2State ||
      caseState == UPAUFUPState
    ) {
      caseNumber = i + 1;
      break;
    } else {
      caseNumber = "No Match";
    }
  }
  return caseNumber;
}

/********************************************************************************/
/*****************************INVERSE ALGORITHMS FUNCTION************************/
/********************************************************************************/

// Function for inverting an alg.
function getInverse(individualCase) {
  let inverseCase = ""; // Set a blank alg.

  // Loop through each character in the individual alg.
  // Start at the end of the alg, invert the current move, then add it to a blank alg starting from the beginning.
  for (let i = individualCase.length - 1; i >= 0; i--) {
    if (individualCase[i] == " ") {
      // Don't include any spaces that are in the alg. Those will be added later.
      continue;
    } else if (individualCase[i] == "(") {
      // If the current character is "(", ignore it and continue.
      continue;
    } else if (individualCase[i] == ")") {
      // If the current character is ")", ignore it and continue.
      continue;
    } else if (individualCase[i] == "'" && individualCase[i - 1] == "2") {
      // If the current character is 2, add it and the letter turn then move two characters backwards.
      inverseCase += individualCase[i - 2] += "2 ";
      i -= 2;
    } else if (individualCase[i] == "'") {
      // If the current character is the prime symbol, remove it, keep the letter turn, and move two characters backwards.
      inverseCase += individualCase[i - 1] += " ";
      i -= 1;
    } else if (individualCase[i] == "2") {
      // If the current character is 2, add it and the letter turn then move two characters backwards.
      inverseCase += individualCase[i - 1] += "2 ";
      i -= 1;
    } else {
      // If the current character is none of the above (should be a letter turn), keep it and add a prime symbol.
      inverseCase += individualCase[i] += "' ";
    }
  }

  // Remove a space from the end of the alg.
  // if statement probably not necessary.
  if (inverseCase.slice(-1) == " ") {
    inverseCase = inverseCase.slice(0, -1);
  }

  return inverseCase;
}

/********************************************************************************/
/*****************************CUBE STATES FUNCTION*******************************/
/********************************************************************************/

// Function to apply an alg and alter a cube state.
function applyAlg(individualCase) {
  let involvedStickers = document
    .getElementById("InvolvedStickers")
    .value.split("\n");

  /*
  // prettier-ignore
  let cube = ["U", "U", "U",
            "U", "U", "U",
            "U", "U", "U",
"L", "L", "L", "F", "F", "F", "R", "R", "R", "B", "B", "B",
"L", "L", "L", "F", "F", "F", "R", "R", "R", "B", "B", "B",
"L", "L", "L", "F", "F", "F", "R", "R", "R", "B", "B", "B",
            "D", "D", "D",
            "D", "D", "D",
            "D", "D", "D",];*/

  let cube = involvedStickers;

  // prettier-ignore
  const MOVE_PERMS = {
  R: [[2, 42], [5, 30], [8, 18], [14, 2], [15, 17], [16, 29], [17, 41], [18, 53], [26, 5], [27, 16], [29, 40], [30, 50], [38, 8], [39, 15], [40, 27], [41, 39], [42, 47], [47, 14], [50, 26], [53, 38]],
  "R'": [[42, 2], [30, 5], [18, 8], [2, 14], [17, 15], [29, 16], [41, 17], [53, 18], [5, 26], [16, 27], [40, 29], [50, 30], [8, 38], [15, 39], [27, 40], [39, 41], [47, 42], [14, 47], [26, 50], [38, 53]],
  R2: [[2, 47], [5, 50], [8, 53], [14, 42], [15, 41], [16, 40], [17, 39], [18, 38], [26, 30], [27, 29], [29, 27], [30, 26], [38, 18], [39, 17], [40, 16], [41, 15], [42, 14], [47, 2], [50, 5], [53, 8]],
  L: [[0, 12], [3, 24], [6, 36], [9, 11], [10, 23], [11, 35], [12, 45], [20, 6], [21, 10], [23, 34], [24, 48], [32, 3], [33, 9], [34, 21], [35, 33], [36, 51], [44, 0], [45, 44], [48, 32], [51, 20]],
  "L'": [[12, 0], [24, 3], [36, 6], [11, 9], [23, 10], [35, 11], [45, 12], [6, 20], [10, 21], [34, 23], [48, 24], [3, 32], [9, 33], [21, 34], [33, 35], [51, 36], [0, 44], [44, 45], [32, 48], [20, 51]],
  L2: [[0, 45], [3, 48], [6, 51], [9, 35], [10, 34], [11, 33], [12, 44], [20, 36], [21, 23], [23, 21], [24, 32], [32, 24], [33, 11], [34, 10], [35, 9], [36, 20], [44, 12], [45, 0], [48, 3], [51, 6]],
  U: [[0, 2], [1, 5], [2, 8], [3, 1], [5, 7], [6, 0], [7, 3], [8, 6], [9, 18], [10, 19], [11, 20], [12, 9], [13, 10], [14, 11], [15, 12], [16, 13], [17, 14], [18, 15], [19, 16], [20, 17]],
  "U'": [[2, 0], [5, 1], [8, 2], [1, 3], [7, 5], [0, 6], [3, 7], [6, 8], [18, 9], [19, 10], [20, 11], [9, 12], [10, 13], [11, 14], [12, 15], [13, 16], [14, 17], [15, 18], [16, 19], [17, 20]],
  U2: [[0, 8], [1, 7], [2, 6], [3, 5], [5, 3], [6, 2], [7, 1], [8, 0], [9, 15], [10, 16], [11, 17], [12, 18], [13, 19], [14, 20], [15, 9], [16, 10], [17, 11], [18, 12], [19, 13], [20, 14]],
  D: [[33, 36], [34, 37], [35, 38], [36, 39], [37, 40], [38, 41], [39, 42], [40, 43], [41, 44], [42, 33], [43, 34], [44, 35], [45, 47], [46, 50], [47, 53], [48, 46], [50, 52], [51, 45], [52, 48], [53, 51]],
  "D'": [[36, 33], [37, 34], [38, 35], [39, 36], [40, 37], [41, 38], [42, 39], [43, 40], [44, 41], [33, 42], [34, 43], [35, 44], [47, 45], [50, 46], [53, 47], [46, 48], [52, 50], [45, 51], [48, 52], [51, 53]],
  D2: [[33, 39], [34, 40], [35, 41], [36, 42], [37, 43], [38, 44], [39, 33], [40, 34], [41, 35], [42, 36], [43, 37], [44, 38], [45, 53], [46, 52], [47, 51], [48, 50], [50, 48], [51, 47], [52, 46], [53, 45]],
  F: [[6, 15], [7, 27], [8, 39], [11, 8], [12, 14], [13, 26], [14, 38], [15, 47], [23, 7], [24, 13], [26, 37], [27, 46], [35, 6], [36, 12], [37, 24], [38, 36], [39, 45], [45, 11], [46, 23], [47, 35]],
  "F'": [[15, 6], [27, 7], [39, 8], [8, 11], [14, 12], [26, 13], [38, 14], [47, 15], [7, 23], [13, 24], [37, 26], [46, 27], [6, 35], [12, 36], [24, 37], [36, 38], [45, 39], [11, 45], [23, 46], [35, 47]],
  F2: [[6, 47], [7, 46], [8, 45], [11, 39], [12, 38], [13, 37], [14, 36], [15, 35], [23, 27], [24, 26], [26, 24], [27, 23], [35, 15], [36, 14], [37, 13], [38, 12], [39, 11], [45, 8], [46, 7], [47, 6]],
  B: [[0, 33], [1, 21], [2, 9], [9, 51], [17, 0], [18, 20], [19, 32], [20, 44], [21, 52], [29, 1], [30, 19], [32, 43], [33, 53], [41, 2], [42, 18], [43, 30], [44, 42], [51, 41], [52, 29], [53, 17]],
  "B'": [[33, 0], [21, 1], [9, 2], [51, 9], [0, 17], [20, 18], [32, 19], [44, 20], [52, 21], [1, 29], [19, 30], [43, 32], [53, 33], [2, 41], [18, 42], [30, 43], [42, 44], [41, 51], [29, 52], [17, 53]],
  B2: [[0, 53], [1, 52], [2, 51], [9, 41], [17, 33], [18, 44], [19, 43], [20, 42], [21, 29], [29, 21], [30, 32], [32, 30], [33, 17], [41, 9], [42, 20], [43, 19], [44, 18], [51, 2], [52, 1], [53, 0]],
  M: [[1, 13], [4, 25], [7, 37], [13, 46], [19, 7], [25, 49], [31, 4], [37, 52], [43, 1], [46, 43], [49, 31], [52, 19]],
  "M'": [[13, 1], [25, 4], [37, 7], [46, 13], [7, 19], [49, 25], [4, 31], [52, 37], [1, 43], [43, 46], [31, 49], [19, 52]],
  M2: [[1, 46], [4, 49], [7, 52], [13, 43], [19, 37], [25, 31], [31, 25], [37, 19], [43, 13], [46, 1], [49, 4], [52, 7]],
  E: [[21, 24], [22, 25], [23, 26], [24, 27], [25, 28], [26, 29], [27, 30], [28, 31], [29, 32], [30, 21], [31, 22], [32, 23]],
  "E'": [[24, 21], [25, 22], [26, 23], [27, 24], [28, 25], [29, 26], [30, 27], [31, 28], [32, 29], [21, 30], [22, 31], [23, 32]],
  E2: [[21, 27], [22, 28], [23, 29], [24, 30], [25, 31], [26, 32], [27, 21], [28, 22], [29, 23], [30, 24], [31, 25], [32, 26]],
  S: [[3, 16], [4, 28], [5, 40], [10, 5], [16, 50], [22, 4], [28, 49], [34, 3], [40, 48], [48, 10], [49, 22], [50, 34]],
  "S'": [[16, 3], [28, 4], [40, 5], [5, 10], [50, 16], [4, 22], [49, 28], [3, 34], [48, 40], [10, 48], [22, 49], [34, 50]],
  S2: [[3, 50], [4, 49], [5, 48], [10, 40], [16, 34], [22, 28], [28, 22], [34, 16], [40, 10], [48, 5], [49, 4], [50, 3]],
  r: [[2, 42], [5, 30], [8, 18], [14, 2], [15, 17], [16, 29], [17, 41], [18, 53], [26, 5], [27, 16], [29, 40], [30, 50], [38, 8], [39, 15], [40, 27], [41, 39], [42, 47], [47, 14], [50, 26], [53, 38], [13, 1], [25, 4], [37, 7], [46, 13], [7, 19], [49, 25], [4, 31], [52, 37], [1, 43], [43, 46], [31, 49], [19, 52]],
  "r'": [[42, 2], [30, 5], [18, 8], [2, 14], [17, 15], [29, 16], [41, 17], [53, 18], [5, 26], [16, 27], [40, 29], [50, 30], [8, 38], [15, 39], [27, 40], [39, 41], [47, 42], [14, 47], [26, 50], [38, 53], [1, 13], [4, 25], [7, 37], [13, 46], [19, 7], [25, 49], [31, 4], [37, 52], [43, 1], [46, 43], [49, 31], [52, 19]],
  r2: [[2, 47], [5, 50], [8, 53], [14, 42], [15, 41], [16, 40], [17, 39], [18, 38], [26, 30], [27, 29], [29, 27], [30, 26], [38, 18], [39, 17], [40, 16], [41, 15], [42, 14], [47, 2], [50, 5], [53, 8], [13, 43], [25, 31], [37, 19], [46, 1], [7, 52], [49, 4], [4, 49], [52, 7], [1, 46], [43, 13], [31, 25], [19, 37]],
  l: [[0, 12], [3, 24], [6, 36], [9, 11], [10, 23], [11, 35], [12, 45], [20, 6], [21, 10], [23, 34], [24, 48], [32, 3], [33, 9], [34, 21], [35, 33], [36, 51], [44, 0], [45, 44], [48, 32], [51, 20], [1, 13], [4, 25], [7, 37], [13, 46], [19, 7], [25, 49], [31, 4], [37, 52], [43, 1], [46, 43], [49, 31], [52, 19]],
  "l'": [[12, 0], [24, 3], [36, 6], [11, 9], [23, 10], [35, 11], [45, 12], [6, 20], [10, 21], [34, 23], [48, 24], [3, 32], [9, 33], [21, 34], [33, 35], [51, 36], [0, 44], [44, 45], [32, 48], [20, 51], [13, 1], [25, 4], [37, 7], [46, 13], [7, 19], [49, 25], [4, 31], [52, 37], [1, 43], [43, 46], [31, 49], [19, 52]],
  l2: [[0, 45], [3, 48], [6, 51], [9, 35], [10, 34], [11, 33], [12, 44], [20, 36], [21, 23], [23, 21], [24, 32], [32, 24], [33, 11], [34, 10], [35, 9], [36, 20], [44, 12], [45, 0], [48, 3], [51, 6], [1, 46], [4, 49], [7, 52], [13, 43], [19, 37], [25, 31], [31, 25], [37, 19], [43, 13], [46, 1], [49, 4], [52, 7]],
  u: [[0, 2], [1, 5], [2, 8], [3, 1], [5, 7], [6, 0], [7, 3], [8, 6], [9, 18], [10, 19], [11, 20], [12, 9], [13, 10], [14, 11], [15, 12], [16, 13], [17, 14], [18, 15], [19, 16], [20, 17], [24, 21], [25, 22], [26, 23], [27, 24], [28, 25], [29, 26], [30, 27], [31, 28], [32, 29], [21, 30], [22, 31], [23, 32]],
  "u'": [[2, 0], [5, 1], [8, 2], [1, 3], [7, 5], [0, 6], [3, 7], [6, 8], [18, 9], [19, 10], [20, 11], [9, 12], [10, 13], [11, 14], [12, 15], [13, 16], [14, 17], [15, 18], [16, 19], [17, 20], [21, 24], [22, 25], [23, 26], [24, 27], [25, 28], [26, 29], [27, 30], [28, 31], [29, 32], [30, 21], [31, 22], [32, 23]],
  u2: [[0, 8], [1, 7], [2, 6], [3, 5], [5, 3], [6, 2], [7, 1], [8, 0], [9, 15], [10, 16], [11, 17], [12, 18], [13, 19], [14, 20], [15, 9], [16, 10], [17, 11], [18, 12], [19, 13], [20, 14], [24, 30], [25, 31], [26, 32], [27, 21], [28, 22], [29, 23], [30, 24], [31, 25], [32, 26], [21, 27], [22, 28], [23, 29]],
  d: [[33, 36], [34, 37], [35, 38], [36, 39], [37, 40], [38, 41], [39, 42], [40, 43], [41, 44], [42, 33], [43, 34], [44, 35], [45, 47], [46, 50], [47, 53], [48, 46], [50, 52], [51, 45], [52, 48], [53, 51], [21, 24], [22, 25], [23, 26], [24, 27], [25, 28], [26, 29], [27, 30], [28, 31], [29, 32], [30, 21], [31, 22], [32, 23]],
  "d'": [[36, 33], [37, 34], [38, 35], [39, 36], [40, 37], [41, 38], [42, 39], [43, 40], [44, 41], [33, 42], [34, 43], [35, 44], [47, 45], [50, 46], [53, 47], [46, 48], [52, 50], [45, 51], [48, 52], [51, 53], [24, 21], [25, 22], [26, 23], [27, 24], [28, 25], [29, 26], [30, 27], [31, 28], [32, 29], [21, 30], [22, 31], [23, 32]],
  d2: [[33, 39], [34, 40], [35, 41], [36, 42], [37, 43], [38, 44], [39, 33], [40, 34], [41, 35], [42, 36], [43, 37], [44, 38], [45, 53], [46, 52], [47, 51], [48, 50], [50, 48], [51, 47], [52, 46], [53, 45], [21, 27], [22, 28], [23, 29], [24, 30], [25, 31], [26, 32], [27, 21], [28, 22], [29, 23], [30, 24], [31, 25], [32, 26]],
  f: [[6, 15], [7, 27], [8, 39], [11, 8], [12, 14], [13, 26], [14, 38], [15, 47], [23, 7], [24, 13], [26, 37], [27, 46], [35, 6], [36, 12], [37, 24], [38, 36], [39, 45], [45, 11], [46, 23], [47, 35], [3, 16], [4, 28], [5, 40], [10, 5], [16, 50], [22, 4], [28, 49], [34, 3], [40, 48], [48, 10], [49, 22], [50, 34]],
  "f'": [[15, 6], [27, 7], [39, 8], [8, 11], [14, 12], [26, 13], [38, 14], [47, 15], [7, 23], [13, 24], [37, 26], [46, 27], [6, 35], [12, 36], [24, 37], [36, 38], [45, 39], [11, 45], [23, 46], [35, 47], [16, 3], [28, 4], [40, 5], [5, 10], [50, 16], [4, 22], [49, 28], [3, 34], [48, 40], [10, 48], [22, 49], [34, 50]],
  f2: [[6, 47], [7, 46], [8, 45], [11, 39], [12, 38], [13, 37], [14, 36], [15, 35], [23, 27], [24, 26], [26, 24], [27, 23], [35, 15], [36, 14], [37, 13], [38, 12], [39, 11], [45, 8], [46, 7], [47, 6], [3, 50], [4, 49], [5, 48], [10, 40], [16, 34], [22, 28], [28, 22], [34, 16], [40, 10], [48, 5], [49, 4], [50, 3]],
  b: [[0, 33], [1, 21], [2, 9], [9, 51], [17, 0], [18, 20], [19, 32], [20, 44], [21, 52], [29, 1], [30, 19], [32, 43], [33, 53], [41, 2], [42, 18], [43, 30], [44, 42], [51, 41], [52, 29], [53, 17], [16, 3], [28, 4], [40, 5], [5, 10], [50, 16], [4, 22], [49, 28], [3, 34], [48, 40], [10, 48], [22, 49], [34, 50]],
  "b'": [[33, 0], [21, 1], [9, 2], [51, 9], [0, 17], [20, 18], [32, 19], [44, 20], [52, 21], [1, 29], [19, 30], [43, 32], [53, 33], [2, 41], [18, 42], [30, 43], [42, 44], [41, 51], [29, 52], [17, 53], [3, 16], [4, 28], [5, 40], [10, 5], [16, 50], [22, 4], [28, 49], [34, 3], [40, 48], [48, 10], [49, 22], [50, 34]],
  b2: [[0, 53], [1, 52], [2, 51], [9, 41], [17, 33], [18, 44], [19, 43], [20, 42], [21, 29], [29, 21], [30, 32], [32, 30], [33, 17], [41, 9], [42, 20], [43, 19], [44, 18], [51, 2], [52, 1], [53, 0], [16, 34], [28, 22], [40, 10], [5, 48], [50, 3], [4, 49], [49, 4], [3, 50], [48, 5], [10, 40], [22, 28], [34, 16]],
  x: [[2, 42], [5, 30], [8, 18], [14, 2], [15, 17], [16, 29], [17, 41], [18, 53], [26, 5], [27, 16], [29, 40], [30, 50], [38, 8], [39, 15], [40, 27], [41, 39], [42, 47], [47, 14], [50, 26], [53, 38], [13, 1], [25, 4], [37, 7], [46, 13], [7, 19], [49, 25], [4, 31], [52, 37], [1, 43], [43, 46], [31, 49], [19, 52], [12, 0], [24, 3], [36, 6], [11, 9], [23, 10], [35, 11], [45, 12], [6, 20], [10, 21], [34, 23], [48, 24], [3, 32], [9, 33], [21, 34], [33, 35], [51, 36], [0, 44], [44, 45], [32, 48], [20, 51]],
  "x'": [[42, 2], [30, 5], [18, 8], [2, 14], [17, 15], [29, 16], [41, 17], [53, 18], [5, 26], [16, 27], [40, 29], [50, 30], [8, 38], [15, 39], [27, 40], [39, 41], [47, 42], [14, 47], [26, 50], [38, 53], [1, 13], [4, 25], [7, 37], [13, 46], [19, 7], [25, 49], [31, 4], [37, 52], [43, 1], [46, 43], [49, 31], [52, 19], [0, 12], [3, 24], [6, 36], [9, 11], [10, 23], [11, 35], [12, 45], [20, 6], [21, 10], [23, 34], [24, 48], [32, 3], [33, 9], [34, 21], [35, 33], [36, 51], [44, 0], [45, 44], [48, 32], [51, 20]],
  x2: [[2, 47], [5, 50], [8, 53], [14, 42], [15, 41], [16, 40], [17, 39], [18, 38], [26, 30], [27, 29], [29, 27], [30, 26], [38, 18], [39, 17], [40, 16], [41, 15], [42, 14], [47, 2], [50, 5], [53, 8], [13, 43], [25, 31], [37, 19], [46, 1], [7, 52], [49, 4], [4, 49], [52, 7], [1, 46], [43, 13], [31, 25], [19, 37], [12, 44], [24, 32], [36, 20], [11, 33], [23, 21], [35, 9], [45, 0], [6, 51], [10, 34], [34, 10], [48, 3], [3, 48], [9, 35], [21, 23], [33, 11], [51, 6], [0, 45], [44, 12], [32, 24], [20, 36]],
  y: [[0, 2], [1, 5], [2, 8], [3, 1], [5, 7], [6, 0], [7, 3], [8, 6], [9, 18], [10, 19], [11, 20], [12, 9], [13, 10], [14, 11], [15, 12], [16, 13], [17, 14], [18, 15], [19, 16], [20, 17], [24, 21], [25, 22], [26, 23], [27, 24], [28, 25], [29, 26], [30, 27], [31, 28], [32, 29], [21, 30], [22, 31], [23, 32], [36, 33], [37, 34], [38, 35], [39, 36], [40, 37], [41, 38], [42, 39], [43, 40], [44, 41], [33, 42], [34, 43], [35, 44], [47, 45], [50, 46], [53, 47], [46, 48], [52, 50], [45, 51], [48, 52], [51, 53]],
  "y'": [[2, 0], [5, 1], [8, 2], [1, 3], [7, 5], [0, 6], [3, 7], [6, 8], [18, 9], [19, 10], [20, 11], [9, 12], [10, 13], [11, 14], [12, 15], [13, 16], [14, 17], [15, 18], [16, 19], [17, 20], [21, 24], [22, 25], [23, 26], [24, 27], [25, 28], [26, 29], [27, 30], [28, 31], [29, 32], [30, 21], [31, 22], [32, 23], [33, 36], [34, 37], [35, 38], [36, 39], [37, 40], [38, 41], [39, 42], [40, 43], [41, 44], [42, 33], [43, 34], [44, 35], [45, 47], [46, 50], [47, 53], [48, 46], [50, 52], [51, 45], [52, 48], [53, 51]],
  y2: [[0, 8], [1, 7], [2, 6], [3, 5], [5, 3], [6, 2], [7, 1], [8, 0], [9, 15], [10, 16], [11, 17], [12, 18], [13, 19], [14, 20], [15, 9], [16, 10], [17, 11], [18, 12], [19, 13], [20, 14], [24, 30], [25, 31], [26, 32], [27, 21], [28, 22], [29, 23], [30, 24], [31, 25], [32, 26], [21, 27], [22, 28], [23, 29], [36, 42], [37, 43], [38, 44], [39, 33], [40, 34], [41, 35], [42, 36], [43, 37], [44, 38], [33, 39], [34, 40], [35, 41], [47, 51], [50, 48], [53, 45], [46, 52], [52, 46], [45, 53], [48, 50], [51, 47]],
  z: [[6, 15], [7, 27], [8, 39], [11, 8], [12, 14], [13, 26], [14, 38], [15, 47], [23, 7], [24, 13], [26, 37], [27, 46], [35, 6], [36, 12], [37, 24], [38, 36], [39, 45], [45, 11], [46, 23], [47, 35], [3, 16], [4, 28], [5, 40], [10, 5], [16, 50], [22, 4], [28, 49], [34, 3], [40, 48], [48, 10], [49, 22], [50, 34], [33, 0], [21, 1], [9, 2], [51, 9], [0, 17], [20, 18], [32, 19], [44, 20], [52, 21], [1, 29], [19, 30], [43, 32], [53, 33], [2, 41], [18, 42], [30, 43], [42, 44], [41, 51], [29, 52], [17, 53]],
  "z'": [[15, 6], [27, 7], [39, 8], [8, 11], [14, 12], [26, 13], [38, 14], [47, 15], [7, 23], [13, 24], [37, 26], [46, 27], [6, 35], [12, 36], [24, 37], [36, 38], [45, 39], [11, 45], [23, 46], [35, 47], [16, 3], [28, 4], [40, 5], [5, 10], [50, 16], [4, 22], [49, 28], [3, 34], [48, 40], [10, 48], [22, 49], [34, 50], [0, 33], [1, 21], [2, 9], [9, 51], [17, 0], [18, 20], [19, 32], [20, 44], [21, 52], [29, 1], [30, 19], [32, 43], [33, 53], [41, 2], [42, 18], [43, 30], [44, 42], [51, 41], [52, 29], [53, 17]],
  z2: [[6, 47], [7, 46], [8, 45], [11, 39], [12, 38], [13, 37], [14, 36], [15, 35], [23, 27], [24, 26], [26, 24], [27, 23], [35, 15], [36, 14], [37, 13], [38, 12], [39, 11], [45, 8], [46, 7], [47, 6], [3, 50], [4, 49], [5, 48], [10, 40], [16, 34], [22, 28], [28, 22], [34, 16], [40, 10], [48, 5], [49, 4], [50, 3], [33, 17], [21, 29], [9, 41], [51, 2], [0, 53], [20, 42], [32, 30], [44, 18], [52, 1], [1, 52], [19, 43], [43, 19], [53, 0], [2, 51], [18, 44], [30, 32], [42, 20], [41, 9], [29, 21], [17, 33]],
  };

  let alg = algToArray(individualCase);

  for (let move = 0; move < alg.length; move++) {
    const perms = MOVE_PERMS[alg[move]];
    let nextState = [...cube];
    perms.forEach(([src, dst]) => {
      nextState[dst] = cube[src];
    });
    cube = nextState;
  }

  return cube;
}
