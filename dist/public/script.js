let total = 0;

function checkPassword() {
  const password = document.getElementById('password-input').value;
  if (password === 'shop@fuoko') {
    document.getElementById('password-screen').style.display = 'none';
    document.getElementById('billing-screen').style.display = 'block';
  } else {
    alert('Wrong password! Please enter the correct password.');
    document.getElementById('password-input').value = '';
  }
}

function addProduct() {
  const productDiv = document.createElement('div');
  productDiv.className = 'product-row flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2';
  productDiv.innerHTML = `
    <input type="text" class="product-name w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Product Name" required oninput="suggestProduct(this)">
    <input type="text" class="product-size w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Size (e.g. M)" required>
    <input type="number" class="product-qty w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Qty" min="1" required oninput="updateTotal()">
    <input type="number" class="product-price w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Price" min="0" step="0.01" required oninput="updateTotal()">
    <button type="button" onclick="removeProduct(this)" class="w-full sm:w-12 h-12 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">❌</button>
  `;
  document.getElementById('product-list').appendChild(productDiv);
  document.querySelector('.product-name:last-child').focus();
}

function removeProduct(btn) {
  btn.parentElement.remove();
  updateTotal();
}

function suggestProduct(input) {
  const match = suggestions.find(s => s.toLowerCase().startsWith(input.value.toLowerCase()));
  if (match) input.value = match;
}

function updateTotal() {
  total = 0;
  document.querySelectorAll('.product-row').forEach(row => {
    const qty = +row.querySelector('.product-qty').value || 0;
    const price = +row.querySelector('.product-price').value || 0;
    total += qty * price;
  });
  document.getElementById('total').innerText = total.toFixed(2);
}

function validateForm() {
  const customerName = document.querySelector('input[name="customerName"]').value.trim();
  const mobile = document.querySelector('input[name="mobile"]').value.trim();
  const paidAmount = document.querySelector('input[name="paidAmount"]').value;
  const products = document.querySelectorAll('.product-row');

  if (!customerName) {
    alert('Customer Name is required.');
    return false;
  }

  if (!mobile.match(/^[0-9]{10}$/)) {
    alert('Please enter a valid 10-digit WhatsApp Number.');
    return false;
  }

  if (!paidAmount || paidAmount < 0) {
    alert('Paid Amount is required and must be non-negative.');
    return false;
  }

  if (products.length === 0) {
    alert('At least one product is required.');
    return false;
  }

  let valid = true;
  products.forEach(row => {
    const name = row.querySelector('.product-name').value.trim();
    const size = row.querySelector('.product-size').value.trim();
    const qty = row.querySelector('.product-qty').value;
    const price = row.querySelector('.product-price').value;

    if (!name || !size || !qty || !price || qty < 1 || price < 0) {
      valid = false;
    }
  });

  if (!valid) {
    alert('All product fields (Name, Size, Qty, Price) must be filled and valid.');
    return false;
  }

  return true;
}

document.getElementById('billing-form').onsubmit = async function (e) {
  e.preventDefault();
  if (!validateForm()) return;

  const submitBtn = document.getElementById('submit-btn');
  const overlay = document.getElementById('processing-overlay');
  submitBtn.disabled = true;
  overlay.style.display = 'flex';

  const products = [];
  document.querySelectorAll('.product-row').forEach(row => {
    products.push({
      name: row.querySelector('.product-name').value,
      size: row.querySelector('.product-size').value,
      quantity: +row.querySelector('.product-qty').value,
      price: +row.querySelector('.product-price').value
    });
  });

  const formData = {
    customerName: document.querySelector('input[name="customerName"]').value,
    mobile: document.querySelector('input[name="mobile"]').value,
    paidAmount: +document.querySelector('input[name="paidAmount"]').value,
    products
  };

  try {
    const res = await fetch('/send-invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    alert(await res.text());
    document.getElementById('billing-form').reset();
    document.getElementById('product-list').innerHTML = '';
    document.getElementById('total').innerText = '0';
  } catch (error) {
    alert('Error generating invoice: ' + error.message);
  } finally {
    submitBtn.disabled = false;
    overlay.style.display = 'none';
  }
};

// Auto-focus on password input when page loads
document.getElementById('password-input').focus();