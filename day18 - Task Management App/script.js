// ===== Lấy các phần tử DOM =====
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const search = document.getElementById("search");
const filter = document.getElementById("filter");
const total = document.getElementById("total");
const done = document.getElementById("done");
const pending = document.getElementById("pending");

// Đọc danh sách công việc đã lưu (nếu chưa có gì thì bắt đầu với mảng rỗng)
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Lưu danh sách công việc vào LocalStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Hiển thị danh sách công việc (data mặc định là toàn bộ tasks,
// nhưng có thể truyền vào danh sách đã lọc/tìm kiếm)
function render(data = tasks) {
    taskList.innerHTML = "";

    data.forEach(task => {
        taskList.innerHTML += `
            <div class="task ${task.completed ? "done" : ""}">
                <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTask(${task.id})">
                <span>${task.title}</span>
                <button onclick="editTask(${task.id})">Edit</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
    });

    updateStats();
}

// Thêm công việc mới
function addTask() {
    const title = taskInput.value.trim();
    if (title === "") return alert("Vui lòng nhập công việc");

    // Không cho thêm trùng tên (không phân biệt hoa thường)
    if (tasks.some(task => task.title.toLowerCase() === title.toLowerCase())) {
        return alert("Công việc đã tồn tại, hãy nhập việc mới");
    }

    tasks.push({ id: Date.now(), title, completed: false });
    saveTasks();
    taskInput.value = "";
    render();
}
addBtn.addEventListener("click", addTask);

// Xóa công việc theo id
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    render();
}

// Sửa tên công việc (dùng prompt cho gọn)
function editTask(id) {
    const task = tasks.find(task => task.id === id);
    if (!task) return;

    const newTitle = prompt("Nhập công việc mới", task.title);
    if (newTitle && newTitle.trim() !== "") {
        task.title = newTitle.trim();
        saveTasks();
        render();
    }
}

// Đổi trạng thái hoàn thành / chưa hoàn thành
function toggleTask(id) {
    const task = tasks.find(task => task.id === id);
    if (!task) return;

    task.completed = !task.completed;
    saveTasks();
    render();
}

// Tìm kiếm công việc theo tên, lọc ngay khi đang gõ
search.addEventListener("input", function () {
    const keyword = search.value.toLowerCase().trim();
    const result = tasks.filter(task => task.title.toLowerCase().includes(keyword));
    render(result);
});

// Lọc công việc theo trạng thái: tất cả / đã xong / chưa xong
filter.addEventListener("change", function () {
    const value = filter.value;

    if (value === "done") {
        render(tasks.filter(task => task.completed));
    } else if (value === "pending") {
        render(tasks.filter(task => !task.completed));
    } else {
        render(tasks);
    }
});

// Cập nhật số liệu thống kê (tổng / đã xong / chưa xong)
function updateStats() {
    total.textContent = tasks.length;
    done.textContent = tasks.filter(task => task.completed).length;
    pending.textContent = tasks.filter(task => !task.completed).length;
}

// Hiển thị danh sách ngay khi tải trang
render();