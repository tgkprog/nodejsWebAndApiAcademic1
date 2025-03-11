document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/ratesList');
    const rates = await response.json();
    const ratesDiv = document.getElementById('rates');
    rates.forEach(rate => {
        const itemDiv = document.createElement('div');
        itemDiv.textContent = `${rate.name}: ${rate.price}`;
        ratesDiv.appendChild(itemDiv);
    });
});
