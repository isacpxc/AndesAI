document.addEventListener("mouseup", (e) => {
  const selectedText = window.getSelection().toString().trim();

  if (selectedText.length > 0) {
    mouseX = e.pageX;
    mouseY = e.pageY;

    const btnImprove = document.createElement("button");
    btnImprove.innerHTML = "Improve";
    btnImprove.id = "btn-improve-andesai";
    btnImprove.style.left = `${mouseX + 5}px`;
    btnImprove.style.top = `${mouseY + 5}px`;

    console.log(btnImprove);
    document.body.appendChild(btnImprove);
  }
});
