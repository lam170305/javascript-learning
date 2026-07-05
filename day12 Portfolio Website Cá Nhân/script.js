const kynang = document.getElementById("kynang");
const project = document.getElementById("duan")
const skills = [
    "HTML",
    "CSS",
    "JavaScript",
    "PHP",
    "MySQL"
];

for (const item of skills) {
    kynang.innerText += item +"\n";
}


const projects = [
    {
        name: "Todo List"
    },
    {
        name: "Website Bán Hàng"
    },
    {
        name: "Quản Lý Chi Tiêu"
    }
];

for (const item of projects) {
    project.innerHTML += `
    <div class = "card">
    <h3>${item.name}</h3>
    </div>
    `;
}


const btn = document.querySelector(".btnmode");
btn.addEventListener("click", function(){
    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        btn.textContent = "Light Mode";
    }else{
        btn.textContent = "Dark Mode";
    }
});