module.exports = {
  translate: function(word, lang = 'EN') {
    const translation = `Translating ${word} into ${lang}`;
    console.log(translation);
    return translation;
  }
}
