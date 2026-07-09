// ===== Lấy các phần tử DOM =====
const tensv = document.getElementById("tensv");
const email = document.getElementById("email");
const sdt = document.getElementById("sdt");
const them = document.getElementById("them");
const timkiem = document.getElementById("timkiem");
const diachi = document.getElementById("diachi");
const ketqua = document.getElementById("ketqua");

// ===== Đọc dữ liệu từ LocalStorage =====
let students = JSON.parse(localStorage.getItem("students")) || [];
let editId = null;

function savedata() {
    localStorage.setItem("students", JSON.stringify(students));
}

// ===== Hiển thị danh sách =====
// data mặc định là toàn bộ students, có thể truyền vào danh sách đã lọc (kết quả tìm kiếm)
function renderStudents(data = students) {
    ketqua.innerHTML = "";
    data.forEach(item => {
        ketqua.innerHTML += `
        <div>
            <span>${item.name}</span>
            <span>${item.email}</span>
            <span>${item.phone}</span>
            <span>${item.address}</span>
            <button onclick="editStudent(${item.id})">Edit</button>
            <button onclick="deleteStudent(${item.id})">Delete</button>
        </div>
        `;
    });
}

// ===== Thêm hoặc cập nhật sinh viên =====
function addstudent() {
    const tensv1 = tensv.value.trim();
    const email1 = email.value.trim();
    const phone1 = sdt.value.trim();
    const address1 = diachi.value.trim();

    if (tensv1 === "" || email1 === "" || phone1 === "" || address1 === "") {
        alert("Vui lòng điền đầy đủ thông tin sinh viên");
        return;
    }

    // Dùng đúng field "name" (khớp với renderStudents và object khi push)
    if (students.some(item => item.id !== editId && item.name.toLowerCase() === tensv1.toLowerCase())) {
        alert("Tên sinh viên đã tồn tại");
        return;
    }
    if (students.some(item => item.id !== editId && item.email.toLowerCase() === email1.toLowerCase())) {
        alert("Email sinh viên đã tồn tại");
        return;
    }
    if (students.some(item => item.id !== editId && item.phone.toLowerCase() === phone1.toLowerCase())) {
        alert("Số điện thoại sinh viên đã tồn tại");
        return;
    }
    if (students.some(item => item.id !== editId && item.address.toLowerCase() === address1.toLowerCase())) {
        alert("Địa chỉ sinh viên đã tồn tại");
        return;
    }

    if (editId !== null) {
        // ---- Chế độ sửa ----
        const student = students.find(item => item.id === editId);
        if (student) {
            student.name = tensv1;
            student.email = email1;
            student.phone = phone1;
            student.address = address1;
        }
        editId = null;
        them.textContent = "Add";
    } else {
        // ---- Chế độ thêm mới ----
        students.push({
            id: Date.now(),
            name: tensv1,
            email: email1,
            phone: phone1,
            address: address1
        });
    }

    savedata();
    renderStudents();

    tensv.value = "";
    email.value = "";
    sdt.value = "";
    diachi.value = "";
}

// Gắn sự kiện cho nút "Add" — bị thiếu ở bản gốc nên bấm không có tác dụng
them.addEventListener("click", addstudent);

// ===== Sửa sinh viên =====
function editStudent(id) {
    const student = students.find(item => item.id === id);
    if (student) {
        tensv.value = student.name;
        email.value = student.email;
        sdt.value = student.phone;
        diachi.value = student.address;
        editId = id;
        them.textContent = "Update";
    }
}

// ===== Xóa sinh viên =====
function deleteStudent(id) {
    students = students.filter(item => item.id !== id);
    savedata();
    renderStudents();
}

// ===== Tìm kiếm =====
// timkiem giờ là một ô input riêng (không phải nút bấm), nên mới có .value và sự kiện "input"
timkiem.addEventListener("input", function () {
    const keyword = timkiem.value.trim().toLowerCase();

    if (keyword === "") {
        renderStudents();
        return;
    }

    const result = students.filter(item =>
        item.name.toLowerCase().includes(keyword) ||
        item.email.toLowerCase().includes(keyword) ||
        item.phone.toLowerCase().includes(keyword) ||
        item.address.toLowerCase().includes(keyword)
    );
    renderStudents(result);
});

// ===== Hiển thị danh sách khi tải trang =====
renderStudents();