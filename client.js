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
  });

}(window));