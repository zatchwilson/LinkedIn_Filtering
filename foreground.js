// This script gets injected into any opened page
// whose URL matches the pattern defined in the manifest
// (see "content_script" key).
// Several foreground scripts can be declared
// and injected into the same or different pages.

class ObservableSet {
    constructor(onAddCallback){
        this.set = new Set();
        this.onAdd = onAddCallback;
    }

    add(value) {
        const sizeBefore = this.set.size;
        this.set.add(value);
        if (this.set.size > sizeBefore) {
            this.onAdd(value);
        }
        return this;
    }

    has(value) {
        return this.set.has(value);
    }

    delete(value) {
        return this.set.delete(value);
    }

    clear() {
        this.set.clear();
    }

    [Symbol.iterator]() {
        return this.set[Symbol.iterator]();
    }
}

function elementContainsCompanyName(element) {

    return new Promise((resolve) => {
        const text = element.innerText || element.textContent || "";

        if (text == ""){
            resolve(false);
            return;
        }

        chrome.storage.sync.get(['blocklist'], (result) => {
            const blocklist = result.blocklist || [];
    
            for (let word of blocklist) {
    
                if (word && text.toLowerCase().includes(word.toLowerCase())) {
                    resolve(true);
                    return;
                }
            }

            resolve (false);
        });

    }); 
}

const targetElement = ".artdeco-entity-lockup__subtitle";


const elementSet = new ObservableSet((element => {
    (async() => {
        const contains = await elementContainsCompanyName(element);
        if (contains) {
            elementSet.delete(element);
            element.remove();
        }
    })();
}));

const observer = new MutationObserver((mutations, observerInstance) =>{
    const element = document.querySelector(targetElement);

    if (element) {
        console.log('Result loaded');
        const jobSet = document.getElementsByClassName("job-card-container");

        for (let item of jobSet) {
            elementSet.add(item);
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

          
          