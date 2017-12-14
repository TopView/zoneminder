function validateForm ( form ) {
  let rows = $j(form).find('tbody').eq(0).find('tr');
  let obrCount = 0;
  let cbrCount = 0;
  for ( let i = 0; i < rows.length; i++ ) {
    if (rows.length > 2) {
      obrCount += parseInt(form.elements['filter[Query][terms][' + i + '][obr]'].value);
      cbrCount += parseInt(form.elements['filter[Query][terms][' + i + '][cbr]'].value);
    }
    if (form.elements['filter[Query][terms][' + i + '][val]'].value == '') {
      alert( errorValue );
      return false;
    }
  }
  if (obrCount - cbrCount != 0) {
    alert( errorBrackets );
    return false;
  }
  return true;
}

function updateButtons( element ) {
  var form = element.form;

  if ( element.type == 'checkbox' && element.checked ) {
    form.elements['executeButton'].disabled = false;
  } else {
    var canExecute = false;
    if ( form.elements['filter[AutoArchive]'] && form.elements['filter[AutoArchive]'].checked )
      canExecute = true;
    else if ( form.elements['filter[AutoVideo]'] && form.elements['filter[AutoVideo]'].checked )
      canExecute = true;
    else if ( form.elements['filter[AutoUpload]'] && form.elements['filter[AutoUpload]'].checked )
      canExecute = true;
    else if ( form.elements['filter[AutoEmail]'] && form.elements['filter[AutoEmail]'].checked )
      canExecute = true;
    else if ( form.elements['filter[AutoMessage]'] && form.elements['filter[AutoMessage]'].checked )
      canExecute = true;
    else if ( form.elements['filter[AutoExecute]'].checked && form.elements['filter[AutoExecuteCmd]'].value != '' )
      canExecute = true;
    else if ( form.elements['filter[AutoDelete]'].checked )
      canExecute = true;
    else if ( form.elements['filter[UpdateDiskSpace]'].checked )
      canExecute = true;
    form.elements['executeButton'].disabled = !canExecute;
  }
  if ( form.elements['filter[Name]'].value ) {
    form.elements['Save'].disabled = false;
    form.elements['SaveAs'].disabled = false;
  } else {
    form.elements['Save'].disabled = true;
    form.elements['SaveAs'].disabled = true;
  }
}

function checkValue ( element ) {
  let rows = $j(element).closest('tbody').children();
  parseRows(rows);
  clearValue(element);
}

function clearValue( element ) {
  $j(element).closest('tr').find('[type=text]').val('');
}

function resetFilter( element ) {
  element.form.reset();
  $j('#contentForm')[0].reset();
}

function submitToEvents( element ) {
  var form = element.form;
  form.action = thisUrl + '?view=events';
  history.replaceState(null, null, '?view=filter&' + $j(form).serialize());
}

function executeFilter( element ) {
  var form = element.form;
  form.action = thisUrl + '?view=events';
  form.elements['action'].value = 'execute';
  history.replaceState(null, null, '?view=filter&' + $j(form).serialize());
}

function saveFilter( element ) {
  var form = element.form;
  form.target = window.name;
  form.elements['action'].value = element.value;
  form.action = thisUrl + '?view=filter';
  form.submit();
}

function deleteFilter( element, name ) {
  if ( confirm( deleteSavedFilterString+" '"+name+"'?" ) ) {
    var form = element.form;
    form.elements['action'].value = 'delete';
    form.submit();
  }
}

function parseRows (rows) {
  for (let rowNum = 0; rowNum < rows.length; rowNum++) { //Each row is a term
    let queryPrefix = 'filter[Query][terms][';
    let inputTds = rows.eq(rowNum).children();

    if (rowNum == 0) inputTds.eq(0).html('&nbsp'); //Remove and from first term
    if (rowNum > 0) { //add and/or to 1+
      let cnjVal = inputTds.eq(0).children().val();
      let conjSelect = $j('<select></select>').attr('name', queryPrefix + rowNum + '][cnj]').attr('id', queryPrefix + rowNum + '][cnj]');
      $j.each(conjTypes, function (i) {
        conjSelect.append('<option value="' + i + '" >' + i + '</option>');
      });
      inputTds.eq(0).html(conjSelect).children().val(cnjVal);
    }

    let brackets = rows.length - 2;
    if (brackets > 0) { //add bracket select to all rows
      let obrSelect = $j('<select></select>').attr('name', queryPrefix + rowNum + '][obr]').attr('id', queryPrefix + rowNum + '][obr]');
      let cbrSelect = $j('<select></select>').attr('name', queryPrefix + rowNum + '][cbr]').attr('id', queryPrefix + rowNum + '][cbr]');
      obrSelect.append('<option value="0"</option>');
      cbrSelect.append('<option value="0"</option>');
      for (let i = 1; i <= brackets; i++) {//build bracket options
        obrSelect.append('<option value="' + i + '">' + '('.repeat(i) + '</option>');
        cbrSelect.append('<option value="' + i + '">' + ')'.repeat(i) + '</option>');
      }
      let obrVal = inputTds.eq(1).children().val();  //Save currently selected bracket option
      let cbrVal = inputTds.eq(5).children().val();
      inputTds.eq(1).html(obrSelect).children().val(obrVal); //Set bracket contents and assign saved value
      inputTds.eq(5).html(cbrSelect).children().val(cbrVal);
    } else {
      inputTds.eq(1).html('&nbsp');
      inputTds.eq(5).html('&nbsp');
    }

    if (rows.length == 1) {
      inputTds.eq(6).find(':input[value="-"]').prop('disabled', true);
    } else {
      inputTds.eq(6).find(':input[value="-"]').prop('disabled', false);
    }

    if (inputTds.eq(2).children().val() == "Archived") {
      inputTds.eq(3).html('equal to<input type="hidden" name="filter[Query][terms][' + rowNum + '][op]" value="=">');
      let archiveSelect = $j('<select></select>').attr('name', queryPrefix + rowNum + '][val]').attr('id', queryPrefix + rowNum + '][val]');
      for (let i = 0; i < archiveTypes.length; i++) {
        archiveSelect.append('<option value="' + i + '">' + archiveTypes[i] + '</option>');
      }
      let archiveVal = inputTds.eq(4).children().val();
      inputTds.eq(4).html(archiveSelect).children().val(archiveVal);

    } else if (inputTds.eq(2).children().val().indexOf('Weekday') >= 0) {
      let weekdaySelect = $j('<select></select>').attr('name', queryPrefix + rowNum + '][val]').attr('id', queryPrefix + rowNum + '][val]');
      for (let i = 0; i < weekdays.length; i++) {
        weekdaySelect.append('<option value="' + i + '">' + weekdays[i] + '</option>');
      }
      let weekdayVal = inputTds.eq(4).children().val();
      inputTds.eq(4).html(weekdaySelect).children().val(weekdayVal);

    } else if (inputTds.eq(2).children().val() == 'StateId') {
      let stateSelect = $j('<select></select>').attr('name', queryPrefix + rowNum + '][val]').attr('id', queryPrefix + rowNum + '][val]');
      for (let key in states) {
        stateSelect.append('<option value="' + key + '">' + states[key] + '</option>');
      }
      let stateVal = inputTds.eq(4).children().val();
      inputTds.eq(4).html(weekdaySelect).children().val(stateVal)


    } else if (inputTds.eq(2).children().val() == 'ServerId') {
      let serverSelect = $j('<select></select>').attr('name', queryPrefix + rowNum + '][val]').attr('id', queryPrefix + rowNum + '][val]');
      for (let key in servers) {
        serverSelect.append('<option value="' + key + '">' + servers[key] + '</option>');
      }
      let serverVal = inputTds.eq(4).children().val();
      inputTds.eq(4).html(weekdaySelect).children().val(serverVal)

    } else if (inputTds.eq(2).children().val() == 'StorageId') {
      let storageSelect = $j('<select></select>').attr('name', queryPrefix + rowNum + '][val]').attr('id', queryPrefix + rowNum + '][val]');
      for (let i=0; i < storageareas.length; i++) {
        storageSelect.append('<option value="' + i + '">' + storageareas[i] + '</option>');
      }
      let storageVal = inputTds.eq(4).children().val();
      inputTds.eq(4).html(storageSelect).children().val(storageVal)

    } else if (inputTds.eq(2).children().val() == 'MonitorName') {
      let monitorSelect = $j('<select></select>').attr('name', queryPrefix + rowNum + '][val]').attr('id', queryPrefix + rowNum + '][val]');
      for (let key in monitors) {
        monitorSelect.append('<option value="' + key + '">' + monitors[key] + '</option>');
      }
      let monitorVal = inputTds.eq(4).children().val();
      inputTds.eq(4).html(monitorSelect).children().val(monitorVal)
    } else {
      let opSelect = $j('<select></select>').attr('name', queryPrefix + rowNum + '][op]').attr('id', queryPrefix + rowNum + '][op]');
      for (let key in opTypes) {
        opSelect.append('<option value="' + key + '">' + opTypes[key] + '</option>');
      }
      let opVal = inputTds.eq(3).children().val();
      inputTds.eq(3).html(opSelect).children().val(opVal)
      let textInput = $j('<input></input>').attr('type', 'text').attr('name', queryPrefix + rowNum + '][val]').attr('id', queryPrefix + rowNum + '][val]')
      let textVal = inputTds.eq(4).children().val();
      inputTds.eq(4).html(textInput).children().val(textVal);
   }
   let attr = inputTds.find("[name$='attr\\]']") // Set attr list id and name
   let term = attr.attr('name').split(/[[\]]{1,2}/);
   term.length--;
   term.shift();
   term[2] = rowNum;
   inputTds.eq(2).children().attr('name', 'filter'+stringFilter(term));
   inputTds.eq(2).children().attr('id', 'filter'+stringFilter(term));
  }
  history.replaceState(null, null, '?view=filter&' + $j('#contentForm').serialize());
}

function stringFilter (term) {
  let termString = '';
  term.forEach(function(item) {
   termString += '[' + item + ']';
  });
  return termString;
}

function addTerm( element ) {
  let row = $j(element).closest('tr');
  let newRow = row.clone().insertAfter(row);
  newRow.find('select').each( function () { //reset new row to default
    this[0].selected = 'selected';
  });
  newRow.find('input[type="text"]').val('');
  let rows = $j(row).parent().children();
  parseRows(rows);
}

function delTerm( element ) {
  let row = $j(element).closest('tr');
  let rowParent = $j(row).parent();
  row.remove();
  let rows = rowParent.children();
  parseRows(rows);
}

function init() {
  updateButtons( $('executeButton') );
}

window.addEvent( 'domready', init );
