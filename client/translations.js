module.exports = {
  // translate(word, lang) {
  //   // const translation = `Translating ${word} into ${lang}`;
  //   // console.log(translation);
  //   console.log(word);
  //   console.log(lang);
  //   debugger;
  //   return 'Hi';
  // }
  translate: function(word, lang) {
    // const translation = `Translating ${word} into ${lang}`;
    // console.log(translation);
    console.log(word);
    // console.log(lang);
    debugger;
    return 'Hi';
  }
}

// TODO: Make sure this is NOT getting parsed
export const translate = (word, lang = 'EN') => {
  const translation = `Translating ${word} into ${lang}`;
  console.log(translation);
  return 'Hi';
}
