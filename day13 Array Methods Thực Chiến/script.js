// const ketqua = document.getElementById("ketqua");
// const timkiem = document.getElementById("timkiem");
// const products = [
//     {
//         id:1,
//         name:"Áo",
//         price:100
//     },
//     {
//         id:2,
//         name:"Quần",
//         price:200
//     },
//     {
//         id:3,
//         name:"Giày",
//         price:300
//     }
// ];

// // hiện thị sản phẩm (map())
//  const show = products.map(item => item.name);
//  console.log(show);

//  // lọc sp giá trên 150 (filter())
//  const loc = products.filter(item => item.price >= 150)
//  console.log(loc);

//  //tìm kiêm find()
//  const timso = products.find( item => item.id === 2);
//  console.log(timso);

// // tính tổng tiền 
// const tong = products.reduce((sum, item)=> sum + item.price,0);
// console.log(tong);

const ketqua = document.getElementById("ketqua");
        const timkiem = document.getElementById("timkiem");
        const btnTimKiem = document.getElementById("btnTimKiem");

        const products = [
            { id: 1, name: "Áo", price: 100 },
            { id: 2, name: "Quần", price: 200 },
            { id: 3, name: "Giày", price: 300 }
        ];

        function timKiemSanPham() {
            const value = timkiem.value.toLowerCase().trim();
            const result = products.filter(item => item.name.toLowerCase().includes(value));

            ketqua.innerHTML = "";

            if (value === "") {
                return; // chưa nhập gì thì không hiện gì cả
            }

            if (result.length === 0) {
                ketqua.innerHTML = "<p>Không tìm thấy sản phẩm nào.</p>";
                return;
            }

            result.forEach(item => {
                ketqua.innerHTML += `<p>${item.name} - ${item.price}đ</p>`;
            });
        }

        // Bấm nút để tìm kiếm
        btnTimKiem.addEventListener("click", timKiemSanPham);

        // Nhấn Enter trong ô input cũng tìm kiếm
        timkiem.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                timKiemSanPham();
            }
        });

        // Vẫn giữ tìm kiếm realtime khi gõ (tùy chọn, có thể xóa nếu chỉ muốn tìm khi bấm nút)
        timkiem.addEventListener("input", timKiemSanPham);