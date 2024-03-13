const ci = document.querySelector("#chat-input")
const send = document.querySelector("#send-btn")
const chatContainer = document.querySelector(".chat-container")
const del = document.querySelector("#delete-btn")
let ut=null
const ih = ci.scrollHeight
const API_kEY = ""

const loadDataFrom = () => {
    const defaulet =`<div class="default-text">
                       <h1>GPT_CLONE</h1>
                       <br>
                        <p>Start a conversation with Chat GPT . ( This is a clone that is developed as a project)</p>
                        </div>`
    chatContainer.innerHTML=localStorage.getItem("all-chats") || defaulet
    chatContainer.scrollTo(0,chatContainer.scrollHeight)

}
loadDataFrom()

const createElement =(html,className) =>{
    const chatDiv = document.createElement("div")
    chatDiv.classList.add("chat",className)
    chatDiv.innerHTML=html
    return chatDiv
}
const getChatResponse = async (incomingDiv) => {
    const API = "https://api.openai.com/v1/completions";
    const p = document.createElement("p");
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_kEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo-instruct",
            prompt: ut, // Use the user's input as the prompt
            max_tokens: 2048,
            temperature: 0.2,
            n: 1,
            stop: null
        })
    };

    try {
        const response = await fetch(API, requestOptions);
        if (!response.ok) {
            throw new Error('Failed to fetch response from OpenAI API.');
        }
        
        const data = await response.json();
        if (!data.choices || !data.choices.length || !data.choices[0].text) {
            throw new Error('Invalid response from OpenAI API.');
        }
        
        p.textContent = data.choices[0].text.trim();
    } catch (error) {
        console.error(error);
        p.textContent = 'Error: Failed to get response from AI.';
    }

    incomingDiv.querySelector(".typing-animation").remove();
    incomingDiv.querySelector(".chat-details").appendChild(p);
    localStorage.setItem("all-chats",chatContainer.innerHTML)
};

const copyresponse =(copyBtn) => {
    const responseTextElement = copyBtn.parentElement.querySelector("p")
    navigator.clipboard.writeText(responseTextElement.textContent)
    copyBtn.textContent="done"
    setTimeout( () => copyBtn.textContent ="content_copy",1000)
}


const showtypani = () => {

    const html=`<div class="chat-content">
                   <div class="chat-details">
                      <img src="./static/chatbot.jpg">
                      <div class="typing-animation">
                             <div class="typing-dot" style="--delay:0.2s"></div>
                             <div class="typing-dot" style="--delay:0.3s"></div>
                             <div class="typing-dot" style="--delay:0.4s"></div>
                      </div>
                   </div>
                   <span  onclick="copyresponse(this)"class="material-symbols-rounded">content_copy</span>
                </div>`;
    const incomingDiv = createElement(html,"incoming"); 
    chatContainer.appendChild(incomingDiv)
    getChatResponse(incomingDiv)
}

const handleOutgoingChat = () => {
    ut = ci.value.trim();
    ci.value=""
    ci.style.height =`${ih}px`
    const html=`<div class="chat-content">
                     <div class="chat-details">
                          <img src="./static/user.jpeg">
                          <p>${ut}</p>
                     </div>
                </div>`;
    const OutchatDiv = createElement(html,"outgoing"); 
    document.querySelector(".default-text")?.remove()
    chatContainer.appendChild(OutchatDiv)
    chatContainer.scrollTo(0,chatContainer.scrollHeight)
    setTimeout(showtypani,500)
}

del.addEventListener("click" , () => {
    if (confirm("Are u sure ?")){
        localStorage.removeItem("all-chats")
    }
})



ci.addEventListener("input",() => {
    ci.style.height =`${ih}px`
    ci.style.height=`${ci.scrollHeight}px`
})
ci.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleOutgoingChat();
    }
});

send.addEventListener("click",handleOutgoingChat);
