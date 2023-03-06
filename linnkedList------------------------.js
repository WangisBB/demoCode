const defaultEquals = (a, b) => a === b;
class Node {
    constructor(element) {
        this.element = element;
        this.next = undefined
    }
}

class linkedList {
    constructor(equalsFn = defaultEquals) {
        this.count = 0;
        this.head = undefined
        this.equalsFn = equalsFn
    }
    push(element) {
        const node = new Node(element);
        let current;
        if (this.head == null) {
            this.head = node
        } else {
            current = this.head;
            while (current.next != null) {
                current = current.next
            }
            current.next = node
        }
        this.count++
    }
}