export class Queue<T> {

    private items: Record<number, T> = {};
    private headIndex = 0;
    private tailIndex = 0;

    enqueue(item: T) {
        this.items[this.tailIndex] = item;
        this.tailIndex++;
    }

    dequeue() {
        if (this.validate()) {
            const item = this.items[this.headIndex];
            delete this.items[this.headIndex];
            this.headIndex++;
            return item;
        }
    }

    peek() {
        if (this.validate()) {
            return this.items[this.headIndex];
        }
    }

    validate() { // validation logic
        if (this.headIndex === this.tailIndex) {
            return false;
        }
        return true;
    }

    get length() {
        return this.tailIndex - this.headIndex;
    }

    toArray() {
        return Object.values(this.items);
    }
}
