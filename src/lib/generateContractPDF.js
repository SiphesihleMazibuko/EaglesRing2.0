import htmlPdf from 'html-pdf-node';

// Function to generate HTML for the contract
export function generateContractHTML(investorEmail, entrepreneurEmail, companyName, amount, investorName, entrepreneurName) {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-UK', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });

  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #ccc;
            padding: 30px;
          }

          h1, h2 {
            text-align: center;
            color: #333;
          }

          .section-title {
            font-size: 18px;
            font-weight: bold;
            margin-top: 20px;
            margin-bottom: 10px;
            border-bottom: 1px solid #ccc;
          }

          p {
            margin: 10px 0;
          }

          .details {
            font-size: 14px;
            line-height: 1.8;
          }

          .signature-block {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
          }

          .signature-block div {
            width: 45%;
          }

          .signature-line {
            margin-top: 50px;
            border-top: 1px solid #000;
            text-align: center;
            padding-top: 5px;
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <h1>Investment Agreement</h1>

        <p>
          This Investment Agreement ("Agreement") is made and entered into as of <strong>${formattedDate}</strong> by and between:
        </p>

        <div class="section-title">Parties Involved</div>

        <p class="details">
          <strong>Investor:</strong> ${investorName}, with email address: ${investorEmail}.<br />
          <strong>Entrepreneur:</strong> ${entrepreneurName}, with email address: ${entrepreneurEmail}.<br />
          <strong>Company:</strong> ${companyName}.
        </p>

        <div class="section-title">Investment Details</div>

        <p class="details">
          <strong>Investment Amount:</strong> R${amount}<br />
          <strong>Company Name:</strong> ${companyName}<br />
          <strong>Date of Investment:</strong> ${formattedDate}
        </p>

        <div class="section-title">Terms and Conditions</div>

        <p class="details">
          1. <strong>Purpose of Investment:</strong> The investment is being made for the purpose of funding ${companyName} to develop and grow the business.<br />
          2. <strong>Use of Funds:</strong> The Entrepreneur agrees to use the funds solely for the growth and development of the company as outlined in the project proposal.<br />
          3. <strong>Return on Investment:</strong> The Investor will be entitled to 25% as agreed upon by both parties.<br />
          4. <strong>Confidentiality:</strong> Both parties agree to keep the details of this Agreement confidential unless disclosure is required by law.<br />
          5. <strong>Termination:</strong> This Agreement may be terminated by mutual agreement or if either party breaches any of its obligations under this Agreement.
        </p>

        <div class="section-title">Signatures</div>

        <p>
          IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the date first above written.
        </p>

        <div class="signature-block">
          <div>
            <p class="signature-line">${investorName}</p>
            <p style="text-align: center;">Investor Signature</p>
          </div>
          <div>
            <p class="signature-line">${entrepreneurName}</p>
            <p style="text-align: center;">Entrepreneur Signature</p>
          </div>
        </div>

        <p class="signature-line">Eagles Ring</p>
        <p style="text-align: center;">Company Signature</p>
      </body>
    </html>
  `;
}

// Function to generate PDF from HTML
export async function generateContractPDF(investorEmail, entrepreneurEmail, companyName, amount, investorName, entrepreneurName) {
  const options = { format: 'A4' };

  // Generate HTML
  const html = generateContractHTML(investorEmail, entrepreneurEmail, companyName, amount, investorName, entrepreneurName);

  // Generate PDF Buffer from HTML
  const pdfBuffer = await htmlPdf.generatePdf({ content: html }, options);

  return pdfBuffer;
}
