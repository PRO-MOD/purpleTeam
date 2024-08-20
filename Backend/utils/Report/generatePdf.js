const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const PDFUtils = {
  // Function to add header and footer to each page
  addTemplate: (doc, header, footer) => {
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    if (header && header.imagePath) {
      doc.image(header.imagePath, 0, 0, { width: pageWidth, height: header.height || 60 });
      doc.moveDown();
    }

    if (footer && footer.imagePath) {
      doc.image(footer.imagePath, 0, pageHeight - (footer.height || 60), { width: pageWidth, height: footer.height || 60 });
    }
  },

  // Function to add content on the first page or last page
  addSpecialPageContent: (doc, pageConfigs) => {
    pageConfigs.forEach(pageConfig => {
      if (pageConfig && pageConfig.text) {
        doc.text(pageConfig.text, { align: 'center', y: pageConfig.coordinateY || 200, margin: pageConfig.margin || 50 });
      }
    })
  },

  // Function to generate the PDF
  generatePDF: async (questions, userResponse, outputFilePath, headerImagePath, footerImagePath, firstPageConfig, lastPageConfig, enablePageNumber) => {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const writeStream = fs.createWriteStream(outputFilePath);
      doc.pipe(writeStream);

      // Handle the first page content if configured
      if (firstPageConfig) {
        PDFUtils.addTemplate(doc, { imagePath: headerImagePath }, { imagePath: footerImagePath });
        PDFUtils.addSpecialPageContent(doc, firstPageConfig);
        doc.addPage(); // Start a new page after the first page
      }

      // Add template to the first content page
      PDFUtils.addTemplate(doc, { imagePath: headerImagePath }, { imagePath: footerImagePath });

      const margin = 50;
      const headerHeight = headerImagePath ? 60 : 60;
      const footerHeight = footerImagePath ? 60 : 60;
      let y = headerHeight + 10;

      doc.on('pageAdded', () => {
        PDFUtils.addTemplate(doc, { imagePath: headerImagePath }, { imagePath: footerImagePath }); // Add template for each new page
        y = headerHeight + 40;

      });

      questions.forEach((question, index) => {
        const questionText = `Q${question.index + 1}. ${question.text}`;
        const responseText = `Ans: ${Array.isArray(userResponse.responses[index].answer)
          ? userResponse.responses[index].answer.join(", ")
          : userResponse.responses[index].answer}`;

        doc.text(questionText, margin, y);
        y = doc.y + 10; // Update y to the current vertical position after adding question text

        doc.text(responseText, {
          align: 'left',
          continued: false // Ends the paragraph here
        });

        y = doc.y + 10; // Update y to the current vertical position after adding response text
      });

      // Handle the last page content if configured
      if (lastPageConfig) {
        doc.addPage();
        PDFUtils.addSpecialPageContent(doc, lastPageConfig);
      }

      doc.end();

      writeStream.on('finish', () => {
        resolve(outputFilePath);
      });

      writeStream.on('error', (err) => {
        reject(err);
      });
    });
  }
};

module.exports = PDFUtils;