// ===== Lấy các phần tử DOM =====
const ketqua = document.getElementById("ketqua");
const tensv = document.getElementById("tensv");
const them = document.getElementById("them");
const timkiem = document.getElementById("timkiem");

// ===== Đọc dữ liệu từ LocalStorage khi tải trang =====
let students = JSON.parse(localStorage.getItem("students")) || [];
let editID = null; // null = đang thêm mới, khác null = đang sửa (lưu id sinh viên đang sửa)

// ===== Lưu dữ liệu vào LocalStorage =====
function savedata() {
    localStorage.setItem("students", JSON.stringify(students));
}

// ===== Hiển thị danh sách sinh viên =====
// data mặc định là toàn bộ students, nhưng có thể truyền vào 1 danh sách khác (vd: kết quả tìm kiếm)
function render(data = students) {
    ketqua.innerHTML = ""; // xóa nội dung cũ trước khi vẽ lại

    data.forEach(item => {
        ketqua.innerHTML += `
        <div>
            <span>${item.name}</span>
            <button onclick="sua(${item.id})">Edit</button>
            <button onclick="xoa(${item.id})">Delete</button>
        </div>
        `;
    });
}

// ===== Sự kiện: bấm nút "Thêm sv" =====
them.addEventListener("click", function () {
    addten();
});

// ===== Sự kiện: nhấn Enter trong ô input cũng thêm luôn (tiện cho người dùng) =====
tensv.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        addten();
    }
});

// ===== Hàm thêm hoặc sửa sinh viên =====
function addten() {
    const name = tensv.value.trim();

    // Kiểm tra tên rỗng
    if (name === "") {
        alert("Vui lòng nhập tên");
        return;
    }

    // Kiểm tra tên đã tồn tại trong danh sách chưa (không phân biệt hoa thường)
    if (students.some(item => item.name.toLowerCase() === name.toLowerCase())) {
        alert("tên đã có trong danh sách");
        return;
    }

    // ---- Chế độ sửa (nếu editID đã được gán từ trước) ----
    if (editID !== null) {
        const student = students.find(item => item.id === editID);
        if (student) {
            student.name = name;
        }
        editID = null;
        them.textContent = "Add"; // trả lại nút về trạng thái "Add" sau khi sửa xong

    // ---- Chế độ thêm mới ----
    } else {
        students.push({
            id: Date.now(), // dùng timestamp làm id duy nhất
            name: name
        });
    }

    savedata(); // lưu lại vào LocalStorage
    render();   // vẽ lại danh sách
    tensv.value = ""; // xóa nội dung ô input
}

// ===== Xóa sinh viên theo id =====
function xoa(id) {
    students = students.filter(item => item.id !== id);
    savedata();
    render();
}

// ===== Chuẩn bị sửa sinh viên: đưa tên vào ô input, lưu editID =====
function sua(id) {
    const student = students.find(item => item.id === id);
    if (!student) return;

    tensv.value = student.name;
    editID = id;
    them.textContent = "Lưu"; // đổi nút thành "Lưu" để báo đang ở chế độ sửa
}

// ===== Tìm kiếm sinh viên theo tên (dùng chung ô input tensv) =====
timkiem.addEventListener("click", function () {
    const keyword = tensv.value.trim().toLowerCase();

    if (keyword === "") {
        render(); // nếu không nhập gì thì hiện lại toàn bộ danh sách
        return;
    }

    const result = students.filter(item =>
        item.name.toLowerCase().includes(keyword)
    );
    render(result);
});

// ===== Hiển thị danh sách ngay khi tải trang =====
render();