const shelljs = require('shelljs');

(function (window) {

  document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    return false;
  });


  

  document.querySelector('button[type="submit"]').addEventListener('click', function _submitBtnClickEvent(event) {
    let formElements = document.querySelector('form');
    let formValues = [];

    for (let i = 0; i < formElements.length; i++) {
      let el = formElements[i];
      if (el.type !== 'submit') {
        formValues.push({
          name: el.getAttribute('name'),
          value: el.type === 'checkbox' ? el.checked : el.value,
        });
      }
    }
    runCommand();
  });

  function runCommand() {
    let command = 'node --version';
    shelljs.exec(command, function (error, stdout, stderr) {
      if (error === 0) {
        let output = stdout.trim();
        let consoleOutput = document.getElementById('console-output');
        let date = new Date();
        var time = `[${ date.getHours() }:${ date.getMinutes() }:${ date.getSeconds() }]`;

        consoleOutput.insertAdjacentHTML('beforeend', `<code>${ command }</code>`);
        consoleOutput.insertAdjacentHTML('beforeend', `<div><span>${ time }:</span> ${ output }</div>`)
      }
    });
  }

}(window));