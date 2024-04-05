document.addEventListener('DOMContentLoaded', function (event) {
  const popoverTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="popover"]')
  );
  popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });

  document.getElementById('table-layout').value = 3;
  document.getElementById('players').value =
    'Adam\nTiago\nEmily\nChris\nStephen';
  update();
});

function update() {
  const { tables, players } = _getData();

  const button = document.getElementById('randomize-button');
  const hasValues = tables.length > 0 && players.length > 1;
  const tablesValid = tables.every((t) => {
    try {
      return /\d{1,2}/.test(t) && parseInt(t) >= 2;
    } catch {
      return false;
    }
  });

  if (hasValues && tablesValid) {
    button.removeAttribute('disabled');
  } else {
    button.setAttribute('disabled', true);
  }
}

function randomize() {
  const { tables, players } = _getData();

  const shuffledPlayers = _shuffleArray(players);

  const playersByTable = [];
  const unassignedPlayers = [];

  if (tables.length === 1) {
    const tableSize = parseInt(tables[0]);
    while (shuffledPlayers.length > 0) {
      playersByTable.push(shuffledPlayers.splice(0, tableSize));
    }
  } else {
    tables.forEach((tableSize) => {
      playersByTable.push(shuffledPlayers.splice(0, tableSize));
    });
    unassignedPlayers.push(...shuffledPlayers);
  }

  const lastTable = playersByTable.slice(-1)[0];
  if (lastTable.length === 1) {
    unassignedPlayers.push(...playersByTable.pop());
  }

  document.getElementById('tables').replaceChildren();

  const tableTemplate = document.getElementById('table-template');
  const rowTemplate = document.getElementById('row-template');
  playersByTable.forEach((pt, idx) => {
    const table = tableTemplate.content.cloneNode(true);

    table.querySelector('th').textContent = `Table #${idx + 1}`;

    pt.forEach((player, idx) => {
      const row = rowTemplate.content.cloneNode(true);
      row.querySelector('th').textContent = idx + 1;
      row.querySelector('td').textContent = player;
      table.querySelector('tbody').appendChild(row);
    });

    document.getElementById('tables').appendChild(table);

    if (unassignedPlayers.length > 0) {
      document.getElementById('unassigned-players').removeAttribute('hidden');
      document.getElementById('unassigned-players-list').textContent =
        unassignedPlayers.join(', ');
    } else {
      document
        .getElementById('unassigned-players')
        .setAttribute('hidden', 'hidden');
    }
  });
}

function _getData() {
  return {
    tables: document
      .getElementById('table-layout')
      .value.split(',')
      .filter((t) => t.length > 0),
    players: document
      .getElementById('players')
      .value.split('\n')
      .filter((p) => p.length > 0),
  };
}

function _shuffleArray(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}
