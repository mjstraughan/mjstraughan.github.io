// To do:
// Functionality for using specific pieces. The user inputs the pieces that they care about in the textarea.
// The ability to save the contents of the tables.
// Maybe moving the individual turn functions from the cube states function into their own separate functions will make the program faster.
// Build a Google Sheets batch solver alg list formatter.

/********************************************************************************/
/*****************************FIND UNIONS BUTTON*********************************/
/********************************************************************************/

let unionButton = document.querySelector("#unionButton");

unionButton.addEventListener("click", () => {
  createTables();
});

/********************************************************************************/
/*****************************CLEAR TABLES BUTTON********************************/
/********************************************************************************/

let clearButton = document.querySelector("#Clear");

clearButton.addEventListener("click", () => {
  /*****Clear the tables*****/
  // Get id for the container that holds the tables.
  let tables = document.getElementById("tableContainer");
  // Remove the container.
  if (tables) tables.parentNode.removeChild(tables);

  /*****Clear the input boxes*****/ // Will be enabled upon user request.
  /*let inputCases = document.getElementById("Cases");
  let desiredStates = document.getElementById("DesiredStates");
  inputCases.value = "";
  desiredStates.value = "";*/
});

/********************************************************************************/
/*****************************CREATE TABLES FUNCTION******************************/
/********************************************************************************/

function createTables() {
  // Variables to use the user input cases and desired states.
  let inputCases = document.getElementById("Cases").value.split("\n");
  let desiredStates = document
    .getElementById("DesiredStates")
    .value.split("\n");
  // Get all of the unions into a single variable for use throughout the tables.
  let allUnions = findUnions();
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
  let coverageHeader = document.createElement("th");
  coverageHeader.innerHTML = "Cases this case covers";
  coverageHeader.rowSpan = 2;
  let unionsHeader = document.createElement("th");
  unionsHeader.innerHTML = "This case unions with";
  unionsHeader.rowSpan = 2;

  row1.appendChild(casesHeader);
  row1.appendChild(statesHeader);
  row1.appendChild(coverageHeader);
  row1.appendChild(unionsHeader);
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
      "<img src=http://cube.rider.biz/visualcube.php?fmt=png&bg=t&size=100&case=" +
      inputCases[row].replace(/\s/g, "") +
      ">";
    image3D.innerHTML = image3DSource;
    nextRow.appendChild(image3D);

    // Add overhead image of case.
    let imageOverhead = document.createElement("td");
    let imageOverheadSource =
      "<img src=" +
      '"' +
      "http://cube.rider.biz/visualcube.php?fmt=png&bg=t&size=100&view=plan&case=" +
      inputCases[row].replace(/\s/g, "") +
      '"' +
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

    // Add list of covered cases to the "Cases this case covers" column.
    let coveredCases = document.createElement("td");
    // The array element is converted to a set to remove duplicates. Then converted back into an array then to a string.
    // The string has spaces added after commas and is sorted numerically.
    coveredCases.innerHTML = String(
      [...new Set(allCoverage[row])].sort(function (a, b) {
        return a - b;
      })
    ).replace(/,/g, ", ");
    nextRow.appendChild(coveredCases);

    // Add possible unions to each row.
    let unionsWith = document.createElement("td");
    unionsWith.innerHTML = String(allUnions[row]).replace(/,/g, ", "); // Add spacing after commas.
    nextRow.appendChild(unionsWith);

    // Add the current row to the comboTable.
    comboTable.appendChild(nextRow);
  }

  /*****Union Table*****/

  // Create and add main union table elements.
  let unionTableContainer = document.createElement("div");
  unionTableContainer.id = "unionTableContainer";
  let unionTable = document.createElement("Table");
  unionTable.id = "unionTable";
  let unionTableHeader = document.createElement("THead");
  let unionTableBody = document.createElement("TBody");

  unionTable.appendChild(unionTableHeader);
  unionTable.appendChild(unionTableBody);

  unionTableContainer.append(unionTable);
  document.getElementById("Body").appendChild(unionTableContainer);

  // Create and add top header
  let unionRow1 = document.createElement("tr");
  let unionMainHeader = document.createElement("th");
  unionMainHeader.innerHTML = "Unions";
  unionRow1.appendChild(unionMainHeader);
  unionTableHeader.appendChild(unionRow1);

  // Add rows for each possible union.
  for (u = 0; u < allUnions.length; u++) {
    for (iu = 0; iu < allUnions[u].length; iu++) {
      let unionRow2 = document.createElement("tr");
      let unionSet = document.createElement("td");
      unionSet.innerHTML = u + 1 + ", " + allUnions[u][iu];
      unionRow2.appendChild(unionSet);

      unionTable.appendChild(unionRow2);
    }
  }

  // Create a main table container to hold the combo table and the union table.
  let tableContainer = document.createElement("div");
  tableContainer.id = "tableContainer";
  tableContainer.append(comboTableContainer);
  tableContainer.append(unionTableContainer);
  document.getElementById("Body").appendChild(tableContainer);
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

  // Return the covered cases.
  return findUnionsCasesCoverage;
}

/********************************************************************************/
/*****************************FIND UNIONS FUNCTION*****************************/
/********************************************************************************/

function findUnions() {
  // Get the user input cases and states.
  let inputCases = document.getElementById("Cases").value.split("\n");
  let desiredStates = document
    .getElementById("DesiredStates")
    .value.split("\n");
  // Create a main array to contain the coverage for each case.
  let findUnionsCasesCoverage = [];

  // Step 1: Find all cases which the current row case can solve to the desired states.
  // This is the same as the crossed cases process used in the previous columns.
  // An array of a list of numbers for each row is produced. Each one fills the "Cases this case covers" column
  // Each row of covered cases is pushed to the findUnionsCasesCoverage array.
  for (let row = 0; row < inputCases.length; row++) {
    let findUnionsRowCoverage = []; // Variable to push the covered cases for the current row.
    for (let col = 0; col < desiredStates.length; col++) {
      findUnionsRowCoverage.push(
        compareStates(desiredStates[col], inputCases[row])
      ); // Add the current case to the row coverage.
    }
    findUnionsCasesCoverage.push(findUnionsRowCoverage); // Add the row coverage array to the main coverage array.
  }

  // Step 2: Find all elements from the "Cases this case covers" column which contain any single element from each other.
  // For COLL+1 for example, in ZBLL there are 12 edge cases for each of the 42 COLL cases.
  // R U R' U R U2 R', and all other no-swap Sune edge cases, solves 9/12 of the cases to a U-perm or the solved state.
  // R U R' U R U2 R' may cover cases 1, 2, 3, 4, 5, 6, 7, 8, and 9. We have to find the cases which cover 10, 11, and 12.
  // However, a user might not input an alg list in the sorting order that they want.
  // So it isn't as easy as knowing that it will be cases 1-12, 13-24, 25-36, and so on for COLL+1/ZBLL.
  // The numbers could be anything.
  // The idea here is that any single case can only be contained within any certain set of cases.
  // It goes through each row and finds all rows which contain any single element from each other.
  let allCases = [];
  for (i = 0; i < findUnionsCasesCoverage.length; i++) {
    let possibleCases = [];
    for (rowNum = 0; rowNum < findUnionsCasesCoverage.length; rowNum++) {
      if (
        findUnionsCasesCoverage[i].some((item) =>
          findUnionsCasesCoverage[rowNum].includes(item)
        ) == true
      ) {
        possibleCases.push(findUnionsCasesCoverage[rowNum]);
      }
    }
    allCases.push(possibleCases);
  }

  // Step 3: Find what is missing. For which cases does the current case not solve to the desired state?
  // In the COLL+1 example, there are three no swap Sune ZBLL cases that R U R' U R U2 R' can't solve to a U-perm or solved state.
  // For each row, the "Cases this case covers" and "This case unions with" numbers are compared.
  // The numbers in "This case unions with" are filtered to contain only numbers which aren't in "Cases this case covers".
  allCasesString = [];
  for (c = 0; c < allCases.length; c++) {
    allCases[c] = [...new Set(allCases[c].flat())].sort(function (a, b) {
      return a - b;
    }); // Reduce the final column cases to only unique values.
    allCases[c] = allCases[c].filter(
      (x) => !findUnionsCasesCoverage[c].includes(x)
    ); // For each row, the two columns are compared. Values not in "Cases this case covers" are kept in "This case unions with".
    allCasesString[c] = String(allCases[c]).replace(/,/g, ", "); // Convert to a sring with commas and spaces for better looking content.
  }

  // Step 4: Find the possible unions.
  // For the current row in "This case unions with", go through the "Cases this case covers" column
  ///// and find the ones which include all elements from the current one.

  let allUnions = [];
  for (u = 0; u < allCases.length; u++) {
    let individualUnions = [];
    for (uc = 0; uc < allCases.length; uc++) {
      if (allCases[u].every((y) => findUnionsCasesCoverage[uc].includes(y))) {
        individualUnions.push(uc + 1);
      }
    }
    allUnions.push(individualUnions);
    allUnions[u].flat();
    //allUnions[u] = String(allUnions[u]).replace(/,/g, ", ");
  }

  //return allCasesString[referenceNumber]; // Use this if users request an additional column that shows the non-covered cases.
  return allUnions;
}

/********************************************************************************/
/*****************************COMPARE STATES FUNCTION*****************************/
/********************************************************************************/

function compareStates(desiredState, alg) {
  let inputCases = document.getElementById("Cases").value.split("\n");
  let combo = getInverse(desiredState) + " " + getInverse(alg);
  let noAUF = combo;
  let UAUF = "U " + combo;
  let U2AUF = "U2 " + combo;
  let UPAUF = "U' " + combo;
  let caseNumber = 0;

  // For each alg in the user input list, check if the desired state + alg combo state is equal.
  for (i = 0; i < inputCases.length; i++) {
    let caseState = String(applyAlg(getInverse(inputCases[i])));
    let noAUFState = String(applyAlg(noAUF));
    let UAUFState = String(applyAlg(UAUF));
    let U2AUFState = String(applyAlg(U2AUF));
    let UPAUFState = String(applyAlg(UPAUF));
    if (
      caseState == noAUFState ||
      caseState == UAUFState ||
      caseState == U2AUFState ||
      caseState == UPAUFState
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

/*function changeCube() {
let involvedPieces = document.getElementById("InvolvedPieces").value.split("\n");
  let involvedPieces = ["UFR", "UFL", "UBL", "UBR"];

  let cubePieces = [
    ["URF", "UFM", "UFL", "ULS", "ULB", "UBM", "UBR", "URS", "UMS"],
    ["RFU", "RUS", "RUB", "RBE", "RBD", "RDS", "RDF", "RFE", "RES"],
    ["FUR", "FRE", "FRD", "FDM", "FDL", "FLE", "FLU", "FUM", "FME"],
    ["DFR", "DRS", "DRB", "DBM", "DBL", "DLS", "DLF", "DFM", "DMS"],
    ["BRU", "BUM", "BUL", "BLE", "BLD", "BDM", "BDR", "BRE", "BME"],
    ["LUF", "LFE", "LFD", "LDS", "LDB", "LBE", "LBU", "LUS", "LES"],
  ];

  for (i = 0; i < 6; i++) {
    for (j = 0; j < 9; j++) {
      if (!involvedPieces.includes(cubePieces[i][j])) {
        cubePieces[i][j] = "";
      }
    }
  }
  return cubePieces;
}*/

// Function to apply an alg and alter a cube state.
function applyAlg(individualCase) {
  // Represent cube using the 54 individual stickers.
  // The 9 stickers of each face go in a spiral starting at a corner and ending with the center.
  // Each face of 9 stickers has its own array. This makes 6 arrays contained in one overall array.

  //let cube = changeCube();
  let cube = [
    ["URF", "UFM", "UFL", "ULS", "ULB", "UBM", "UBR", "URS", "UMS"],
    ["RFU", "RUS", "RUB", "RBE", "RBD", "RDS", "RDF", "RFE", "RES"],
    ["FUR", "FRE", "FRD", "FDM", "FDL", "FLE", "FLU", "FUM", "FME"],
    ["DFR", "DRS", "DRB", "DBM", "DBL", "DLS", "DLF", "DFM", "DMS"],
    ["BRU", "BUM", "BUL", "BLE", "BLD", "BDM", "BDR", "BRE", "BME"],
    ["LUF", "LFE", "LFD", "LDS", "LDB", "LBE", "LBU", "LUS", "LES"],
  ];

  function UTurn() {
    // Rotate U face stickers clockwise.
    [
      cube[0][0],
      cube[0][1],
      cube[0][2],
      cube[0][3],
      cube[0][4],
      cube[0][5],
      cube[0][6],
      cube[0][7],
    ] = [
      cube[0][6],
      cube[0][7],
      cube[0][0],
      cube[0][1],
      cube[0][2],
      cube[0][3],
      cube[0][4],
      cube[0][5],
    ];

    // Rotate FU, LU, BU, and RU lines clockwise around the cube.
    [
      cube[1][2],
      cube[1][1],
      cube[1][0],
      cube[2][0],
      cube[2][7],
      cube[2][6],
      cube[5][0],
      cube[5][7],
      cube[5][6],
      cube[4][2],
      cube[4][1],
      cube[4][0],
    ] = [
      cube[4][2],
      cube[4][1],
      cube[4][0],
      cube[1][2],
      cube[1][1],
      cube[1][0],
      cube[2][0],
      cube[2][7],
      cube[2][6],
      cube[5][0],
      cube[5][7],
      cube[5][6],
    ];
  }

  function RTurn() {
    // Rotate R face stickers clockwise.
    [
      cube[1][0],
      cube[1][1],
      cube[1][2],
      cube[1][3],
      cube[1][4],
      cube[1][5],
      cube[1][6],
      cube[1][7],
    ] = [
      cube[1][6],
      cube[1][7],
      cube[1][0],
      cube[1][1],
      cube[1][2],
      cube[1][3],
      cube[1][4],
      cube[1][5],
    ];

    // Rotate UR, BR, DR, and FR lines clockwise around the cube.
    [
      cube[0][0],
      cube[0][7],
      cube[0][6],
      cube[4][0],
      cube[4][7],
      cube[4][6],
      cube[3][2],
      cube[3][1],
      cube[3][0],
      cube[2][2],
      cube[2][1],
      cube[2][0],
    ] = [
      cube[2][2],
      cube[2][1],
      cube[2][0],
      cube[0][0],
      cube[0][7],
      cube[0][6],
      cube[4][0],
      cube[4][7],
      cube[4][6],
      cube[3][2],
      cube[3][1],
      cube[3][0],
    ];
  }

  function FTurn() {
    // Rotate F face stickers clockwise.
    [
      cube[2][0],
      cube[2][1],
      cube[2][2],
      cube[2][3],
      cube[2][4],
      cube[2][5],
      cube[2][6],
      cube[2][7],
    ] = [
      cube[2][6],
      cube[2][7],
      cube[2][0],
      cube[2][1],
      cube[2][2],
      cube[2][3],
      cube[2][4],
      cube[2][5],
    ];

    // Rotate UF, RF, DF, and LF lines clockwise around the cube.
    [
      cube[0][2],
      cube[0][1],
      cube[0][0],
      cube[1][0],
      cube[1][7],
      cube[1][6],
      cube[3][0],
      cube[3][7],
      cube[3][6],
      cube[5][2],
      cube[5][1],
      cube[5][0],
    ] = [
      cube[5][2],
      cube[5][1],
      cube[5][0],
      cube[0][2],
      cube[0][1],
      cube[0][0],
      cube[1][0],
      cube[1][7],
      cube[1][6],
      cube[3][0],
      cube[3][7],
      cube[3][6],
    ];
  }

  function DTurn() {
    // Rotate D face stickers clockwise.
    [
      cube[3][0],
      cube[3][1],
      cube[3][2],
      cube[3][3],
      cube[3][4],
      cube[3][5],
      cube[3][6],
      cube[3][7],
    ] = [
      cube[3][6],
      cube[3][7],
      cube[3][0],
      cube[3][1],
      cube[3][2],
      cube[3][3],
      cube[3][4],
      cube[3][5],
    ];

    // Rotate FD, RD, BD, and LD lines clockwise around the cube.
    [
      cube[1][6],
      cube[1][5],
      cube[1][4],
      cube[4][6],
      cube[4][5],
      cube[4][4],
      cube[5][4],
      cube[5][3],
      cube[5][2],
      cube[2][4],
      cube[2][3],
      cube[2][2],
    ] = [
      cube[2][4],
      cube[2][3],
      cube[2][2],
      cube[1][6],
      cube[1][5],
      cube[1][4],
      cube[4][6],
      cube[4][5],
      cube[4][4],
      cube[5][4],
      cube[5][3],
      cube[5][2],
    ];
  }

  function BTurn() {
    // Rotate B face stickers clockwise.
    [
      cube[4][0],
      cube[4][1],
      cube[4][2],
      cube[4][3],
      cube[4][4],
      cube[4][5],
      cube[4][6],
      cube[4][7],
    ] = [
      cube[4][6],
      cube[4][7],
      cube[4][0],
      cube[4][1],
      cube[4][2],
      cube[4][3],
      cube[4][4],
      cube[4][5],
    ];

    // Rotate UB, LB, DB, and RB lines clockwise around the cube.
    [
      cube[0][6],
      cube[0][5],
      cube[0][4],
      cube[5][6],
      cube[5][5],
      cube[5][4],
      cube[3][4],
      cube[3][3],
      cube[3][2],
      cube[1][4],
      cube[1][3],
      cube[1][2],
    ] = [
      cube[1][4],
      cube[1][3],
      cube[1][2],
      cube[0][6],
      cube[0][5],
      cube[0][4],
      cube[5][6],
      cube[5][5],
      cube[5][4],
      cube[3][4],
      cube[3][3],
      cube[3][2],
    ];
  }

  function LTurn() {
    // Rotate L face stickers clockwise.
    [
      cube[5][0],
      cube[5][1],
      cube[5][2],
      cube[5][3],
      cube[5][4],
      cube[5][5],
      cube[5][6],
      cube[5][7],
    ] = [
      cube[5][6],
      cube[5][7],
      cube[5][0],
      cube[5][1],
      cube[5][2],
      cube[5][3],
      cube[5][4],
      cube[5][5],
    ];

    // Rotate UL, FL, DL, and BL lines clockwise around the cube.
    [
      cube[0][4],
      cube[0][3],
      cube[0][2],
      cube[2][6],
      cube[2][5],
      cube[2][4],
      cube[3][6],
      cube[3][5],
      cube[3][4],
      cube[4][4],
      cube[4][3],
      cube[4][2],
    ] = [
      cube[4][4],
      cube[4][3],
      cube[4][2],
      cube[0][4],
      cube[0][3],
      cube[0][2],
      cube[2][6],
      cube[2][5],
      cube[2][4],
      cube[3][6],
      cube[3][5],
      cube[3][4],
    ];
  }

  function MTurn() {
    // Rotate UM, FM, DM, and BM lines clockwise around the cube.
    [
      cube[0][5],
      cube[0][8],
      cube[0][1],
      cube[2][7],
      cube[2][8],
      cube[2][3],
      cube[3][7],
      cube[3][8],
      cube[3][3],
      cube[4][5],
      cube[4][8],
      cube[4][1],
    ] = [
      cube[4][5],
      cube[4][8],
      cube[4][1],
      cube[0][5],
      cube[0][8],
      cube[0][1],
      cube[2][7],
      cube[2][8],
      cube[2][3],
      cube[3][7],
      cube[3][8],
      cube[3][3],
    ];
  }

  function ETurn() {
    // Rotate FE, RE, BE, and LE lines clockwise around the cube.
    [
      cube[2][5],
      cube[2][8],
      cube[2][1],
      cube[1][7],
      cube[1][8],
      cube[1][3],
      cube[4][7],
      cube[4][8],
      cube[4][3],
      cube[5][5],
      cube[5][8],
      cube[5][1],
    ] = [
      cube[5][5],
      cube[5][8],
      cube[5][1],
      cube[2][5],
      cube[2][8],
      cube[2][1],
      cube[1][7],
      cube[1][8],
      cube[1][3],
      cube[4][7],
      cube[4][8],
      cube[4][3],
    ];
  }

  function STurn() {
    // Rotate US, RS, DS, and LS lines clockwise around the cube.
    [
      cube[0][3],
      cube[0][8],
      cube[0][7],
      cube[1][1],
      cube[1][8],
      cube[1][5],
      cube[3][1],
      cube[3][8],
      cube[3][5],
      cube[5][3],
      cube[5][8],
      cube[5][7],
    ] = [
      cube[5][3],
      cube[5][8],
      cube[5][7],
      cube[0][3],
      cube[0][8],
      cube[0][7],
      cube[1][1],
      cube[1][8],
      cube[1][5],
      cube[3][1],
      cube[3][8],
      cube[3][5],
    ];
  }

  function xRotation() {
    // Rotate R face stickers clockwise.
    [
      cube[1][0],
      cube[1][1],
      cube[1][2],
      cube[1][3],
      cube[1][4],
      cube[1][5],
      cube[1][6],
      cube[1][7],
    ] = [
      cube[1][6],
      cube[1][7],
      cube[1][0],
      cube[1][1],
      cube[1][2],
      cube[1][3],
      cube[1][4],
      cube[1][5],
    ];

    // Rotate L face stickers counter-clockwise.
    [
      cube[5][0],
      cube[5][1],
      cube[5][2],
      cube[5][3],
      cube[5][4],
      cube[5][5],
      cube[5][6],
      cube[5][7],
    ] = [
      cube[5][2],
      cube[5][3],
      cube[5][4],
      cube[5][5],
      cube[5][6],
      cube[5][7],
      cube[5][0],
      cube[5][1],
    ];

    // Rotate U, B, D, and F faces clockwise around the cube.
    [
      cube[0][0],
      cube[0][1],
      cube[0][2],
      cube[0][3],
      cube[0][4],
      cube[0][5],
      cube[0][6],
      cube[0][7],
      cube[0][8],
      cube[4][0],
      cube[4][1],
      cube[4][2],
      cube[4][3],
      cube[4][4],
      cube[4][5],
      cube[4][6],
      cube[4][7],
      cube[4][8],
      cube[3][2],
      cube[3][3],
      cube[3][4],
      cube[3][5],
      cube[3][6],
      cube[3][7],
      cube[3][0],
      cube[3][1],
      cube[3][8],
      cube[2][2],
      cube[2][3],
      cube[2][4],
      cube[2][5],
      cube[2][6],
      cube[2][7],
      cube[2][0],
      cube[2][1],
      cube[2][8],
    ] = [
      cube[2][2],
      cube[2][3],
      cube[2][4],
      cube[2][5],
      cube[2][6],
      cube[2][7],
      cube[2][0],
      cube[2][1],
      cube[2][8],
      cube[0][0],
      cube[0][1],
      cube[0][2],
      cube[0][3],
      cube[0][4],
      cube[0][5],
      cube[0][6],
      cube[0][7],
      cube[0][8],
      cube[4][0],
      cube[4][1],
      cube[4][2],
      cube[4][3],
      cube[4][4],
      cube[4][5],
      cube[4][6],
      cube[4][7],
      cube[4][8],
      cube[3][2],
      cube[3][3],
      cube[3][4],
      cube[3][5],
      cube[3][6],
      cube[3][7],
      cube[3][0],
      cube[3][1],
      cube[3][8],
    ];
  }

  function yRotation() {
    // Rotate U face stickers clockwise.
    [
      cube[0][0],
      cube[0][1],
      cube[0][2],
      cube[0][3],
      cube[0][4],
      cube[0][5],
      cube[0][6],
      cube[0][7],
    ] = [
      cube[0][6],
      cube[0][7],
      cube[0][0],
      cube[0][1],
      cube[0][2],
      cube[0][3],
      cube[0][4],
      cube[0][5],
    ];

    // Rotate D face stickers counter-clockwise.
    [
      cube[3][0],
      cube[3][1],
      cube[3][2],
      cube[3][3],
      cube[3][4],
      cube[3][5],
      cube[3][6],
      cube[3][7],
    ] = [
      cube[3][2],
      cube[3][3],
      cube[3][4],
      cube[3][5],
      cube[3][6],
      cube[3][7],
      cube[3][0],
      cube[3][1],
    ];

    // Rotate F, L, B, and R faces clockwise around the cube.
    [
      cube[2][0],
      cube[2][1],
      cube[2][2],
      cube[2][3],
      cube[2][4],
      cube[2][5],
      cube[2][6],
      cube[2][7],
      cube[2][8],
      cube[5][0],
      cube[5][1],
      cube[5][2],
      cube[5][3],
      cube[5][4],
      cube[5][5],
      cube[5][6],
      cube[5][7],
      cube[5][8],
      cube[4][2],
      cube[4][3],
      cube[4][4],
      cube[4][5],
      cube[4][6],
      cube[4][7],
      cube[4][0],
      cube[4][1],
      cube[4][8],
      cube[1][2],
      cube[1][3],
      cube[1][4],
      cube[1][5],
      cube[1][6],
      cube[1][7],
      cube[1][0],
      cube[1][1],
      cube[1][8],
    ] = [
      cube[1][2],
      cube[1][3],
      cube[1][4],
      cube[1][5],
      cube[1][6],
      cube[1][7],
      cube[1][0],
      cube[1][1],
      cube[1][8],
      cube[2][0],
      cube[2][1],
      cube[2][2],
      cube[2][3],
      cube[2][4],
      cube[2][5],
      cube[2][6],
      cube[2][7],
      cube[2][8],
      cube[5][0],
      cube[5][1],
      cube[5][2],
      cube[5][3],
      cube[5][4],
      cube[5][5],
      cube[5][6],
      cube[5][7],
      cube[5][8],
      cube[4][2],
      cube[4][3],
      cube[4][4],
      cube[4][5],
      cube[4][6],
      cube[4][7],
      cube[4][0],
      cube[4][1],
      cube[4][8],
    ];
  }

  function zRotation() {
    // Rotate F face stickers clockwise.
    [
      cube[2][0],
      cube[2][1],
      cube[2][2],
      cube[2][3],
      cube[2][4],
      cube[2][5],
      cube[2][6],
      cube[2][7],
    ] = [
      cube[2][6],
      cube[2][7],
      cube[2][0],
      cube[2][1],
      cube[2][2],
      cube[2][3],
      cube[2][4],
      cube[2][5],
    ];

    // Rotate B face stickers counter-clockwise.
    [
      cube[4][0],
      cube[4][1],
      cube[4][2],
      cube[4][3],
      cube[4][4],
      cube[4][5],
      cube[4][6],
      cube[4][7],
    ] = [
      cube[4][2],
      cube[4][3],
      cube[4][4],
      cube[4][5],
      cube[4][6],
      cube[4][7],
      cube[4][0],
      cube[4][1],
    ];

    // Rotate U, R, D, and L faces clockwise around the cube.
    [
      cube[0][0],
      cube[0][1],
      cube[0][2],
      cube[0][3],
      cube[0][4],
      cube[0][5],
      cube[0][6],
      cube[0][7],
      cube[0][8],
      cube[1][6],
      cube[1][7],
      cube[1][0],
      cube[1][1],
      cube[1][2],
      cube[1][3],
      cube[1][4],
      cube[1][5],
      cube[1][8],
      cube[3][6],
      cube[3][7],
      cube[3][0],
      cube[3][1],
      cube[3][2],
      cube[3][3],
      cube[3][4],
      cube[3][5],
      cube[3][8],
      cube[5][0],
      cube[5][1],
      cube[5][2],
      cube[5][3],
      cube[5][4],
      cube[5][5],
      cube[5][6],
      cube[5][7],
      cube[5][8],
    ] = [
      cube[5][0],
      cube[5][1],
      cube[5][2],
      cube[5][3],
      cube[5][4],
      cube[5][5],
      cube[5][6],
      cube[5][7],
      cube[5][8],
      cube[0][0],
      cube[0][1],
      cube[0][2],
      cube[0][3],
      cube[0][4],
      cube[0][5],
      cube[0][6],
      cube[0][7],
      cube[0][8],
      cube[1][6],
      cube[1][7],
      cube[1][0],
      cube[1][1],
      cube[1][2],
      cube[1][3],
      cube[1][4],
      cube[1][5],
      cube[1][8],
      cube[3][6],
      cube[3][7],
      cube[3][0],
      cube[3][1],
      cube[3][2],
      cube[3][3],
      cube[3][4],
      cube[3][5],
      cube[3][8],
    ];
  }

  // For each turn in the alg, apply the turn or rotation functions.
  for (let i = 0; i < individualCase.length; i++) {
    if (individualCase[i] == " ") {
      continue;
    } else if (individualCase[i] == "(") {
      continue;
    } else if (individualCase[i] == ")") {
      continue;
    } else if (individualCase[i] == "U") {
      if (individualCase[i + 1] == "'") {
        UTurn();
        UTurn();
        UTurn();
        i += 1;
      } else if (individualCase[i + 1] == "2") {
        UTurn();
        UTurn();
        i += 1;
      } else {
        UTurn();
      }
    } else if (individualCase[i] == "u") {
      if (individualCase[i + 1] == "'") {
        UTurn();
        UTurn();
        UTurn();
        ETurn();
        i += 1;
      } else if (individualCase[i + 1] == "2") {
        UTurn();
        UTurn();
        ETurn();
        ETurn();
        i += 1;
      } else {
        DTurn();
        yRotation();
      }
    } else if (individualCase[i] == "R") {
      if (individualCase[i + 1] == "'") {
        RTurn();
        RTurn();
        RTurn();
        i += 1;
      } else if (individualCase[i + 1] == "2") {
        RTurn();
        RTurn();
        i += 1;
      } else {
        RTurn();
      }
    } else if (individualCase[i] == "r") {
      if (individualCase[i + 1] == "'") {
        RTurn();
        RTurn();
        RTurn();
        MTurn();
        i += 1;
      } else if (individualCase[i + 1] == "2") {
        RTurn();
        RTurn();
        MTurn();
        MTurn();
        i += 1;
      } else {
        LTurn();
        xRotation();
      }
    } else if (individualCase[i] == "F") {
      if (individualCase[i + 1] == "'") {
        FTurn();
        FTurn();
        FTurn();
        i += 1;
      } else if (individualCase[i + 1] == "2") {
        FTurn();
        FTurn();
        i += 1;
      } else {
        FTurn();
      }
    } else if (individualCase[i] == "f") {
      if (individualCase[i + 1] == "'") {
        FTurn();
        FTurn();
        FTurn();
        STurn();
        STurn();
        STurn();
        i += 1;
      } else if (individualCase[i + 1] == "2") {
        FTurn();
        FTurn();
        STurn();
        STurn();
        i += 1;
      } else {
        FTurn();
        STurn();
      }
    } else if (individualCase[i] == "D") {
      if (individualCase[i + 1] == "'") {
        DTurn();
        DTurn();
        DTurn();
        i += 1;
      } else if (individualCase[i + 1] == "2") {
        DTurn();
        DTurn();
        i += 1;
      } else {
        DTurn();
      }
    } else if (individualCase[i] == "d") {
      if (individualCase[i + 1] == "'") {
        UTurn();
        UTurn();
        UTurn();
        yRotation();
        i += 1;
      } else if (individualCase[i + 1] == "2") {
        DTurn();
        DTurn();
        ETurn();
        ETurn();
        i += 1;
      } else {
        DTurn();
        ETurn();
      }
    } else if (individualCase[i] == "B") {
      if (individualCase[i + 1] == "'") {
        BTurn();
        BTurn();
        BTurn();
        i += 1;
      } else if (individualCase[i + 1] == "2") {
        BTurn();
        BTurn();
        i += 1;
      } else {
        BTurn();
      }
    } else if (individualCase[i] == "b") {
      if (individualCase[i + 1] == "'") {
        BTurn();
        BTurn();
        BTurn();
        STurn();
        i += 1;
      } else if (individualCase[i + 1] == "2") {
        BTurn();
        BTurn();
        STurn();
        STurn();
        i += 1;
      } else {
        FTurn();
        zRotation();
        zRotation();
        zRotation();
      }
    } else if (individualCase[i] == "L") {
      if (individualCase[i + 1] == "'") {
        LTurn();
        LTurn();
        LTurn();
        i += 1;
      } else if (individualCase[i + 1] == "2") {
        LTurn();
        LTurn();
        i += 1;
      } else {
        LTurn();
      }
    } else if (individualCase[i] == "l") {
      if (individualCase[i + 1] == "'") {
        RTurn();
        RTurn();
        RTurn();
        xRotation();
        i += 1;
      } else if (individualCase[i + 1] == "2") {
        LTurn();
        LTurn();
        MTurn();
        MTurn();
        i += 1;
      } else {
        LTurn();
        MTurn();
      }
    } else if (individualCase[i] == "M") {
      if (individualCase[i + 1] == "'") {
        MTurn();
        MTurn();
        MTurn();
        i += 1;
      } else if (individualCase[i + 1] == "2") {
        MTurn();
        MTurn();
        i += 1;
      } else {
        MTurn();
      }
    } else if (individualCase[i] == "E") {
      if (individualCase[i + 1] == "'") {
        ETurn();
        ETurn();
        ETurn();
        i += 1;
      } else if (individualCase[i + 1] == "2") {
        ETurn();
        ETurn();
        i += 1;
      } else {
        ETurn();
      }
    } else if (individualCase[i] == "S") {
      if (individualCase[i + 1] == "'") {
        STurn();
        STurn();
        STurn();
        i += 1;
      } else if (individualCase[i + 1] == "2") {
        STurn();
        STurn();
        i += 1;
      } else {
        STurn();
      }
    } else if (individualCase[i] == "x") {
      if (individualCase[i + 1] == "'") {
        xRotation();
        xRotation();
        xRotation();
        i += 1;
      } else if (individualCase[i + 1] == "2") {
        xRotation();
        xRotation();
        i += 1;
      } else {
        xRotation();
      }
    } else if (individualCase[i] == "y") {
      if (individualCase[i + 1] == "'") {
        yRotation();
        yRotation();
        yRotation();
        i += 1;
      } else if (individualCase[i + 1] == "2") {
        yRotation();
        yRotation();
        i += 1;
      } else {
        yRotation();
      }
    } else if (individualCase[i] == "z") {
      if (individualCase[i + 1] == "'") {
        zRotation();
        zRotation();
        zRotation();
        i += 1;
      } else if (individualCase[i + 1] == "2") {
        zRotation();
        zRotation();
        i += 1;
      } else {
        zRotation();
      }
    }
  }

  return cube;
}
