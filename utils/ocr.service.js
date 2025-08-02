const Tesseract =require('tesseract.js') ;

const extractTextFromImage = async (imagePath) => {
  const result = await Tesseract.recognize(imagePath, 'eng', {
    tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz .,/$:-',
    tessedit_pageseg_mode: Tesseract.PSM.SINGLE_BLOCK,
  });

  return result.data.text;
};

module.exports = {extractTextFromImage}