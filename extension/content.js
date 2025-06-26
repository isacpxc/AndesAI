async function improveTxtAction(e) {
  e.stopPropagation();

  const button = e.currentTarget;
  const originalContent = button.innerHTML;

  button.disabled = true;
  button.innerHTML = '<div class="andes-spinner"></div>';

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
    spinner = document.getElementsByClassName("andes-spinner")[0];
    spinner.remove();
    button.disabled = false;

    button.innerHTML = `text improved: ${data.improved_text}`;
    // console.log("Resposta do Llama:", data.improved_text);
  } catch (e) {
    console.log("Error during process: " + e);
  } finally {
    window.getSelection().removeAllRanges();
    // console.log(e);
    // e.target.remove();
  }
}

function setupListeners() {
  document.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    const btnImrpoveTest = document.getElementById("btn-improve-andesai");
    if (btnImrpoveTest && e.target.id != "btn-improve-andesai") {
      btnImrpoveTest.remove();
    }
  });

  document.addEventListener("mouseup", (e) => {
    const selectedText = window.getSelection().toString().trim();
    const btnImrpoveTest = document.getElementById("btn-improve-andesai");

    if (selectedText.length > 0 && btnImrpoveTest == null) {
      mouseX = e.pageX;
      mouseY = e.pageY;

      const btnImprove = document.createElement("button");
      btnImprove.innerHTML = "Improve ✨";
      btnImprove.id = "btn-improve-andesai";
      btnImprove.style.left = `${mouseX + 5}px`;
      btnImprove.style.top = `${mouseY + 5}px`;
      btnImprove.addEventListener("click", improveTxtAction);

      // console.log(btnImprove);
      document.body.appendChild(btnImprove);
    }
  });
}

setupListeners();
