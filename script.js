const STORAGE_KEY = 'fma-work-requests';
const VALID_STATUSES = ['New', 'Scheduled', 'In Progress', 'Completed'];

const form = document.getElementById('request-form');
const message = document.getElementById('form-message');
const tableBody = document.getElementById('request-table-body');

function getRequests() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setRequests(requests) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

function makeCell(text) {
  const td = document.createElement('td');
  td.textContent = text;
  return td;
}

function renderRequests() {
  const requests = getRequests();
  tableBody.innerHTML = '';

  if (!requests.length) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 6;
    cell.textContent = 'No requests submitted yet.';
    row.appendChild(cell);
    tableBody.appendChild(row);
    return;
  }

  requests.forEach((request, index) => {
    const row = document.createElement('tr');
    row.appendChild(makeCell(`${request.name} (${request.phone})`));
    row.appendChild(makeCell(request.serviceType));
    row.appendChild(makeCell(request.urgency));
    row.appendChild(makeCell(request.preferredDate));

    const statusCell = document.createElement('td');
    const statusSelect = document.createElement('select');
    statusSelect.className = 'small-select';

    VALID_STATUSES.forEach((status) => {
      const option = document.createElement('option');
      option.value = status;
      option.textContent = status;
      statusSelect.appendChild(option);
    });

    statusSelect.value = VALID_STATUSES.includes(request.status) ? request.status : 'New';
    statusSelect.addEventListener('change', (event) => {
      const next = getRequests();
      next[index].status = event.target.value;
      setRequests(next);
      renderRequests();
    });

    statusCell.appendChild(statusSelect);
    row.appendChild(statusCell);

    const actionsCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      const next = getRequests().filter((_, i) => i !== index);
      setRequests(next);
      renderRequests();
    });

    actionsCell.appendChild(deleteButton);
    row.appendChild(actionsCell);
    tableBody.appendChild(row);
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    message.textContent = 'Please complete all required fields correctly.';
    return;
  }

  const formData = new FormData(form);
  const request = {
    name: String(formData.get('name') || '').trim(),
    phone: String(formData.get('phone') || '').trim(),
    email: String(formData.get('email') || '').trim(),
    serviceType: String(formData.get('serviceType') || '').trim(),
    address: String(formData.get('address') || '').trim(),
    preferredDate: String(formData.get('preferredDate') || '').trim(),
    urgency: String(formData.get('urgency') || '').trim(),
    details: String(formData.get('details') || '').trim(),
    status: 'New',
    submittedAt: new Date().toISOString(),
  };

  const hasBlankField = Object.entries(request).some(
    ([key, value]) => key !== 'submittedAt' && value === ''
  );

  if (hasBlankField) {
    message.textContent = 'Please complete all required fields correctly.';
    return;
  }

  const requests = getRequests();
  requests.unshift(request);
  setRequests(requests);
  form.reset();
  message.textContent = 'Work request submitted successfully.';
  renderRequests();
});

renderRequests();
