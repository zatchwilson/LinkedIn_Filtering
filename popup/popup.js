//Load blocklist from chrome storage 
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['blocklist'], (result) => {
      const blocklist = result.blocklist || [];
      blocklist.forEach(addBlockItem);
    });
});

//Add event listener 
document.getElementById('add-block').addEventListener('click', () => {
    const input = document.getElementById('blocklist-input');
    const value = input.value.trim();
    if (value) {
        chrome.storage.sync.get(['blocklist'], (result) => {
            const blocklist = result.blocklist || [];
            if (!blocklist.includes(value)) {
              blocklist.push(value);
              chrome.storage.sync.set({ blocklist }, () => {
                addBlockItem(value);
              });
            }
          });      
        input.value = '';
    }
});
  
function addBlockItem(text) {
    const list = document.getElementById('blocklist-items');

    const li = document.createElement('li');
    li.className = 'blocklist-item';

    const spanText = document.createElement('span');
    spanText.textContent = text;

    const removeBtn = document.createElement('span');
    removeBtn.textContent = '×';
    removeBtn.className = 'remove-btn';
    removeBtn.addEventListener('click', () => {
        li.remove();
        chrome.storage.sync.get(['blocklist'], (result) => {
            let blocklist = result.blocklist || [];
            blocklist = blocklist.filter(item => item !== text);
            chrome.storage.sync.set({ blocklist });
        });
    });

    li.appendChild(spanText);
    li.appendChild(removeBtn);
    list.appendChild(li);
}