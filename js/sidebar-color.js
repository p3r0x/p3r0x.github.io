document.addEventListener("DOMContentLoaded", function() {
    // 改名字颜色
    let name = document.querySelector(".sidebar-avatar .avatar-name");
    if(name) name.style.color = "#000";

    // 改个性签名颜色
    let subtitle = document.querySelector(".sidebar-subtitle");
    if(subtitle) subtitle.style.color = "#000";
});
