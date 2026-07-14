// ===== Lấy các phần tử DOM cần dùng =====
const info = document.getElementById('info');
const loading = document.getElementById('loading');
const searchInput = document.getElementById("searchInput");
const editForm = document.getElementById("editForm");
const resetBtn = document.getElementById("reset"); // khai báo rõ ràng, không dựa vào biến toàn cục ẩn

// ===== Đọc dữ liệu đã lưu trong LocalStorage (nếu có) =====
let user = JSON.parse(localStorage.getItem('user')) || [];
let editId = null; // null = không sửa ai cả, có giá trị = đang sửa người dùng có id này

// ===== Lưu danh sách người dùng hiện tại vào LocalStorage =====
function savedata() {
    localStorage.setItem('user', JSON.stringify(user));
}

// ===== Hiển thị danh sách người dùng ra màn hình =====
// data mặc định là toàn bộ "user", nhưng có thể truyền vào danh sách đã lọc (kết quả tìm kiếm)
function render(data = user) {
    info.innerHTML = "";

    data.forEach(item => {
        info.innerHTML += `
            <div>
                <h3>Tên: ${item.name}</h3>
                <p>Email: ${item.email}</p>
                <p>Điện thoại: ${item.phone}</p>
                <button onclick="edititem(${item.id})">Edit</button>
                <button onclick="deleteitem(${item.id})">Delete</button>
            </div>
        `;
    });
}

// ===== Gọi API để lấy danh sách người dùng mẫu =====
async function getinfo() {
    try {
        loading.style.display = "block"; // hiện chữ "Loading..." trong lúc chờ

        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        user = await response.json();

        savedata();
        render();

    } catch (error) {
        console.error(error);
    } finally {
        loading.style.display = "none"; // dù thành công hay lỗi cũng ẩn "Loading..." đi
    }
}

// ===== Khi tải trang: nếu đã có dữ liệu lưu sẵn thì hiển thị luôn,
//        nếu chưa có gì thì gọi API để lấy dữ liệu mẫu =====
if (user.length > 0) {
    render();
} else {
    getinfo();
}

// ===== Mở form sửa và điền sẵn thông tin người dùng được chọn =====
function edititem(id) {
    editId = id;
    const item = user.find(u => u.id === id);

    editForm.style.display = "block";
    document.getElementById('name').value = item.name;
    document.getElementById('email').value = item.email;
    document.getElementById('phone').value = item.phone;
}

// ===== Xóa một người dùng khỏi danh sách =====
function deleteitem(id) {
    // Không cho xóa người đang được sửa dở, tránh gây rối dữ liệu
    if (editId === id) {
        alert("Bạn đang sửa người dùng này, không thể xóa!");
        return;
    }

    user = user.filter(u => u.id !== id);
    savedata();
    render();
}

// ===== Lưu thông tin vừa sửa =====
document.getElementById("save").addEventListener("click", function () {
    const item = user.find(u => u.id === editId);

    if (item) {
        item.name = document.getElementById("name").value;
        item.email = document.getElementById("email").value;
        item.phone = document.getElementById("phone").value;

        savedata();
        render();

        editForm.style.display = "none"; // sửa xong thì ẩn form đi
        editId = null;
    }
});

// ===== Tìm kiếm người dùng theo tên, lọc ngay khi đang gõ =====
searchInput.addEventListener("input", function () {
    const keyword = searchInput.value.trim().toLowerCase();

    const result = user.filter(item =>
        item.name.toLowerCase().includes(keyword)
    );

    render(result);
});

// ===== Nút Reset: gọi lại API để lấy dữ liệu gốc, ghi đè dữ liệu đã lưu =====
resetBtn.addEventListener("click", async function () {
    await getinfo();
});