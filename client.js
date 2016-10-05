const shelljs = require('shelljs');

(function (window) {

  document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    this.disabled = true;
    runCommand(() => {
      this.disabled = false;
    });
  });

  document.querySelector('button[type="submit"]').addEventListener('click', function _submitBtnClickEvent(event) {
  });

  /**
   * Gets the arguments for youtube-dl
   */
  function getParams() {
    return [
      'yt-url',
      'keep-video',
      'yt-audio-video',
      'yt-format',
      'yt-audio-quality',
      'yt-check-certificate',
      'yt-output-path-template'
    ].map(elId => {
      let el = document.getElementById(elId);

      if (el.type === 'checkbox') {
        return el.checked ? el.value : '';
      }
      return el.value;
    });
  }

  function runCommand(doneCallback) {
    let params = getParams();
    let command = __dirname + '\\yt-dl\\youtube-dl.exe ' + params.join(' ');
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
        // <div class="alert alert-danger" role="alert">...</div>
        let alertId = 'alert-' + Date.now();
        consoleOutput.insertAdjacentHTML('beforeend', `<div id="${ 'alert-' + Date.now() }" class="alert alert-danger" role="alert"></div>`);
        let alertEl = document.getElementById(alertId);
        alertEl.insertAdjacentHTML('beforeend', `code: <pre>${ code }</pre>`);
        alertEl.insertAdjacentHTML('beforeend', `stdout: <pre>${ stdout }</pre>`);
        alertEl.insertAdjacentHTML('beforeend', `stderr: <pre>${ stderr }</pre>`);
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