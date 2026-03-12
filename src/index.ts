// alt1 base libs
import * as a1lib from "alt1";
import ChatboxReader from "alt1/chatbox";  // CORRIGIDO: importação padrão

// Arquivos necessários
import "./index.html";
import "./appconfig.json";
import "./css/style.css";
import "./icon.png";

// CORRIGIDO: Type assertions para todos os elementos DOM
const itemList = document.querySelector(".itemList") as HTMLElement;
const chatSelector = document.querySelector(".chat") as HTMLSelectElement;  // IMPORTANTE: HTMLSelectElement
const exportButton = document.querySelector(".export") as HTMLElement;
const clearButton = document.querySelector(".clear") as HTMLElement;
const listHeader = document.querySelector(".header") as HTMLElement;
const itemTotal = document.getElementById("total") as HTMLElement;

const appColor = a1lib.mixColor(0, 255, 255); // Cor ciano para o overlay
const timestampRegex = /\[\d{2}:\d{2}:\d{2}\]/g;
const reader = new ChatboxReader();
const appName = "RingTracker";

// Regex para capturar drops dos anéis
const ringRegexes = {
    lotd: /\[\d{2}:\d{2}:\d{2}\] Your Luck of the Dwarves shines brightly and you receive: (\d+) x (.+)/,
    hazelmereNormal: /\[\d{2}:\d{2}:\d{2}\] Your Hazelmere's signet ring shines brightly\. You receive: (\d+) x (.+)/,
    hazelmereDouble: /\[\d{2}:\d{2}:\d{2}\] The power of Hazelmere blesses your drop and doubles it before your very eyes: (\d+) x (.+)/
};

// Cores das mensagens no chat
const ringColors = [
    a1lib.mixColor(245, 124, 1),   // Laranja para LOTD
    a1lib.mixColor(255, 215, 0),    // Dourado para Hazelmere
    a1lib.mixColor(255, 215, 0)     // Dourado para Hazelmere (double)
];

//check if we are running inside alt1
if (window.alt1) {
    alt1.identifyAppUrl("./appconfig.json");
} else {
    let addappurl = `alt1://addapp/${new URL("./appconfig.json", document.location.href).href}`;
    let newEle = `<li>Alt1 not detected, click <a href='${addappurl}'>here</a> to add this app to Alt1</li>`;
    itemList.insertAdjacentHTML("beforeend", newEle);
}

// Configurar o leitor de chat para detectar as cores dos drops
reader.readargs = {
    colors: ringColors,
};

window.setTimeout(function () {
    //Encontrar todos os chats visíveis
    let findChat = setInterval(function () {
        if (reader.pos === null) reader.find();
        else {
            clearInterval(findChat);
            reader.pos.boxes.map((box, i) => {
                chatSelector.insertAdjacentHTML("beforeend", `<option value=${i}>Chat ${i}</option>`);
            });

            // Lógica para trocar de chat
            chatSelector.addEventListener("change", function (this: HTMLSelectElement) {
                reader.pos.mainbox = reader.pos.boxes[Number(this.value)];
                showSelectedChat(reader.pos);
                updateSaveData({ chat: Number(this.value) });
                this.value = "";  // Agora funciona porque this é HTMLSelectElement
            });

            if (getSaveData("chat") !== false) {
                reader.pos.mainbox = reader.pos.boxes[Number(getSaveData("chat"))];
            } else {
                reader.pos.mainbox = reader.pos.boxes[0];
                updateSaveData({ chat: 0 });
            }
            showSelectedChat(reader.pos);
            
            showItems();
            
            setInterval(function () {
                readChatbox();
            }, 600);
        }
    }, 1000);
}, 50);

// Função principal para ler e processar o chat
function readChatbox() {
    var opts = reader.read() || [];
    var chatStr = "";
    var chatArr;

    if (opts.length != 0) {
        for (let line in opts) {
            if (!opts[line].text.match(timestampRegex) && line == "0") {
                continue;
            }
            
            if (opts[line].text.match(timestampRegex)) {
                if (Number(line) > 0) {
                    chatStr += "\n";
                }
                chatStr += opts[line].text + " ";
                continue;
            }
            chatStr += opts[line].text;
        }
    }
    
    if (chatStr.trim() != "") {
        chatArr = chatStr.trim().split("\n");
    }
    
    for (let line in chatArr) {
        let chatLine = chatArr[line].trim();
        
        if (isInHistory(chatLine)) {
            continue;
        }
        
        let dropDetected = false;
        let dropType = '';
        let match = null;
        
        match = chatLine.match(ringRegexes.lotd);
        if (match) {
            dropDetected = true;
            dropType = 'LOTD';
        }
        
        if (!dropDetected) {
            match = chatLine.match(ringRegexes.hazelmereNormal);
            if (match) {
                dropDetected = true;
                dropType = 'Hazelmere';
            }
        }
        
        if (!dropDetected) {
            match = chatLine.match(ringRegexes.hazelmereDouble);
            if (match) {
                dropDetected = true;
                dropType = 'Hazelmere (Double)';
            }
        }
        
        if (dropDetected && match) {
            const quantidade = parseInt(match[1]);
            const item = match[2].trim();
            
            let dropItem = {
                item: `${quantidade} x ${item}`,
                quantidade: quantidade,
                nome: item,
                tipo: dropType,
                time: new Date(),
                chatLine: chatLine,
                timestamp: new Date().toISOString()
            };
            
            console.log(`${dropType} Drop detectado:`, dropItem);
            updateSaveData({ data: dropItem });
            updateChatHistory(chatLine);
            checkAnnounce(dropItem);
            showItems();
        }
    }
}

function updateChatHistory(chatLine: string) {
    if (!sessionStorage.getItem(`${appName}chatHistory`)) {
        sessionStorage.setItem(`${appName}chatHistory`, `${chatLine}\n`);
        return;
    }
    var history = sessionStorage.getItem(`${appName}chatHistory`)?.split("\n") || [];
    while (history.length > 100) {
        history.splice(0, 1);
    }
    history.push(chatLine.trim());
    sessionStorage.setItem(`${appName}chatHistory`, history.join("\n"));
}

function isInHistory(chatLine: string): boolean {
    const history = sessionStorage.getItem(`${appName}chatHistory`);
    if (history) {
        for (let historyLine of history.split("\n")) {
            if (historyLine.trim() == chatLine) {
                return true;
            }
        }
    }
    return false;
}

function showItems() {
    if (!itemList || !listHeader || !itemTotal) return;
    
    itemList.querySelectorAll("li.item").forEach((el) => el.remove());
    const data = getSaveData("data");
    itemTotal.innerHTML = String(data ? data.length : 0);

    if (getSaveData("mode") == "total") {
        listHeader.dataset.show = "history";
        listHeader.title = "Click to show History";
        listHeader.innerHTML = "Ring Drop Totals";
        let total = getTotal();
        Object.keys(total)
            .sort()
            .forEach((item) => {
                const itemData = total[item];
                itemList.insertAdjacentHTML(
                    "beforeend", 
                    `<li class="list-group-item item">${item}: ${itemData.total} (LOTD: ${itemData.lotd} | Hazel: ${itemData.hazelmere})</li>`
                );
            });
    } else {
        listHeader.dataset.show = "total";
        listHeader.title = "Click to show Totals";
        listHeader.innerHTML = "Ring Drop History";
        
        if (data && data.length > 0) {
            data.slice()
                .reverse()
                .forEach((item) => {
                    const ringIcon = item.tipo.includes('LOTD') ? '💎' : '👑';
                    itemList.insertAdjacentHTML(
                        "beforeend",
                        `<li class="list-group-item item" title="${new Date(item.time).toLocaleString()} - ${item.tipo}">
                            ${ringIcon} ${item.item}
                        </li>`
                    );
                });
        }
    }
}

function checkAnnounce(dropItem: any) {
    const webhook = getSaveData("discordWebhook");
    if (webhook) {
        const ringEmoji = dropItem.tipo.includes('LOTD') ? '💎' : '👑';
        fetch(webhook, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: "Ring Tracker",
                content: `${ringEmoji} ${new Date(dropItem.time).toLocaleString()}: ${dropItem.tipo} - ${dropItem.item}`,
            }),
        }).catch(error => console.error("Erro ao enviar para Discord:", error));
    }
}


function getTotal() {
    let total: { [key: string]: { total: number; lotd: number; hazelmere: number } } = {};
    const data = getSaveData("data");
    
    if (data && Array.isArray(data)) {
        data.forEach((item: any) => {
            if (!total[item.nome]) {
                total[item.nome] = {
                    total: 0,
                    lotd: 0,
                    hazelmere: 0
                };
            }
            
            total[item.nome].total += item.quantidade;
            
            if (item.tipo.includes('LOTD')) {
                total[item.nome].lotd += item.quantidade;
            } else {
                total[item.nome].hazelmere += item.quantidade;
            }
        });
    }
    return total;
}

if (exportButton) {
    exportButton.addEventListener("click", function () {
        var str, fileName;
        
        if (getSaveData("mode") == "total") {
            str = "Item,Total Quantity,From LOTD,From Hazelmere\n";
            let total = getTotal();
            Object.keys(total)
                .sort()
                .forEach((item) => {
                    str = `${str}${item},${total[item].total},${total[item].lotd},${total[item].hazelmere}\n`;
                });
            fileName = "Ring_Tracker_Totals.csv";
        } else {
            str = "Item,Quantity,Ring Type,Date,Time\n";
            const data = getSaveData("data");
            if (data && Array.isArray(data)) {
                data.forEach((item: any) => {
                    const date = new Date(item.time);
                    str = `${str}${item.nome},${item.quantidade},${item.tipo},${date.toLocaleDateString()},${date.toLocaleTimeString()}\n`;
                });
            }
            fileName = "Ring_Tracker_History.csv";
        }
        
        var blob = new Blob([str], { type: "text/csv;charset=utf-8;" });
        var link = document.createElement("a");
        if (link.download !== undefined) {
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", fileName);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    });
}

if (clearButton) {
    clearButton.addEventListener("click", function () {
        localStorage.removeItem(appName);
        localStorage.setItem(appName, JSON.stringify({ chat: 0, data: [], mode: "history" }));
        location.reload();
    });
}

if (listHeader) {
    listHeader.addEventListener("click", function () {
        updateSaveData({ mode: this.dataset.show });
        showItems();
    });
}

function showSelectedChat(chat: any) {
    try {
        if (chat && chat.mainbox && chat.mainbox.rect) {
            alt1.overLayRect(appColor, chat.mainbox.rect.x, chat.mainbox.rect.y, chat.mainbox.rect.width, chat.mainbox.rect.height, 2000, 5);
        }
    } catch (error) {
        console.error("Erro ao mostrar overlay:", error);
    }
}

// Inicialização
(function () {
    if(!localStorage.getItem("RingData") &&
       !localStorage.getItem("RingTotal") &&
       !localStorage.getItem("RingChat") &&
       !localStorage.getItem(appName)) {
        localStorage.setItem(appName, JSON.stringify({ chat: 0, data: [], mode: "history" }));
        location.reload();
    }

    if (localStorage.getItem("RingData")) {
        const oldData = JSON.parse(localStorage.getItem("RingData") || "[]");
        if (Array.isArray(oldData)) {
            updateSaveData({ data: oldData });
        }
        localStorage.setItem("RingDataBackup", localStorage.getItem("RingData") || "");
        localStorage.removeItem("RingData");
    }
    if (localStorage.getItem("RingTotal")) {
        updateSaveData({ mode: localStorage.getItem("RingTotal") });
        localStorage.removeItem("RingTotal");
    }
    if (localStorage.getItem("RingChat")) {
        updateSaveData({ chat: Number(localStorage.getItem("RingChat")) });
        localStorage.removeItem("RingChat");
    }

    // Configurar Discord webhook se existir
    const webhookInput = document.getElementById('discordWebhook') as HTMLInputElement;
    if (webhookInput) {
        webhookInput.addEventListener('change', function() {
            updateSaveData({ discordWebhook: this.value });
        });
        
        const savedWebhook = getSaveData('discordWebhook');
        if (savedWebhook) {
            webhookInput.value = savedWebhook;
        }
    }
})();

function updateSaveData(...dataset: any[]) {
    const lsData = JSON.parse(localStorage.getItem(appName) || 'null') || { chat: 0, data: [], mode: "history" };
    
    for (let data of dataset) {
        const key = Object.keys(data)[0];
        const value = data[key];
        
        if (key == "data") {
            if (!lsData[key]) {
                lsData[key] = [];
            }
            
            if (Array.isArray(value)) {
                lsData[key] = value;
            } 
            else if (typeof value === 'object' && value !== null) {
                lsData[key].push(value);
            }
        } else {
            lsData[key] = value;
        }
    }
    
    localStorage.setItem(appName, JSON.stringify(lsData));
}

function getSaveData(name: string) {
    try {
        const lsData = JSON.parse(localStorage.getItem(appName) || 'null');
        return lsData ? lsData[name] : false;
    } catch {
        return false;
    }
}