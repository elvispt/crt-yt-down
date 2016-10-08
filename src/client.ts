const shelljs = require('shelljs');

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();
  this.disabled = true;
  createConsoleOverlay();
  runCommand(() => {
    this.disabled = false;
  });
});

/**
 * Gets the arguments for youtube-dl
 */
function getParams(): string[] {
  return [
    'yt-url',
    'keep-video',
    'yt-audio-video',
    'yt-format',
    'yt-audio-quality',
    'yt-check-certificate',
    'yt-output-path-template'
  ].map(elId => {
    let el: HTMLInputElement = <HTMLInputElement> document.getElementById(elId);

    if (el.type === 'checkbox') {
      return el.checked ? el.value : '';
    }
    return el.value;
  });
}

/**
 * Attempts to download the item at the provided url
 * @param doneCallback {Function} A callback function to run after download.
 */
function runCommand(doneCallback: Function) {
  const execOptions = {
    async: true,
  };
  let params: string[] = getParams();
  let command: string = __dirname + '\\yt-dl\\youtube-dl.exe ' + params.join(' ');
  let consoleOutput: HTMLElement = document.getElementById('console-output');
  let commandDate: Date = new Date();
  let commandTime: string = `[${ commandDate.getHours() }:${ commandDate.getMinutes() }:${ commandDate.getSeconds() }]`;

  consoleOutput.insertAdjacentHTML('beforeend', `<div><span>${ commandTime }</span><code>${ command }</code></div>`);
  // make the call
  let child = shelljs.exec(command, execOptions, (code, stdout, stderr) => {
    if (code === 0) {
      let outputDate: Date = new Date();
      let outputTime: string = `[${ outputDate.getHours() }:${ outputDate.getMinutes() }:${ outputDate.getSeconds() }]`;

      consoleOutput.insertAdjacentHTML('beforeend', `<div><span>${ outputTime }:</span> DONE</div>`)
    } else {
      const alertId: string = 'alert-' + Date.now();
      consoleOutput.insertAdjacentHTML('beforeend', `<div id="${ alertId }" class="alert alert-danger" role="alert"></div>`);
      const alertEl: HTMLElement = document.getElementById(alertId);
      alertEl.insertAdjacentHTML('beforeend', `code: <pre>${ code }</pre>`);
      alertEl.insertAdjacentHTML('beforeend', `stdout: <pre>${ stdout }</pre>`);
      alertEl.insertAdjacentHTML('beforeend', `stderr: <pre>${ stderr }</pre>`);
    }
    consoleOutput.insertAdjacentHTML('beforeend', '<hr />');
    doneCallback();
  });

  // output cli data as it's being return by the process
  child.stdout.on('data', data => {
    let out: string = data.trim();
    let textLines: string[] = [];

    if (out.indexOf('\n') > -1) {
      textLines = out.split('\n');
    } else if (out.indexOf('\r') > -1) {
      textLines = out.split('\r');
    } else {
      textLines.push(out);
    }
    textLines.forEach(txt => {
      let text: string = txt.trim();

      if (text) {
        consoleOutput.insertAdjacentHTML('beforeend', `<div>${ text }</div>`)
      }
    });
  });
}

function createConsoleOverlay() {
  const body: HTMLBodyElement = document.getElementsByTagName('body')[0];
  const containerEl: HTMLDivElement = document.createElement('div');

  containerEl.classList.add('console-container');
  containerEl.insertAdjacentHTML('beforeend', '<div class="panel panel-info"><div class="panel-heading">Log<button id="close-console" class="btn btn-xs btn-danger screen-overlay-close pull-right">Close</button></div><div id="console-output" class="panel-body"></div></div>');
  body.insertAdjacentHTML('beforeend', '<div class="screen-overlay"></div>');

  const screenOverlay: HTMLElement = <HTMLElement> document.getElementsByClassName('screen-overlay-close')[0];
  // destroy the overlay on click
  containerEl.addEventListener('click', event => {
    if (event.srcElement.classList.contains('screen-overlay-close')) {
      containerEl.remove();
      document.getElementsByClassName('screen-overlay')[0].remove();
    }
  });
  body.insertAdjacentElement('beforeend', containerEl);
}
