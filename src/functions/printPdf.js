const db = require('../../database/models')
const ejs = require('ejs')
const fs = require('fs')
const pdfcrowd = require('pdfcrowd')

const printPdf = {
    printPdf: async(cssFilePath,ejsFilePath,pdfFilePath) => {
        try{
            
            

            const cssContent = fs.readFileSync(cssFilePath, 'utf-8')
            const html = await ejs.renderFile(ejsFilePath, data);

            // Combine the HTML with the CSS
            const finalHtml = `<html><head><style>${cssContent}</style></head><body>${html}</body></html>`

            client.convertStringToFile(finalHtml, pdfFilePath, (err) => {
            if (err) {
                console.error('Error al generar el PDF:', err);
                return res.status(500).send('Error al generar el PDF');
            }

            res.set('Content-Disposition', 'attachment; filename=result.pdf');
            res.set('Content-Type', 'application/pdf');
            const pdfStream = fs.createReadStream(pdfFilePath);
            pdfStream.pipe(res);

            pdfStream.on('end', () => {
                fs.unlinkSync(pdfFilePath);
              })
            })
        }catch(error){
            return res.send('Ha ocurrido un error')
        }
    }
}

module.exports = printPdf