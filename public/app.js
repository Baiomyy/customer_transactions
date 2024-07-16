const apiUrl = '/api/data';

// Fetch and display data
async function fetchData() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

// Populate table with data
function populateTable(customers, transactions) {
    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = '';

    transactions.forEach(transaction => {
        const customer = customers.find(c => c.id === transaction.customer_id);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.name}</td>
            <td>${transaction.date}</td>
            <td>${transaction.amount}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Filter table data
function filterTable(customers, transactions) {
    const customerFilter = document.getElementById('customerFilter').value.toLowerCase();
    const amountFilter = parseFloat(document.getElementById('amountFilter').value) || 0;

    const filteredTransactions = transactions.filter(transaction => {
        const customer = customers.find(c => c.id === transaction.customer_id);
        return customer.name.toLowerCase().includes(customerFilter) && transaction.amount >= amountFilter;
    });

    populateTable(customers, filteredTransactions);
}

// Display chart
function displayChart(customerId, transactions) {
    const filteredTransactions = transactions.filter(transaction => transaction.customer_id === customerId);
    const dailyTotals = filteredTransactions.reduce((acc, transaction) => {
        const date = transaction.date;
        if (!acc[date]) acc[date] = 0;
        acc[date] += transaction.amount;
        return acc;
    }, {});

    const dates = Object.keys(dailyTotals);
    const amounts = Object.values(dailyTotals);

    const ctx = document.getElementById('transactionChart').getContext('2d');

    // Clear previous chart instance (if exists)
    Chart.getChart('transactionChart')?.destroy();

    // Create new chart instance
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Total Transaction Amount',
                data: amounts,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1
            }]
        }
    });
}

// Main function
async function main() {
    const { customers, transactions } = await fetchData();
    populateTable(customers, transactions);

    document.getElementById('customerFilter').addEventListener('input', () => filterTable(customers, transactions));
    document.getElementById('amountFilter').addEventListener('input', () => filterTable(customers, transactions));

    document.querySelector('#dataTable').addEventListener('click', (event) => {
        if (event.target.tagName === 'TD') {
            const row = event.target.closest('tr');
            const customerName = row.cells[0].textContent;
            const customer = customers.find(c => c.name === customerName);
            displayChart(customer.id, transactions);
        }
    });
}

main();
