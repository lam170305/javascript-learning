const giohang = document.getElementById("giohang");
const soluong = document.getElementById("soluong");
const tongtien = document.getElementById("tongtien");
const cart = JSON.parse(localStorage.getItem("cart")) || [];
const sp = [
    {
        id: 1,
        name: "Áo Sweater",
        price: 199000,
    },
    {
        id: 2,
        name: "Quần Jeans",
        price: 299000,
    },
];


    //nút mua quần
document.getElementById("muaao").onclick = () => themsp(sp[0]);
document.getElementById("muaquan").onclick = () => themsp(sp[1]);

function muabansp() {
    giohang.innerHTML = `Giỏ hàng: ${cart.length} sản phẩm`;

    soluong.innerHTML = cart.map((item, index) => `
        <div>
            ${item.name}
            <button onclick="giamsp(${index})">-</button>
            ${item.quantity}
            <button onclick="tangsp(${index})">+</button>

             - ${(item.price * item.quantity).toLocaleString()}đ
        </div>
    `).join("");
    tong();
}

function themsp(product){
    const item = cart.find(cartItem => cartItem.id === product.id);
    if(item){
        const xacnhan = confirm(`${product.name} đã có trong giỏ hàng rồi.\n Bạn có chắc muốn thêm`)
        if(!xacnhan){
            return;
        }
        item.quantity++;
    }else{
        cart.push({
            ...product,
            quantity: 1
        });
    }
    localStorage.setItem("cart",JSON.stringify(cart));
    muabansp();
}

function tong(){
    const tong = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    tongtien.innerHTML = `Tổng tiền: ${tong.toLocaleString()}đ`;
}

function tangsp(index){
    cart[index].quantity++;
    localStorage.setItem("cart",JSON.stringify(cart));
    muabansp();
}

function giamsp(index){
    if(cart[index].quantity > 1){
        cart[index].quantity--;
    }else{
        cart.splice(index,1);
    }
    localStorage.setItem("cart",JSON.stringify(cart));
    muabansp();
}
muabansp();

