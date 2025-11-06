document.addEventListener('DOMContentLoaded', () => {
  const h1 = document.getElementById('fade-in-h1');
  const p = document.getElementById('fade-in-p');
  const p2 = document.getElementById('fade-in-p2');
  const charDelay = 30;
  const wordDelay = 100;
  const startDelay = 500;

  const mobileMaxWidth = 768;
  let h1Text = h1.getAttribute('data-text'); // Liest den Text aus der EINEN Quelle

  if (window.innerWidth <= mobileMaxWidth) {
    // Ersetzt ALLE Bindestriche (-) durch Bindestrich und HTML-Umbruch (-<br>)
    // Der '/g' (global) Parameter stellt sicher, dass alle Vorkommen ersetzt werden.
    h1Text = h1Text.replace(/-/g, '-<br>');

    h1.setAttribute('data-text', h1Text); // Setzt den mobil-formatierten Text
  }

  function wrapChars(element, delay, startDelayOffset = 0) {
    const text = element.getAttribute('data-text');
    element.innerHTML = '';
    element.style.visibility = "visible";
    let charCounter = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      let span = document.createElement('span');
      span.className = 'fade-in-char';
      if (char === '<' && text.substring(i, i + 4) === '<br>') {
        element.appendChild(document.createElement('br'));
        i += 3;
        continue;
      } else if (char === ' ') {
        span.innerHTML = '&nbsp;';
      } else {
        span.innerHTML = char;
      }
      span.style.animationDelay = `${startDelayOffset + (charCounter * delay)}ms`;
      element.appendChild(span);
      charCounter++;
    }
    return charCounter;
  }

  function wrapWords(element, delay, startDelayOffset = 0) {
    const text = element.getAttribute('data-text');
    element.innerHTML = '';
    element.style.visibility = "visible";

    const preparedText = text.replace('[LINK_START:hsg][LINK_END]', 'HSG[LINK_END]');

    const words = preparedText.split(' ');
    let wordCounter = 0;
    let isInLink = false;

    const linkMap = {
      'hsg': 'https://unisg.ch'
    };

    words.forEach((word) => {
      if (word.length > 0) {
        let span = document.createElement('span');
        span.className = 'fade-in-word';

        let trailingSpace = '&nbsp;';

        let displayWord = word;
        let isLinkWord = false;
        let linkTarget = '';

        if (word.startsWith('[LINK_START:')) {
          isInLink = true;
          const match = word.match(/\[LINK_START:([^\]]+)\]/);
          if (match) {
            linkTarget = linkMap[match[1]];
          }
          displayWord = word.replace(/\[LINK_START:[^\]]+\]/, '');
        }

        if (word.endsWith('[LINK_END]')) {
          isInLink = false;
          displayWord = displayWord.replace('[LINK_END]', '');
          trailingSpace = '';
          if(word.includes('[LINK_START:')) {
            isLinkWord = true;
          }
        } else if (isInLink) {
          isLinkWord = true;
        }

        span.innerHTML = displayWord + trailingSpace;
        span.style.animationDelay = `${startDelayOffset + (wordCounter * delay)}ms`;

        if (isLinkWord || word.includes('[LINK_END]')) {
          let linkElement = document.createElement('a');
          linkElement.href = linkMap['hsg'];
          linkElement.target = '_blank';
          linkElement.className = 'link-word';
          linkElement.innerHTML = displayWord;
          span.innerHTML = '';
          span.appendChild(linkElement);
          if (trailingSpace) {
            span.innerHTML += trailingSpace;
          }
          span.style.textDecoration = 'none';
        }

        element.appendChild(span);
        wordCounter++;
      }
    });

    return wordCounter;
  }

  const h1CharCount = wrapChars(h1, charDelay, startDelay);
  const pStartDelay = startDelay + (h1CharCount * charDelay) + 200;
  const pWordCount = wrapWords(p, wordDelay, pStartDelay);
  const p2StartDelay = pStartDelay + (pWordCount * wordDelay) + 200;
  wrapWords(p2, wordDelay, p2StartDelay);
});
