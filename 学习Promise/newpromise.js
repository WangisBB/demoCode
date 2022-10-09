class MyPromise {
    constructor(callback) {
        this.result = null;
        this.state = "pending";
        this._fulfilledQueues = [];
        this._rejectedQueues = [];
        try {
            callback(this.resolve.bind(this), this.reject.bind(this));
        } catch (err) {
            this.reject(err);
        }
    }
    resolve(result) {
        const run = () => {
            if (this.state !== "pending") return;
            this.state = "fulfilled";
            // 依次执行成功队列中的函数，并清空队列
            const runFulfilled = (result) => {
                let cb;
                while ((cb = this._fulfilledQueues.shift())) {
                    cb(result);
                }
            };
            // 依次执行失败队列中的函数，并清空队列
            const runRejected = (error) => {
                let cb;
                while ((cb = this._rejectedQueues.shift())) {
                    cb(error);
                }
            };
            /* 如果resolve的参数为Promise对象，则必须等待该Promise对象状态改变后,
                                                                                                                    当前Promsie的状态才会改变，且状态取决于参数Promsie对象的状态
                                                                                                                  */

            if (result instanceof MyPromise) {
                result.then(
                    (result) => {
                        this.result = result;
                        runFulfilled(result);
                    },
                    (err) => {
                        this.result = err;
                        runRejected(err);
                    }
                );
            } else {
                this.result = result;
                runFulfilled(result);
            }
        };
        // 为了支持同步的Promise，这里采用异步调用
        setTimeout(run, 0);
    }
    reject(err) {
            if (this.state !== "pending") return;
            this.result = err;
            this.state = "rejected";
        }
        // 添加then方法
    then(onFulfilled, onRejected) {
        const { result, state } = this;
        // 返回一个新的Promise对象
        return new MyPromise((onFulfilledNext, onRejectedNext) => {
            // 封装一个成功时执行的函数
            let fulfilled = (result) => {
                try {
                    if (typeof onFulfilled !== "function") {
                        onFulfilledNext(result);
                    } else {
                        let res = onFulfilled(result);
                        if (res instanceof MyPromise) {
                            // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
                            res.then(onFulfilledNext, onRejectedNext);
                        } else {
                            //否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
                            onFulfilledNext(res);
                        }
                    }
                } catch (err) {
                    // 如果函数执行出错，新的Promise对象的状态为失败
                    onRejectedNext(err);
                }
            };
            // 封装一个失败时执行的函数
            let rejected = (error) => {
                try {
                    if (typeof onFulfilled !== "function") {
                        onRejectedNext(error);
                    } else {
                        let res = onRejected(error);
                        if (res instanceof MyPromise) {
                            // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
                            res.then(onFulfilledNext, onRejectedNext);
                        } else {
                            //否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
                            onFulfilledNext(res);
                        }
                    }
                } catch (err) {
                    // 如果函数执行出错，新的Promise对象的状态为失败
                    onRejectedNext(err);
                }
            };
            switch (state) {
                // 当状态为pending时，将then方法回调函数加入执行队列等待执行
                case "pending":
                    this._fulfilledQueues.push(fulfilled);
                    this._rejectedQueues.push(rejected);
                    break;
                    // 当状态已经改变时，立即执行对应的回调函数
                case "fulfilled":
                    fulfilled(result);
                    break;
                case "rejected":
                    rejected(result);
                    break;
            }
        });
    }
    catch (onRejected) {
        return this.then(undefined, onRejected);
    }
}
let a = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(66);
    }, 2000);
});
console.log(a);
a.then((r) => {
    console.log(r);
});
// let docStr = "<table><tbody>";
// for (let i = 9; i > 0; i--) {
//     docStr += "<tr>";
//     for (let j = i; j <= 9; j++) {
//         docStr += `<td>&nbsp;<span>${i}*${j}=${i * j}&nbsp;</span></td>`;
//     }
//     docStr += "</tr>";
// }
// for (let i = 9; i > 0; i--) {
//     docStr += "<tr>";
//     for (let j = 1; j <= i; j++) {
//         docStr += `<td>&nbsp;<span>${i}*${j}=${i * j}&nbsp;</span></td>`;
//     }
//     docStr += "</tr>";
// }
// for (let i = 1; i <= 9; i++) {
//     docStr += "<tr>";
//     for (let j = 1; j <= i; j++) {
//         docStr += `<td>&nbsp;<span>${i}*${j}=${i * j}&nbsp;</span></td>`;
//     }
//     docStr += "</tr>";
// }
// for (let i = 1; i <= 9; i++) {
//     docStr += "<tr>";
//     for (let j = i; j <= 9; j++) {
//         docStr += `<td>&nbsp;<span>${i}*${j}=${i * j}&nbsp;</span></td>`;
//     }
//     docStr += "</tr>";
// }
// docStr += "</tbody></table>";
// document.write(docStr);