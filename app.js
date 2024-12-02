import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBGaStWE4lcSBmSpBuYAhtmitHcoOKPpFk",
  authDomain: "dbnala-df6d0.firebaseapp.com",
  projectId: "dbnala-df6d0",
  storageBucket: "dbnala-df6d0.firebasestorage.app",
  messagingSenderId: "608643843198",
  appId: "1:608643843198:web:c41d016b157b0a0cda042f",
  measurementId: "G-TPF83SDPNW"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Submit form
document.getElementById("customerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const unitCount = document.getElementById("unitCount").value;
  const freonType = document.getElementById("freonType").value;
  const address = document.getElementById("address").value;

  try {
    await addDoc(collection(db, "customers"), {
      name,
      phone,
      unitCount,
      freonType,
      address
    });

    alert("Data pelanggan berhasil ditambahkan!");
    e.target.reset();
  } catch (error) {
    console.error("Error adding document: ", error);
  }
});

// Load customer data
async function loadCustomers() {
  const querySnapshot = await getDocs(collection(db, "customers"));
  const tableBody = document.getElementById("customerTableBody");

  tableBody.innerHTML = ""; // Clear table before rendering
  querySnapshot.forEach((doc, index) => {
    const data = doc.data();
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${data.name}</td>
        <td>${data.phone}</td>
        <td>${data.unitCount}</td>
        <td>${data.freonType}</td>
        <td>${data.address}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="updateOrder('${doc.id}')">Update</button>
          <button class="btn btn-danger btn-sm" onclick="deleteCustomer('${doc.id}')">Hapus</button>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

// Update order
window.updateOrder = async function (id) {
  const date = prompt("Masukkan tanggal layanan:");
  const serviceType = prompt("Masukkan jenis layanan:");
  const technician = prompt("Masukkan nama teknisi:");

  if (date && serviceType && technician) {
    const docRef = doc(db, "customers", id);
    await updateDoc(docRef, {
      orderHistory: {
        date,
        serviceType,
        technician
      }
    });

    alert("Riwayat pemesanan diperbarui!");
    loadCustomers();
  }
};

// Delete customer
window.deleteCustomer = async function (id) {
  if (confirm("Anda yakin ingin menghapus pelanggan ini?")) {
    await deleteDoc(doc(db, "customers", id));
    alert("Data pelanggan berhasil dihapus.");
    loadCustomers();
  }
};

if (document.getElementById("customerTableBody")) {
  loadCustomers();
}
