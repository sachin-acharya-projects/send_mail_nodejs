const button = document.querySelector(".attachmentDivision p");
const input = document.getElementById("attach");

button.addEventListener("click",()=>{
    input.click();
})

input.addEventListener("change",(e)=>{
    const files = e.srcElement.files;
    button.innerHTML = "";
    for(let i=0;i < files.length;i++){
        button.innerHTML += `<strong>${files[i].name},</strong><br>`;
    }
})