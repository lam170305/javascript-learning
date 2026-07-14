// ===== Lấy các phần tử DOM (id phải khớp với id trong HTML) =====
const ten = document.getElementById("title");
const gia = document.getElementById("price");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("danhsach");

// Danh sách sản phẩm giữ ở phía client, vì fakestoreapi không thực sự
// lưu dữ liệu trên server (POST/PUT/DELETE chỉ trả về kết quả giả lập)
let products = [];
let editId = null; // null = đang ở chế độ thêm mới, có giá trị = đang sửa sản phẩm đó

// ===== Lấy danh sách sản phẩm ban đầu =====
async function baitap() {
    try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();

        products = data;
        render(products);
    } catch (error) {
        console.error("Lỗi khi tải danh sách sản phẩm:", error);
    }
}
baitap();

// ===== Hiển thị danh sách sản phẩm =====
function render(data) {
    list.innerHTML = "";
    data.forEach((item) => {
        list.innerHTML += `
        <div>
            <h3>${item.title}</h3>
            <p>Price: $${item.price.toFixed(2)}</p>
            <button onclick="batdauSua(${item.id})">Sửa</button>
            <button onclick="xoa(${item.id})">Xóa</button>
        </div>
        `;
    });
}

// ===== Thêm sản phẩm mới =====
async function themsp() {
    const title = ten.value.trim();
    const price = parseFloat(gia.value);

    if (title === "" || isNaN(price)) {
        alert("Vui lòng nhập đầy đủ tên và giá sản phẩm");
        return;
    }

    try {
        const response = await fetch("https://fakestoreapi.com/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, price })
        });

        const newItem = await response.json();

        // fakestoreapi luôn trả id = 21 cho mọi sản phẩm mới (giả lập),
        // nên tự đặt id không trùng để hiển thị đúng trên danh sách
        newItem.id = Date.now();

        products.push(newItem);
        render(products);

        ten.value = "";
        gia.value = "";
    } catch (error) {
        console.error("Lỗi khi thêm sản phẩm:", error);
    }
}

addBtn.addEventListener("click", function () {
    if (editId !== null) {
        luusua(); // đang ở chế độ sửa thì nút Add đóng vai trò Lưu
    } else {
        themsp();
    }
});

// ===== Bước 1: bấm "Sửa" -> đổ dữ liệu cũ vào ô input để người dùng chỉnh =====
function batdauSua(id) {
    const item = products.find((p) => p.id === id);
    if (!item) return;

    ten.value = item.title;
    gia.value = item.price;
    editId = id;
    addBtn.textContent = "Lưu";
}

// ===== Bước 2: bấm "Lưu" (chính là addBtn) -> gửi PUT với dữ liệu đã sửa =====
async function luusua() {
    const title = ten.value.trim();
    const price = parseFloat(gia.value);

    if (title === "" || isNaN(price)) {
        alert("Vui lòng nhập đầy đủ tên và giá sản phẩm");
        return;
    }

    try {
        await fetch(`https://fakestoreapi.com/products/${editId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, price })
        });

        // Cập nhật lại trong mảng products ở client vì server không lưu thật
        const item = products.find((p) => p.id === editId);
        if (item) {
            item.title = title;
            item.price = price;
        }

        render(products);

        ten.value = "";
        gia.value = "";
        addBtn.textContent = "Add";
        editId = null;
    } catch (error) {
        console.error("Lỗi khi sửa sản phẩm:", error);
    }
}

// ===== Xóa sản phẩm =====
async function xoa(id) {
    try {
        await fetch(`https://fakestoreapi.com/products/${id}`, {
            method: "DELETE"
        });

        products = products.filter((p) => p.id !== id);
        render(products);

        // Nếu đang sửa dở sản phẩm vừa bị xóa thì thoát chế độ sửa luôn
        if (editId === id) {
            editId = null;
            addBtn.textContent = "Add";
            ten.value = "";
            gia.value = "";
        }
    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
    }
}