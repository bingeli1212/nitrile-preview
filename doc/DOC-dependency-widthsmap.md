The widthsmap



          widths[letter] = [
              getWidthOf(sandbox, printableLetter, name, 'normal', 'normal'),
              getWidthOf(sandbox, printableLetter, name, 'bold', 'normal'),
              getWidthOf(sandbox, printableLetter, name, 'normal', 'italic'),
              getWidthOf(sandbox, printableLetter, name, 'bold', 'italic')
          ];



      function getWidthOf(sandbox, printableLetter, name, weight, style) {
          sandbox.innerHTML = `<span style="font-family: ${name}; font-size: 100; font-weight: ${weight}; font-style: ${style};">${printableLetter}<span>`;
          var el = sandbox.children[0];
          return el.offsetWidth;
      }

      var websafe = [
        'Andale Mono',
        'Arial',
        'Avenir',
        'Avenir Next',
        'Comic Sans MS',
        'Courier New',
        'Georgia',
        'Helvetica',
        'Impact',
        'Times New Roman',
        'Trebuchet MS',
        'Verdana',
        'Webdings',
        'Open Sans',
        'Tahoma',
        'Quantify'
      ]

    var pixelWidth = require('string-pixel-width');

    const width = pixelWidth('My text ...', { size: 10 });
    console.log('This text is ' + width + 'px long in the size of 10px.');

    // This text is 43.5px long in the size of 10px.
    var pixelWidth = require('string-pixel-width');

    const width = pixelWidth('My text ...', { font: 'impact', size: 10 });
    console.log('This text is ' + width + 'px long in the size of 10px.');

    // This text is 42px long in the size of 10px.
    var pixelWidth = require('string-pixel-width');

    const width = pixelWidth('My text ...', { font: 'open sans', size: 10, bold: true, italic: true });
    console.log('This text is ' + width + 'px long in the size of 10px.');

    // This text is 47px long in the size of 10px using bold and italic proportions.


    import deburr from 'lodash.deburr';
    import widthsMap from './widthsMap';

    const settingsDefaults = { font: 'Arial', size: 100 };

    const getWidth = (string, settings) => {
      const sett = { ...settingsDefaults, ...settings };
      const font = sett.font.toLowerCase();
      const size = sett.size;
      const variant = 0 + (sett.bold ? 1 : 0) + (sett.italic ? 2 : 0);
      const map = sett.map || widthsMap;
      const available = Object.keys(map);
      if (available.indexOf(font) === -1) {
        throw new Error(`This font is not supported. Supported fonts are: ${available.join(', ')}`);
      }
      let totalWidth = 0;
      deburr(string).split('').forEach((char) => {
        if (/[\x00-\x1F]/.test(char)) { // non-printable character
          return true;
        }
        // use width of 'x' as fallback for unregistered char
        const widths = map[font][char] || map[font].x;
        const width = widths[variant];
        totalWidth += width;
        return true;
      });
      return totalWidth * (size / 100);
    };

    export default getWidth;