export default function splitStringInclusive(str: string, splitter: string) {
  let lastLetterPushed = -1;
  const values = [];

  for (let i = 0; i < str.length; i++) {
    let foundMatch = true;

    for (let j = 0; j < splitter.length; j++) {
      if (!foundMatch) {
        break;
      }
      if (str[i + j] !== splitter[j]) {
        foundMatch = false;
      }
    }

    if (foundMatch) {
      const matchStarts = i;
      const matchEnds = i + splitter.length - 1;
      if (matchStarts > lastLetterPushed + 1) {
        values.push(str.substring(lastLetterPushed + 1, matchStarts));
      }
      values.push(str.substring(matchStarts, matchEnds + 1));
      lastLetterPushed = matchEnds;
    }
  }
  if (lastLetterPushed !== str.length - 1) {
    values.push(str.substring(lastLetterPushed + 1, str.length));
  }

  return values;
}
