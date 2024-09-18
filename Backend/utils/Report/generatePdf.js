
const PDFDocument = require('pdfkit');
const fs = require('fs');

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
    });
  },

  // Function to check if the path is an image (based on file extension)
  isImage: (filePath) => {
    return /\.(png|jpg|jpeg)$/i.test(filePath);
  },

  // Function to handle rendering images for answers with height management
  // renderImages: (doc, images) => {
  //   const pageHeight = doc.page.height;
  //   const margin = 50;
  //   const footerHeight = 60;
  //   const maxImageHeight = 400;  // Maximum height for each image

  //   images.forEach(imagePath => {
  //     if (PDFUtils.isImage(imagePath)) {
  //       // Calculate the remaining space on the page
  //       const availableHeight = pageHeight - doc.y - footerHeight - margin;

  //       // If the image doesn't fit in the remaining space, start a new page
  //       if (availableHeight < maxImageHeight) {
  //         doc.addPage();
  //       }

  //       // Render the image
  //       doc.image(imagePath, { fit: [500, maxImageHeight], align: 'center' });
        

  //       // Add some spacing after the image
  //       doc.moveDown(1);  // Ensure there's enough gap between images or other content
  //     }
  //   });
  // },

  renderImages: (doc, images) => {
    const pageHeight = doc.page.height;
    const margin = 50;
    const footerHeight = 60;
    const maxImageHeight = 300;  // Maximum height for each image
  
    images.forEach(imagePath => {
      if (PDFUtils.isImage(imagePath)) {
        // Calculate the remaining space on the page
        const availableHeight = pageHeight - doc.y - footerHeight - margin;
  
        // If the image doesn't fit in the remaining space, start a new page
        if (availableHeight < maxImageHeight) {
          doc.addPage();
        }
  
        // Render the image
        doc.image(imagePath, { fit: [500, maxImageHeight], align: 'center' });
  
        // Add 400 units of vertical space after the image
        const spaceAfterImage = 300;
  
        // Check if adding space would cause overflow, if so, move to new page
        if (pageHeight - doc.y - footerHeight - margin < spaceAfterImage) {
          doc.addPage();
        } else {
          doc.y += spaceAfterImage; // Manually add 400 units of space after the image
        }
      }
    });
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

      // questions.forEach((question, index) => {
      //   const questionText = `Q${question.index + 1}. ${question.text}`;
      //   const answer = userResponse.responses[index].answer;

      //   doc.text(questionText, margin, y);
      //   y = doc.y + 10; // Update y to the current vertical position after adding question text

      //   // Check if the answer is an image or array of images
      //   if (Array.isArray(answer) && answer.every(a => PDFUtils.isImage(a))) {
      //     PDFUtils.renderImages(doc, answer); // Render all images
      //   } else if (PDFUtils.isImage(answer)) {
      //     PDFUtils.renderImages(doc, [answer]); // Render the single image
      //   } else {
      //     // Render text answer if it's not an image
      //     const responseText = `Ans: ${Array.isArray(answer) ? answer.join(", ") : answer}`;
      //     doc.text(responseText, { align: 'left', continued: false });
      //   }

      //   y = doc.y + 10; // Update y to the current vertical position after adding response text or image
      // });

      questions.forEach((question, index) => {
        const questionText = `Q${question.index + 1}. ${question.text}`;
        const answer = userResponse.responses[index]?.answer; // Safely access the answer
      
        doc.text(questionText, margin, y);
        y = doc.y + 10; // Update y to the current vertical position after adding question text
      
        // Check if the answer is missing or empty
        if (!answer) {
          doc.text('No response submitted', { align: 'left', continued: false });
        }
        // Check if the answer is an array of images
        else if (Array.isArray(answer) && answer.every(a => PDFUtils.isImage(a))) {
          PDFUtils.renderImages(doc, answer); // Render all images
        }
        // Check if the answer is a single image
        else if (PDFUtils.isImage(answer)) {
          PDFUtils.renderImages(doc, [answer]); // Render the single image
        } 
        // Render text answer if it's not an image
        else {
          const responseText = `Ans: ${Array.isArray(answer) ? answer.join(", ") : answer}`;
          doc.text(responseText, { align: 'left', continued: false });
        }
      
        y = doc.y + 10; // Update y to the current vertical position after adding response text or image
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
