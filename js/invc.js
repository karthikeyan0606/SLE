
let serialNumber = 2;

// Set current date
document.getElementById("currentDate").textContent = new Date().toLocaleDateString();




// Generate a random bill number
const year = new Date().getFullYear();
const randomBillNumber = `${year}-${Math.floor(10000 + Math.random() * 90000)}`;
document.getElementById("billNo").textContent = randomBillNumber;


// Function to add cargo items
function addCargoItem() {
    const newRow = document.createElement('tr');
    const itemCount = document.querySelectorAll('.itemSerialNumber').length + 1;
    newRow.innerHTML = `
        <td><input type="text" class="form-control itemSerialNumber" value="${itemCount}" readonly></td>
        <td>
            <input type="text" class="form-control itemDescription" placeholder="Enter Item Description" required>
            <span class="itemDescriptionError text-danger" style="display: none;">* Description is required</span>
        </td>
        <td>
            <input type="number" class="form-control itemQuantity" placeholder="Enter Quantity" oninput="calculateTotal(this)" required>
            <span class="itemQuantityError text-danger" style="display: none;">* Quantity is required</span>
        </td>
        <td>
            <input type="text" class="form-control itemUnit" placeholder="Enter Unit" required>
            <span class="itemUnitError text-danger" style="display: none;">* Unit is required</span>
        </td>
        <td>
            <input type="text" class="form-control hsnCode" placeholder="Enter HSN Code" required>
            <span class="hsnCodeError text-danger" style="display: none;">* HSN Code is required</span>
        </td>
        <td>
            <input type="number" class="form-control gstPercentage" placeholder="GST %" oninput="calculateTotal(this)" required>
            <span class="gstPercentageError text-danger" style="display: none;">* GST % is required</span>
        </td>
        <td>
            <input type="number" class="form-control unitPrice" placeholder="Price" oninput="calculateTotal(this)" required>
            <span class="unitPriceError text-danger" style="display: none;">* Unit Price is required</span>
        </td>
        <td><input type="text" class="form-control itemTotal" readonly></td>
    `;
    document.getElementById('cargoItemsSection').appendChild(newRow);
}





function calculateTotal(element) {
    const row = element.closest("tr");
    const quantity = parseFloat(row.querySelector(".itemQuantity").value) || 0;
    const unitPrice = parseFloat(row.querySelector(".unitPrice").value) || 0;
    const gstPercentage = parseFloat(row.querySelector(".gstPercentage").value) || 0;

    // Calculate total without GST
    let total = quantity * unitPrice;

    // Add GST to the total
    const gstAmount = (total * gstPercentage) / 100;
    total += gstAmount;

    // Set the calculated total in the itemTotal field
    row.querySelector(".itemTotal").value = total.toFixed(2);

    // Update grand total
    updateGrandTotal();
}








// Update grand total by summing up all item totals
function updateGrandTotal() {
    let grandTotal = 0;

    // Loop through all itemTotal fields to sum up the grand total
    document.querySelectorAll(".itemTotal").forEach(itemTotalField => {
        grandTotal += parseFloat(itemTotalField.value) || 0;
    });

    // Set the grand total
    document.getElementById("grandTotal").innerText = grandTotal.toFixed(2);

    // Convert grand total to words (optional)
    document.getElementById("grandTotalWords").innerText = numberToWords(grandTotal);
}







function numberToWords(number) {
    const units = ['', 'Thousand', 'Lakh', 'Crore'];
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    if (number === 0) return 'Zero Rupees Only';

    let [rupees, paise] = number.toFixed(2).split('.'); // Split the rupee and paise parts
    rupees = parseInt(rupees);
    paise = parseInt(paise);

    function convertToWords(num) {
        let numStr = num.toString();
        let numWords = '';
        let position = 0;

        while (numStr.length > 0) {
            let part = 0;
            if (position === 1 || position >= 2) {
                part = parseInt(numStr.slice(-2));
                numStr = numStr.slice(0, -2);
            } else {
                part = parseInt(numStr.slice(-3));
                numStr = numStr.slice(0, -3);
            }

            if (part > 0) {
                let partWords = '';

                if (part >= 100) {
                    partWords += ones[Math.floor(part / 100)] + ' Hundred ';
                    part %= 100;
                }

                if (part >= 20) {
                    partWords += tens[Math.floor(part / 10)] + ' ';
                    part %= 10;
                } else if (part >= 10) {
                    partWords += teens[part - 10] + ' ';
                    part = 0;
                }

                partWords += ones[part];
                numWords = partWords.trim() + ' ' + units[position] + ' ' + numWords;
            }

            position++;
        }

        return numWords.trim();
    }

    // Convert rupees part
    let rupeesInWords = convertToWords(rupees);
    rupeesInWords = rupeesInWords ? rupeesInWords + ' Rupees' : '';

    // Convert paise part, if any
    let paiseInWords = paise > 0 ? convertToWords(paise) + ' Paise' : '';

    // Combine rupees and paise in words
    return (rupeesInWords + ' and  ' + paiseInWords).trim() + ' Only';
}


function updateGrandTotalWords() {
    const grandTotal = parseFloat(document.getElementById('grandTotal').textContent) || 0;
    document.getElementById('grandTotalWords').textContent = numberToWords(grandTotal);
}






// Call updateGrandTotalWords whenever grand total is updated
window.onload = updateGrandTotalWords;



// function saveData() {
//     const items = [];
//     document.querySelectorAll('#cargoItemsTable tbody tr').forEach(row => {
//         const item = {
//             description: row.querySelector('.itemDescription').value,
//             quantity: row.querySelector('.itemQuantity').value,
//             unit: row.querySelector('.itemUnit').value,
//             hsnCode: row.querySelector('.hsnCode').value,
//             unitPrice: row.querySelector('.unitPrice').value,
//             total: row.querySelector('.itemTotal').value
//         };
//         items.push(item);
//     });
//     const data = {
//         billNo: document.getElementById('billNo').textContent,
//         date: document.getElementById('currentDate').textContent,
//         transport: document.getElementById('transport').value,
//         pol: document.getElementById('pol').value,
//         pod: document.getElementById('pod').value,
//         grandTotal: document.getElementById('grandTotal').textContent,
//         grandTotalWords: document.getElementById('grandTotalWords').textContent,
//         items
//     };
//     console.log("Saved Data: ", JSON.stringify(data, null, 2));
// }











// // *****************************
// // DOWNLOAD PDF
// function downloadPDF() {
//     // Save current input values
//     const inputs = document.querySelectorAll('input, textarea');
//     const values = Array.from(inputs).map(input => input.value);

//     // Replace input fields with their values for PDF view
//     inputs.forEach((input, index) => {
//         const span = document.createElement("span");
//         span.textContent = values[index];
//         span.style.display = "block";
//         span.className = "pdf-text";
//         input.parentNode.replaceChild(span, input);
//     });

//     // Hide unnecessary elements like buttons
//     document.querySelectorAll("button").forEach(button => button.style.display = "none");

//     // Hide table borders and show text as selectable
//     document.querySelectorAll("table").forEach(table => {
//         table.style.border = "none";
//         table.querySelectorAll("tr, td, th").forEach(cell => {
//             cell.style.border = "none";
//             cell.style.padding = "2px 0"; // Adjust for better layout
//         });
//     });

//     // Get bill number for the filename
//     const billNumber = document.getElementById('billNo').textContent || "invoice";

//     // Set up options for PDF generation with bill number as filename
//     const options = {
//         margin: 0.5,
//         filename: `${billNumber}.pdf`,  // Use bill number as filename
//         image: { type: 'jpeg', quality: 0.98 },
//         html2canvas: { scale: 2 },
//         jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
//     };

//     // Generate PDF
//     html2pdf().from(document.body).set(options).save().then(() => {
//         // Restore original elements after PDF generation
//         document.querySelectorAll(".pdf-text").forEach((span, index) => {
//             const input = document.createElement(inputs[index].tagName.toLowerCase());
//             input.value = span.textContent;
//             input.className = inputs[index].className;
//             input.type = inputs[index].type;
//             span.parentNode.replaceChild(input, span);
//         });

//         // Show hidden elements
//         document.querySelectorAll("button").forEach(button => button.style.display = "inline-block");

//         // Restore table borders
//         document.querySelectorAll("table").forEach(table => {
//             table.style.border = ""; // Reset table borders
//             table.querySelectorAll("tr, td, th").forEach(cell => {
//                 cell.style.border = ""; // Reset cell borders
//                 cell.style.padding = ""; // Reset padding
//             });
//         });
//     });
// }






function downloadPDF() {
    // Retrieve bill number for the file name
    const billNo = document.getElementById("billNo").value || "SLE-Invoice";

    // Save input values to replace for PDF
    const inputs = document.querySelectorAll('input, textarea');
    const values = Array.from(inputs).map(input => input.value);

    // Replace inputs with span elements for PDF view
    inputs.forEach((input, index) => {
        const span = document.createElement("span");
        span.textContent = values[index];
        span.className = "pdf-text";
        input.parentNode.replaceChild(span, input);
    });

    // Hide unnecessary elements like buttons for a clean PDF view
    document.querySelectorAll("button").forEach(button => button.style.display = "none");

    // Format Cargo Items Table (ensure all rows are populated with values)
    const rows = document.querySelectorAll("#cargoItemsTable tbody tr");
    rows.forEach(row => {
        const cells = row.querySelectorAll("td input");
        cells.forEach(cell => {
            const span = document.createElement("span");
            span.textContent = cell.value;
            span.className = "pdf-text";
            cell.parentNode.replaceChild(span, cell);
        });
    });

    // Calculate and display Grand Total
    let grandTotal = 0;
    document.querySelectorAll('.itemTotal').forEach(totalCell => {
        grandTotal += parseFloat(totalCell.textContent || totalCell.value || "0");
    });
    document.getElementById("grandTotal").textContent = grandTotal.toFixed(2);
    document.getElementById("grandTotalWords").textContent = convertNumberToWords(grandTotal) + " rupees";

    // Set options for PDF generation, using billNo as the file name
    const options = {
        margin: 0.5,
        filename: `${billNo}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    // Generate and save PDF
    html2pdf().from(document.body).set(options).save().then(() => {
        // Restore original elements after PDF generation
        document.querySelectorAll(".pdf-text").forEach((span, index) => {
            const input = document.createElement(inputs[index].tagName.toLowerCase());
            input.value = span.textContent;
            input.className = inputs[index].className;
            span.parentNode.replaceChild(input, span);
        });

        // Show hidden elements
        document.querySelectorAll("button").forEach(button => button.style.display = "inline-block");
    }).catch(error => {
        console.error("PDF generation failed:", error);
        alert("Failed to download PDF. Please try again or check your browser settings.");
    });
}



// Call updateGrandTotalWords whenever grand total is updated
window.onload = updateGrandTotalWords;












function validateForm() {
    let isValid = true;

    // Customer Details
    const cname = document.getElementById('cname');
    const address = document.getElementById('address');
    const mobile = document.getElementById('mobile');
    const email = document.getElementById('email');

    // Bill No. Validation
    const billNo = document.getElementById('billNo');

    if (billNo.value.trim() === "") {
        document.getElementById('billNoError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('billNoError').style.display = 'none';
    }

    if (cname.value.trim() === "") {
        document.getElementById('nameError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('nameError').style.display = 'none';
    }

    if (address.value.trim() === "") {
        document.getElementById('addressError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('addressError').style.display = 'none';
    }

    if (mobile.value.trim() === "") {
        document.getElementById('mobileError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('mobileError').style.display = 'none';
    }

    if (email.value.trim() === "" || !email.value.includes('@')) {
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('emailError').style.display = 'none';
    }

    // Port Information
    const pol = document.getElementById('pol');
    const pod = document.getElementById('pod');

    if (pol.value.trim() === "") {
        document.getElementById('polError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('polError').style.display = 'none';
    }

    if (pod.value.trim() === "") {
        document.getElementById('podError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('podError').style.display = 'none';
    }






    // Validate cargo items
    const cargoRows = document.querySelectorAll('#cargoItemsSection tr');
    cargoRows.forEach(row => {
        const itemDescription = row.querySelector('.itemDescription');
        const itemQuantity = row.querySelector('.itemQuantity');
        const itemUnit = row.querySelector('.itemUnit');
        const hsnCode = row.querySelector('.hsnCode');
        const unitPrice = row.querySelector('.unitPrice');

        if (itemDescription.value.trim() === "") {
            row.querySelector('.itemDescriptionError').style.display = 'block';
            isValid = false;
        } else {
            row.querySelector('.itemDescriptionError').style.display = 'none';
        }

        if (itemQuantity.value.trim() === "") {
            row.querySelector('.itemQuantityError').style.display = 'block';
            isValid = false;
        } else {
            row.querySelector('.itemQuantityError').style.display = 'none';
        }

        if (itemUnit.value.trim() === "") {
            row.querySelector('.itemUnitError').style.display = 'block';
            isValid = false;
        } else {
            row.querySelector('.itemUnitError').style.display = 'none';
        }

        if (hsnCode.value.trim() === "") {
            row.querySelector('.hsnCodeError').style.display = 'block';
            isValid = false;
        } else {
            row.querySelector('.hsnCodeError').style.display = 'none';
        }

        if (unitPrice.value.trim() === "") {
            row.querySelector('.unitPriceError').style.display = 'block';
            isValid = false;
        } else {
            row.querySelector('.unitPriceError').style.display = 'none';
        }
    });

    if (isValid) {
        alert("Ready to download")
    }
}







// Add event listeners to hide error messages on input
const inputs = document.querySelectorAll('input[type="text"], input[type="number"], input[type="email"]');
inputs.forEach(input => {
    input.addEventListener('input', function () {
        const errorSpan = document.getElementById(input.id + 'Error');
        if (errorSpan) {
            errorSpan.style.display = 'none'; // Hide error message on input
        }
    });
});











function downloadExcel() {
    // Address and other top center details
    const companyDetails = [
        ["NO 82/165 Thambu Chetty Street,"],
        ["Opposite CHANKU BRAND, CHENNAI-600 001"],
        ["Mobile NO - 90439 16809"],
        ["GST : 33BITPB8596E1ZV"],
        ["LUT : AD330224019030Z | IE CODE : BITPB8596E"],
        ["AD CODE : 2010211-9000009"]
    ];

    // Customer Details
    const customerName = document.getElementById("cname").value;
    const address = document.getElementById("address").value;
    const mobile = document.getElementById("mobile").value;
    const email = document.getElementById("email").value;
    const transport = document.getElementById("transport").value;
    const pol = document.getElementById("pol").value;
    const pod = document.getElementById("pod").value;

    // Cargo Items
    const cargoItems = [];
    document.querySelectorAll("#cargoItemsSection tr").forEach((row, index) => {
        const itemDescription = row.querySelector(".itemDescription").value;
        const itemQuantity = row.querySelector(".itemQuantity").value;
        const itemUnit = row.querySelector(".itemUnit").value;
        const hsnCode = row.querySelector(".hsnCode").value;
        const gstPercentage = row.querySelector(".gstPercentage").value;
        const unitPrice = row.querySelector(".unitPrice").value;
        const itemTotal = row.querySelector(".itemTotal").value;

        cargoItems.push([
            index + 1, itemDescription, itemQuantity, itemUnit, hsnCode, gstPercentage, unitPrice, itemTotal
        ]);
    });

    // Bank Details
    const bankDetails = [
        ["Bank Name", document.getElementById("bankName").value],
        ["Account Holder", document.getElementById("accountHolder").value],
        ["Account Number", document.getElementById("accountNumber").value],
        ["IFSC Code", document.getElementById("ifscCode").value],
        ["SWIFT Code", document.getElementById("swiftCode").value]
    ];

    // Create a new workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
        ...companyDetails,  // Top center details
        [],
        ["Customer Details"],
        ["Name", customerName],
        ["Address", address],
        ["Mobile", mobile],
        ["Email", email],
        ["Transport", transport],
        ["POL (Port of Loading)", pol],
        ["POD (Port of Discharge)", pod],
        [],
        ["Cargo Items"],
        ["S. No", "Description of Goods", "Quantity", "Unit", "HSN Code", "GST %", "Unit Price (INR)", "Total (INR)"],
        ...cargoItems,
        [],
        ["Bank Details"],
        ...bankDetails
    ]);

    // Set column widths for readability
    ws['!cols'] = [
        { wch: 10 },  // S. No
        { wch: 30 },  // Description of Goods
        { wch: 10 },  // Quantity
        { wch: 10 },  // Unit
        { wch: 15 },  // HSN Code
        { wch: 10 },  // GST %
        { wch: 15 },  // Unit Price (INR)
        { wch: 20 }   // Total (INR)
    ];

    // Style the header cells to be bold
    const boldCells = [
        { cell: "A1", text: "NO 82/165 Thambu Chetty Street," },
        { cell: "A2", text: "Opposite CHANKU BRAND, CHENNAI-600 001" },
        { cell: "A3", text: "Mobile NO - 90439 16809" },
        { cell: "A4", text: "GST : 33BITPB8596E1ZV" },
        { cell: "A5", text: "LUT : AD330224019030Z | IE CODE : BITPB8596E" },
        { cell: "A6", text: "AD CODE : 2010211-9000009" },
        { cell: "A8", text: "Customer Details" },
        { cell: "A17", text: "Cargo Items" },
        // { cell: "A19", text: "S. No" },
        // { cell: "B19", text: "Description of Goods" },
        // { cell: "C19", text: "Quantity" },
        // { cell: "D19", text: "Unit" },
        // { cell: "E19", text: "HSN Code" },
        // { cell: "F19", text: "GST %" },
        // { cell: "G19", text: "Unit Price (INR)" },
        // { cell: "H19", text: "Total (INR)" },
        { cell: "A21", text: "Bank Details" }
    ];

    // Apply bold font style to headers
    boldCells.forEach(({ cell, text }) => {
        ws[cell] = { v: text, s: { font: { bold: true } } };
    });

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Invoice Data");

    // Use the bill number for the file name
    const billNo = document.getElementById("billNo").value || "InvoiceData";
    const fileName = `${billNo}.xlsx`;

    // Download the Excel file
    XLSX.writeFile(wb, fileName);
}


















































































// function downloadPDF() {
//     // Save current input values
//     const inputs = document.querySelectorAll('input, textarea');
//     const values = Array.from(inputs).map(input => input.value);

//     // Replace input fields with their values for PDF view
//     inputs.forEach((input, index) => {
//         const span = document.createElement("span");
//         span.textContent = values[index];
//         span.style.display = "block";
//         span.className = "pdf-text";
//         input.parentNode.replaceChild(span, input);
//     });

//     // Hide unnecessary elements like buttons
//     document.querySelectorAll("button").forEach(button => button.style.display = "none");

//     // Add watermark logo
//     const watermark = document.createElement("img");
//     watermark.src = 'images/logo2.png'; // Replace with the path to your logo
//     watermark.className = "watermark";
//     watermark.style.position = "fixed";
//     watermark.style.top = "50%";
//     watermark.style.left = "50%";
//     watermark.style.transform = "translate(-50%, -50%)";
//     watermark.style.opacity = "0.1"; // Set transparency
//     watermark.style.width = "80%";   // Adjust as needed
//     watermark.style.pointerEvents = "none"; // Prevents interaction
//     document.body.appendChild(watermark);

//     // Set up options for pdf generation
//     const options = {
//         margin: 0.5,
//         filename: 'invoice.pdf',
//         image: { type: 'jpeg', quality: 0.98 },
//         html2canvas: { scale: 2 },
//         jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
//     };

//     // Generate PDF
//     html2pdf().from(document.body).set(options).save().then(() => {
//         // Restore original elements after PDF generation
//         document.querySelectorAll(".pdf-text").forEach((span, index) => {
//             const input = document.createElement(inputs[index].tagName.toLowerCase());
//             input.value = span.textContent;
//             input.className = inputs[index].className;
//             input.type = inputs[index].type;
//             span.parentNode.replaceChild(input, span);
//         });

//         // Show hidden elements
//         document.querySelectorAll("button").forEach(button => button.style.display = "inline-block");

//         // Remove the watermark
//         watermark.remove();
//     });
// }


