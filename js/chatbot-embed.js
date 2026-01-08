(() => {
  // 1) Floating button
  const btn = document.createElement("button");
  btn.id = "vh-chat-btn";
  btn.type = "button";
  btn.innerHTML = "💬";
  document.body.appendChild(btn);

  // 2) Chat window (iframe to your chatbot server)
  const box = document.createElement("div");
  box.id = "vh-chat-box";
  box.innerHTML = `
    <div id="vh-chat-head">
      <span>Vaible Chat</span>
      <button id="vh-chat-close" type="button">✕</button>
    </div>
    <iframe
      src="http://localhost:3000"
      title="Vaible Chatbot"
      frameborder="0"
      style="width:100%;height:100%;border:0;"
    ></iframe>
  `;
  document.body.appendChild(box);

  // 3) Toggle open/close
  const open = () => (box.style.display = "block");
  const close = () => (box.style.display = "none");
  btn.addEventListener("click", open);
  box.querySelector("#vh-chat-close").addEventListener("click", close);

  // Default hidden
  close();
})();