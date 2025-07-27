// const suggestions = ['Shirt', 'Pant', 'Kurti', 'T-Shirt'];
// let total = 0;

// function addProduct() {
//   const div = document.createElement('div');
//   div.className = 'product-row';

//   div.innerHTML = `
//     <input type="text" name="name" placeholder="Product Name" oninput="suggestProduct(this)" required>
//     <input type="text" name="size" placeholder="Size (e.g. M)" required>
//     <input type="number" name="quantity" placeholder="Qty" oninput="updateTotal()" required>
//     <input type="number" name="price" placeholder="Price" oninput="updateTotal()" required>
//     <button type="button" onclick="removeProduct(this)">❌</button>
//   `;

//   document.getElementById('products').appendChild(div);
//   updateTotal();
// }

// function removeProduct(btn) {
//   btn.parentElement.remove();
//   updateTotal();
// }

// function suggestProduct(input) {
//   const match = suggestions.find(s => s.toLowerCase().startsWith(input.value.toLowerCase()));
//   if (match) input.value = match;
// }

// function updateTotal() {
//   total = 0;
//   document.querySelectorAll('.product-row').forEach(row => {
//     const qty = +row.querySelector('[name=\"quantity\"]').value || 0;
//     const price = +row.querySelector('[name=\"price\"]').value || 0;
//     total += qty * price;
//   });
//   document.getElementById('total').innerText = total;
// }

// billingForm.onsubmit = async function (e) {
//   e.preventDefault();
//   const form = e.target;
//   const products = [];
//   document.querySelectorAll('.product-row').forEach(row => {
//     products.push({
//       name: row.querySelector('[name=\"name\"]').value,
//       size: row.querySelector('[name=\"size\"]').value,
//       quantity: row.querySelector('[name=\"quantity\"]').value,
//       price: row.querySelector('[name=\"price\"]').value,
//     });
//   });

//   const res = await fetch('/send-invoice', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//     body: new URLSearchParams({
//       customerName: form.customerName.value,
//       mobile: form.mobile.value,
//       paidAmount: form.paidAmount.value,
//       products: JSON.stringify(products),
//     })
//   });

//   alert(await res.text());
//   form.reset();
//   document.getElementById('products').innerHTML = '';
//   updateTotal();
// };











// const suggestions = ['Shirt', 'Pant', 'Kurti', 'T-Shirt'];
// let total = 0;

// function addProduct() {
//   const productDiv = document.createElement('div');
//   productDiv.className = 'product-row';
//   productDiv.innerHTML = `
//     <input type="text" class="product-name" placeholder="Product Name" required oninput="suggestProduct(this)">
//     <input type="text" class="product-size" placeholder="Size (e.g. M)" required>
//     <input type="number" class="product-qty" placeholder="Qty" required oninput="updateTotal()">
//     <input type="number" class="product-price" placeholder="Price" required oninput="updateTotal()">
//     <button type="button" onclick="removeProduct(this)">❌</button>
//   `;
//   document.getElementById('product-list').appendChild(productDiv);
// }

// function removeProduct(btn) {
//   btn.parentElement.remove();
//   updateTotal();
// }

// function suggestProduct(input) {
//   const match = suggestions.find(s => s.toLowerCase().startsWith(input.value.toLowerCase()));
//   if (match) input.value = match;
// }

// function updateTotal() {
//   total = 0;
//   document.querySelectorAll('.product-row').forEach(row => {
//     const qty = +row.querySelector('.product-qty').value || 0;
//     const price = +row.querySelector('.product-price').value || 0;
//     total += qty * price;
//   });
//   document.getElementById('total').innerText = total;
// }

// billingForm.onsubmit = async function (e) {
//   e.preventDefault();
//   const products = [];

//   document.querySelectorAll('.product-row').forEach(row => {
//     products.push({
//       name: row.querySelector('.product-name').value,
//       size: row.querySelector('.product-size').value,
//       quantity: +row.querySelector('.product-qty').value,
//       price: +row.querySelector('.product-price').value
//     });
//   });

//   const formData = {
//     customerName: billingForm.customerName.value,
//     mobile: billingForm.mobile.value,
//     paidAmount: +billingForm.paidAmount.value,
//     products
//   };

//   const res = await fetch('/send-invoice', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(formData)
//   });

//   alert(await res.text());
//   billingForm.reset();
//   document.getElementById('product-list').innerHTML = '';
//   document.getElementById('total').innerText = '0';
// };













const suggestions = ['Shirt', 'Pant', 'Kurti', 'T-Shirt'];
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
  productDiv.className = 'product-row';
  productDiv.innerHTML = `
    <input type="text" class="product-name" placeholder="Product Name" required oninput="suggestProduct(this)">
    <input type="text" class="product-size" placeholder="Size (e.g. M)" required>
    <input type="number" class="product-qty" placeholder="Qty" min="1" required oninput="updateTotal()">
    <input type="number" class="product-price" placeholder="Price" min="0" step="0.01" required oninput="updateTotal()">
    <button type="button" onclick="removeProduct(this)" class="remove-btn">❌</button>
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

document.getElementById('billing-form').onsubmit = async function (e) {
  e.preventDefault();
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
    customerName: document.getElementById('billing-form').customerName.value,
    mobile: document.getElementById('billing-form').mobile.value,
    paidAmount: +document.getElementById('billing-form').paidAmount.value,
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
  }
};

// Auto-focus on password input when page loads
document.getElementById('password-input').focus();