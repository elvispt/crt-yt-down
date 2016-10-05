const shelljs = require('shelljs');

(function (window) {

  document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    return false;
  });

  document.querySelector('button[type="submit"]').addEventListener('click', function _submitBtnClickEvent(event) {
    let formElements = document.querySelector('form');
    let formValues = [];

    this.disabled = true;
    for (let i = 0; i < formElements.length; i++) {
      let el = formElements[i];
      if (el.type !== 'submit') {
        formValues.push({
          name: el.getAttribute('name'),
          value: el.type === 'checkbox' ? el.checked : el.value,
        });
      }
    }
    runCommand(() => {
      this.disabled = false;
    });
  });

  function runCommand(doneCallback) {
    let command = 'yt-dl\\youtube-dl.exe https://www.youtube.com/watch?v=2SIADtYPAHA --extract-audio --audio-format=mp3 --no-check-certificate -k -o output\\%(title)s-%(id)s.%(ext)s';
    const execOptions = {
      async: true,
    };
    let consoleOutput = document.getElementById('console-output');
    let commandDate = new Date();
    let commandTime = `[${ commandDate.getHours() }:${ commandDate.getMinutes() }:${ commandDate.getSeconds() }]`;

    consoleOutput.insertAdjacentHTML('beforeend', `<div><span>${ commandTime }</span><code>${ command }</code></div>`);
    // make the call
    let child = shelljs.exec(command, execOptions, (code, stdout, stderr) => {
      if (code === 0) {
        let output = stdout.trim();
        let outputDate = new Date();
        let outputTime = `[${ outputDate.getHours() }:${ outputDate.getMinutes() }:${ outputDate.getSeconds() }]`;

        consoleOutput.insertAdjacentHTML('beforeend', `<div><span>${ outputTime }:</span> DONE</div>`)
      } else {
        consoleOutput.insertAdjacentHTML('beforeend', `<pre>${ code }</pre>`);
        consoleOutput.insertAdjacentHTML('beforeend', `<pre>${ stdout }</pre>`);
        consoleOutput.insertAdjacentHTML('beforeend', `<pre>${ stderr }</pre>`);
      }
      consoleOutput.insertAdjacentHTML('beforeend', '<hr />');
      doneCallback();
    });

    // output cli data as it's being return by the process
    child.stdout.on('data', data => {
      let out = data.trim();
      let textLines = [];

      if (out.indexOf('\n') > -1) {
        textLines = out.split('\n');
      } else if (out.indexOf('\r') > -1) {
        textLines = out.split('\r');
      } else {
        textLines.push(out);
      }
      textLines.forEach(txt => {
        let text = txt.trim();

        if (text) {
          consoleOutput.insertAdjacentHTML('beforeend', `<div>${ text }</div>`)
        }
      });
    });
  }

}(window));