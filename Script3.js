// To do:
// Add "Clear Table" button
// Functionality for using specific pieces. The user inputs the pieces that they care about in the textarea.
// Unions list table. This will probably sit to the right of the main table.

let desiredStates = document.querySelector("#DesiredStates");
let finalStates = document.querySelector("#FinalStates");
let unionButton = document.querySelector("#unionButton");

let tableAlgList = [
  "(U2) R' U' R U R U R U' R' U R U R2 U' R2 U R",
  "(U2) R' U' R U' R U R2 U R2 U2 R'",
  "R U R2 F' R U2 R U' R' U' R' F R2 U' R'",
  "(U2) R U' R' U' R U2 R' U2 R U R' U2 R U R'",
  "R' U2 R2 U R' U R U2 R' U2 R' U2 R",
  "(U') R2 U R' U' R' U' R U2 R' U' R2 U' R2",
  "(U') R' U2 R U R' U R",
  "(U') R2 U' R2 U' R U2 R U' R' U' R U R2",
  "R U R2 U' R2 U' R2 U2 R2 U2 R'",
  "R U R' U R U2 R'",
  "R' F' U' F U R F U R U' R' F'",
  "(U') R2 U' R' U' R2 U R U R2 U R' U R",
  "(U2) F U' R' F R2 U R' U' R U R' U' F' R U R' F'",
  "(U) F R' U R U' F' U R' U' R",
  "(U') F U2 R' U' R F' R' U R F U2 F'",
  "R F' U F R F R' F' R' U' F R2 F' R",
  "(U) R' U' R U F U' R' U' R U F' R' U R",
  "(U) R' F2 R U R' F' U' F' R' F' R F U F' R",
  "(U') R' U2 F' R U R' U' R' F R U2 R",
  "(U') R' U' R' U' R F U' R' U2 R U F' R",
  "(U2) R U' R' U2 R' U2 R U R' U F R U R U' R' F'",
  "(U) F U F' U R F R' U' R F' R' F U' F'",
  "(U2) F' R' U' R F R' U2 R U F' R' U2 R F",
  "(U2) R U R' F' R U R' U R U' R' U' R' F R2 U' R'",
  "F R U R' U' F'",
];
let tableStatesList = [
  "M2 U M' U2 M U M2",
  "U M2 U M' U2 M U M2",
  "U2 M2 U M' U2 M U M2",
  "U' M2 U M' U2 M U M2",
  "M2 U' M' U2 M U' M2",
  "U M2 U' M' U2 M U' M2",
  "U2 M2 U' M' U2 M U' M2",
  "U' M2 U' M' U2 M U' M2",
  "U",
  "U2",
  "U'",
  "",
];
let involvedPieces = ["UFR", "UFL", "UBL", "UBR"];

// Create and add main table elements
let tableContainer = document.createElement("div");
let table = document.createElement("Table");
let thead = document.createElement("THead");
let tbody = document.createElement("TBody");

table.appendChild(thead);
table.appendChild(tbody);

tableContainer.id = "tableContainer";
tableContainer.append(table);
document.getElementById("Body").appendChild(tableContainer);

// Create and add top header
let row1 = document.createElement("tr");
let casesHeader = document.createElement("th");
casesHeader.innerHTML = "Cases";
casesHeader.colSpan = 4;
casesHeader.rowSpan = 2;
let statesHeader = document.createElement("th");
statesHeader.innerHTML = "Desired end states and resulting combinations";
statesHeader.colSpan = tableStatesList.length;
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
thead.appendChild(row1);

// Create and add secondary header that lists all desired states.
let row2 = document.createElement("tr");
// Loop through all of the desired states in the array and add each to this subheader.
for (s = 0; s < tableStatesList.length; s++) {
  let subHeading = document.createElement("th");
  subHeading.innerHTML = tableStatesList[s];
  subHeading.style = "box-shadow: inset 0 1px 0 white, inset 0 -1px 0 white";
  row2.appendChild(subHeading);
}

thead.appendChild(row2);

// Create and add all remaining rows.
// Adds case number, image, case alg, crossed cases, covered cases, and unions to each row
let casesCoverage = []; // An array to hold all of the covered cases. For use in the coverage and unions columns.
for (let row = 0; row < tableAlgList.length; row++) {
  let nextRow = document.createElement("tr");
  let caseNumber = document.createElement("td");
  caseNumber.innerHTML = row + 1;
  nextRow.appendChild(caseNumber);

  // Add 3D image of case.
  let image3D = document.createElement("td");
  let image3DSource =
    "<img src=http://cube.rider.biz/visualcube.php?fmt=png&bg=t&size=100&case=" +
    tableAlgList[row] +
    ">";
  /*image3D.innerHTML = image3DSource;*/
  nextRow.appendChild(image3D);

  // Add overhead image of case.
  let imageOverhead = document.createElement("td");
  let imageOverheadSource =
    "<img src=http://cube.rider.biz/visualcube.php?fmt=png&bg=t&size=100&view=plan&case=" +
    tableAlgList[row] +
    ">";
  /*imageOverhead.innerHTML = imageOverheadSource;*/
  nextRow.appendChild(imageOverhead);

  // Add covered cases list and list of cases the current case can union with.
  let rowCoverage = []; // Variable to push the covered cases for the current row.
  let alg = document.createElement("td");
  alg.innerHTML = tableAlgList[row];
  nextRow.appendChild(alg);
  for (let col = 0; col < tableStatesList.length; col++) {
    let crossedCase = document.createElement("td");
    //crossedCase.innerHTML = tableStatesList[col] + " " + tableAlgList[row];
    crossedCase.innerHTML = compareStates(
      tableStatesList[col],
      tableAlgList[row]
    );
    nextRow.appendChild(crossedCase);
    rowCoverage.push(compareStates(tableStatesList[col], tableAlgList[row])); // Add the current case to the row coverage.
  }
  //casesCoverage.push(rowCoverage); // Add the row coverage array to the main coverage array. This creates a table for later use.

  // Add list of covered cases to the "Cases this case covers" column.
  let coveredCases = document.createElement("td");
  coveredCases.innerHTML = findCoverage(row);
  nextRow.appendChild(coveredCases);
  casesCoverage.push(rowCoverage); // Add the row coverage array to the main coverage array. This creates an array for later use.

  // Add possible unions to each row.
  let unionsWith = document.createElement("td");
  unionsWith.innerHTML = findUnions(row);
  nextRow.appendChild(unionsWith);

  // Add the current row to the table.
  table.appendChild(nextRow);
}

/********************************************************************************/
/*****************************FIND COVERAGE FUNCTION*****************************/
/********************************************************************************/

function findCoverage(referenceNumber) {
  let findUnionsCasesCoverage = []; // Variable to hold all covered cases for each row.
  // Loop through the total number of algs in the user input list
  for (let row = 0; row < tableAlgList.length; row++) {
    let findUnionsRowCoverage = []; // Variable to push the covered cases for the current row.
    for (let col = 0; col < tableStatesList.length; col++) {
      findUnionsRowCoverage.push(
        compareStates(tableStatesList[col], tableAlgList[row])
      ); // Add the current case to the row coverage.
    }
    findUnionsCasesCoverage.push(findUnionsRowCoverage); // Add the row coverage array to the main coverage array. This creates an array for later use.
  }

  // Return the covered cases for the row.
  // The array is converted to a set to remove duplicates. Then converted back into an array then to a string.
  // The string has spaces added after commas and is sorted numerically.
  return String(
    [...new Set(findUnionsCasesCoverage[referenceNumber])].sort(function (
      a,
      b
    ) {
      return a - b;
    })
  ).replace(/,/g, ", ");

  //return findUnionsCasesCoverage[referenceNumber];
}

/********************************************************************************/
/*****************************FIND UNIONS FUNCTION*****************************/
/********************************************************************************/

function findUnions(referenceNumber) {
  let findUnionsCasesCoverage = [];

  for (let row = 0; row < tableAlgList.length; row++) {
    let findUnionsRowCoverage = []; // Variable to push the covered cases for the current row.
    for (let col = 0; col < tableStatesList.length; col++) {
      findUnionsRowCoverage.push(
        compareStates(tableStatesList[col], tableAlgList[row])
      ); // Add the current case to the row coverage.
    }
    findUnionsCasesCoverage.push(findUnionsRowCoverage); // Add the row coverage array to the main coverage array.
  }

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

  for (c = 0; c < allCases.length; c++) {
    allCases[c] = [...new Set(allCases[c].flat())].sort(function (a, b) {
      return a - b;
    });
    allCases[c] = allCases[c].filter(
      (x) => !findUnionsCasesCoverage[c].includes(x)
    );
    allCases[c] = String(allCases[c]).replace(/,/g, ", ");
  }

  let unions = [];

  return allCases[referenceNumber];

  /*String(
    [...new Set(allCases[u].flat())].sort(function (a, b) {
      return a - b;
    })
  ).replace(/,/g, ", ");*/
}

function compareStates(desiredState, alg) {
  let combo = getInverse(desiredState) + " " + getInverse(alg);
  let noAUF = combo;
  let UAUF = "U " + combo;
  let U2AUF = "U2 " + combo;
  let UPAUF = "U' " + combo;
  let caseNumber = 0;

  for (i = 0; i < tableAlgList.length; i++) {
    let caseState = String(applyAlg(getInverse(tableAlgList[i])));
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

// **********Create new function which has two parameters.**********
// These two parameters are two algs. An alg from the states list and an alg from the cases list.
// Step 1. It inverses the states list alg, duplicates it to have four copies, and adds nothing, U, U', and U2.
// Step 2. It inverses the cases list alg
// Step 3. It combines each of the four inverse states list algs + AUFs with the inverse of the cases list alg.
// Step 4. It duplicates the result from step 3 to have four copies.
// Step 5. It adds nothing, U, U', and U2 to the four copies to find the possible pre-AUF positions.
// Step 6. It runs the algs from step 5 through the applyAlg function to get their cube states.
// Step 7. It compares these states with all of the algs from the main cases list to find a match.
// Step 8. The states are compared using only the involved pieces that the user will input in a textarea.
//      Might only need to compare the positions of those specific stickers that were input.
//      Maybe no need to find RFU, and FUR if somone input UFR for example.
// Step 9. It returns the position number in the cases list that matched.
// Have the table code above run each column and row element intersection through this function.
// Display the position number from this new function in the intersecting cell.
// In the table code, store the position number in an array so that it can be used later for the covered cases and unions.

// Function to apply an alg and alter a cube state.
function applyAlg(individualCase) {
  // Represent cube using the 54 individual stickers.
  // The 9 stickers of each face go in a spiral starting at a corner and ending with the center.
  // Each face of 9 stickers has its own array. This makes 6 arrays contained in one overall array.
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

unionButton.addEventListener("click", () => {
  //**********Comment out the below code. Use it to pull the input from the boxes and call the appropriate functions.**********/
  let cases = document.getElementById("Cases").value.split("\n");

  let finalStates = [];
  let finalStatesSymmetries = [];

  for (let i = 0; i < cases.length; i++) {
    //finalStatesSymmetries;
    //call function to combine the inverse of the desired states with the inverse of the cases. Use this to create the finalStates variable.
    //call inversal function on finalStates;
    finalStates.push(applyAlg(cases[i]));
    alert(getInverse(cases[i]));
  }

  desiredStates.value = finalStates.join("\n");

  //Test placing things from desired states box into new box. The code works.
  /*
  let desiredStates = document
    .getElementById("DesiredStates")
    .value.split("\n");
  let statesTest = [];

  //Test splitting the Desired States text area.
  //let desiredStates = desiredStates.value.split("\n");
  for (let d = 0; d < desiredStates.length; d++) {
    statesTest.push(desiredStates[d]);
  }

  finalStates.value = statesTest;*/

  //Test pusing to a textarea with algs in a separate line. Implemented into finalStates stuff above.
  /*let pushTest = [];
  pushTest.push("R U R' U R U2 R'");
  pushTest.push("U2 R U");
  desiredStates.value = pushTest.join("\n");*/
});
