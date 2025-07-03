const billForm = document.getElementById('bill-form');
const billList = document.getElementById('bill-list');

let bills = JSON.parse(localStorage.getItem('bills')) || [];
renderBills();

billForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('billName').value.trim();
  const dueDate = document.getElementById('dueDate').value;
  const amount = document.getElementById('amount').value;
  const person = document.getElementById('person').value.trim();
  const frequency = document.getElementById('frequency').value;

  if (!name || !dueDate) return;

  const newBill = {
    id: Date.now(),
    name,
    dueDate,
    amount,
    person,
    frequency,
    paid: false
  };

  bills.push(newBill);
  localStorage.setItem('bills', JSON.stringify(bills));
  billForm.reset();
  renderBills();
});

function renderBills() {
  billList.innerHTML = '';
  const today = new Date();

  bills.forEach((bill) => {
    const due = new Date(bill.dueDate);
    const daysLeft = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    const isOverdue = daysLeft < 0 && !bill.paid;

    let statusClass = '';
    if (bill.paid) {
      statusClass = 'status-paid';
    } else if (isOverdue) {
      statusClass = 'status-overdue';
    } else if (daysLeft <= 3) {
      statusClass = 'status-due';
    }

    const card = document.createElement('div');
    card.className = `bill-card ${statusClass}`;
    card.innerHTML = `
      <div class="bill-header">
        <span class="bill-name">${bill.name}</span>
        <div class="bill-actions">
          <button onclick="togglePaid(${bill.id})">
            ${bill.paid ? 'Mark Unpaid' : 'Mark Paid'}
          </button>
          <button onclick="editBill(${bill.id})">Edit</button>
          <button onclick="deleteBill(${bill.id})">Delete</button>
        </div>
      </div>
      <div class="bill-meta">
        ${bill.amount ? `Amount: ₹${bill.amount} | ` : ''}
        Due: ${bill.dueDate} | ${bill.frequency}
        ${bill.person ? ` | For: ${bill.person}` : ''}
        ${!bill.paid ? ` | ${isOverdue ? 'Overdue' : `Due in ${daysLeft} day(s)`}` : ''}
      </div>
    `;
    billList.appendChild(card);
  });
}

function togglePaid(id) {
  bills = bills.map((bill) =>
    bill.id === id ? { ...bill, paid: !bill.paid } : bill
  );
  localStorage.setItem('bills', JSON.stringify(bills));
  renderBills();
}

function deleteBill(id) {
  if (!confirm('Are you sure you want to delete this bill?')) return;
  bills = bills.filter(bill => bill.id !== id);
  localStorage.setItem('bills', JSON.stringify(bills));
  renderBills();
}

function editBill(id) {
  const bill = bills.find(b => b.id === id);
  if (!bill) return;

  document.getElementById('billName').value = bill.name;
  document.getElementById('dueDate').value = bill.dueDate;
  document.getElementById('amount').value = bill.amount;
  document.getElementById('person').value = bill.person;
  document.getElementById('frequency').value = bill.frequency;

  bills = bills.filter(b => b.id !== id);
  localStorage.setItem('bills', JSON.stringify(bills));
  renderBills();
}
