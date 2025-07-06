async function improveTxtAction(e, range, activeElement) {
  e.stopPropagation();

  const button = e.currentTarget;
  const originalContent = button.innerHTML;

  button.disabled = true;
  button.innerHTML = '<div class="andes-spinner"></div>';
  const spinner = document.getElementsByClassName("andes-spinner")[0];

  const textToImprove = window.getSelection().toString().trim();
  console.log(`Enviando para a API: ${textToImprove}`);

  url = "http://127.0.0.1:5000/improve";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text_to_improve: textToImprove }),
    });

    if (!response.ok) {
      throw new Error(`Network Error: ${response.statusText}`);
    }

    const data = await response.json();
    const btnRect = button.getBoundingClientRect();
    const leftX = btnRect.left + window.scrollX;
    const topY = btnRect.top + window.scrollY;

    spinner.remove();
    button.remove();

    const modalContainer = document.createElement("div");

    modalContainer.id = "menu-improved-text";
    modalContainer.style.top = `${topY}px`;
    modalContainer.style.left = `${leftX}px`;

    modalContainer.innerHTML = `
      <span id="andes-text-title">Improved Text</span>
      <div id="andes-textarea">${data.improved_text}</div>
      <div id="andes-toolbar">
        <button class="andes-toolbar-button">Replace</button>
        <button class="andes-toolbar-button">Copy</button>
      </div>`;

    document.body.appendChild(modalContainer);

    const copyButton = modalContainer.querySelector(
      ".andes-toolbar-button:last-child"
    );

    const replaceButton = modalContainer.querySelector(
      ".andes-toolbar-button:first-child"
    );

    replaceButton.addEventListener("click", (e) => {
      if (activeElement.tagName === "TEXTAREA") {
        const text = activeElement.value;
        activeElement.value =
          text.slice(0, activeElement.selectionStart) +
          improvedText +
          text.slice(activeElement.selectionEnd);
      } else {
        range.deleteContents();
        const newTextNode = document.createTextNode(improvedText);
        range.insertNode(newTextNode);
      }
      modalContainer.remove();
    });

    const improvedText = data.improved_text;

    copyButton.addEventListener("click", (e) => {
      // É mais eficiente pegar a referência do botão a partir do evento
      const button = e.currentTarget;

      navigator.clipboard
        .writeText(improvedText)
        .then(() => {
          button.textContent = "Copied! ✅";
          button.style.backgroundColor = "#2ecc71";

          setTimeout(() => {
            button.textContent = "Copy";
            button.style.backgroundColor = "";
          }, 2000);
        })
        .catch((err) => {
          console.error("Falha ao copiar texto: ", err);
          button.textContent = "Error! ❌";
          button.style.backgroundColor = "#e74c3c";

          setTimeout(() => {
            button.textContent = "Copy";
            button.style.backgroundColor = "";
          }, 2500);
        });
    });

    // console.log("Resposta do Llama:", data.improved_text);
  } catch (e) {
    console.log("Error during process: " + e);
  } finally {
    window.getSelection().removeAllRanges();
    spinner.remove();
    if (button) {
      button.remove();
    }
    // console.log(e);
    // e.target.remove();
  }
}

function setupListeners() {
  document.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    const btnImproveTest = document.getElementById("btn-improve-andesai");
    const andesTextArea = document.getElementById("menu-improved-text");
    if (btnImproveTest && e.target.id != "btn-improve-andesai") {
      btnImproveTest.remove();
    }
    if (
      andesTextArea &&
      e.target.id != "menu-improved-text" &&
      e.target.id != "andes-text-title" &&
      e.target.id != "andes-textarea" &&
      e.target.id != "andes-toolbar" &&
      e.target.classList[0] != "andes-toolbar-button"
    ) {
      andesTextArea.remove();
    }
  });

  document.addEventListener("mouseup", (e) => {
    setTimeout(() => {
      const selectedText = window.getSelection().toString().trim();
      if (selectedText.length === 0) return;

      const activeElement = document.activeElement;
      const isEditableField =
        activeElement.tagName === "TEXTAREA" || activeElement.isContentEditable;

      const existingButton = document.getElementById("btn-improve-andesai");
      if (existingButton) return;

      if (isEditableField) {
        const range = window.getSelection().getRangeAt(0);
        console.log("entrnado");
        mouseX = e.pageX;
        mouseY = e.pageY;

        const btnImprove = document.createElement("button");
        btnImprove.innerHTML = "Improve ✨";
        btnImprove.id = "btn-improve-andesai";
        btnImprove.style.left = `${mouseX + 5}px`;
        btnImprove.style.top = `${mouseY + 5}px`;

        btnImprove.addEventListener("click", (event) => {
          improveTxtAction(event, range, activeElement);
        });

        // console.log(btnImprove);
        document.body.appendChild(btnImprove);
      }
    }, 10); // Delay de 10 milissegundos
  });
}

setupListeners();
