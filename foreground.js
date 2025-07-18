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

function elementContainsCompanyName(element, word) {
    const text = element.innerText || element.textContent || "";
    return text.toLowerCase().includes(word.toLowerCase());
}

const targetElement = ".artdeco-entity-lockup__subtitle";

const targetWord = ".ai"

const elementSet = new ObservableSet((element => {
    if (elementContainsCompanyName(element, targetWord)){
        console.log("Element contains the word");
        elementSet.delete(element);
        element.remove();
    }
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

          
          