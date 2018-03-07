// mouseenter/mouseleave事件使用mouseover/mouseout处理
const specialEvent = {
    mouseenter: 'mouseover',
    mouseleave: 'mouseout'
};

// 事件绑定，支持委托
export function on(el, eventName, selector, listener) {
    if (typeof selector === 'function') {
        listener = selector;
        selector = undefined;
    }

    el.addEventListener(specialEvent[eventName] || eventName, evt => {
        let eventTarget = evt.target;
        // 事件委托
        if (selector) {
            let triggerEls = el.querySelectorAll(selector);
            let isTrigger = false;

            // 向上查找触发的元素以判断是否触发事件
            for (; eventTarget && eventTarget !== el; eventTarget = eventTarget.parentNode || el) {
                if (contains(triggerEls, eventTarget)) {
                    isTrigger = true;
                    break;
                }
            }
            if (!isTrigger) return;
            // 针对mousenter/mouseleave，如果还在当前元素或其子元素中则不触发listener
            if (eventName === 'mouseenter' || eventName === 'mouseleave') {
                if (evt.relatedTarget && (eventTarget === evt.relatedTarget || domContains(eventTarget, evt.relatedTarget))) return;
            }
            evt.eventTarget = eventTarget;
        }
        listener && listener(evt);
    }, false);
}

// 解除事件绑定
export function off(el, eventName, handler) {
    element.removeEventListener(eventName, handler);
}

// 是否包含子元素
export function contains(nodeList, item) {
    return indexOf(nodeList, item) > -1;
}

// 子元素索引
export function indexOf(nodeList, item) {
    return Array.prototype.indexOf.call(nodeList, item);
}

// 判断一个元素是否包含另一个元素
export function domContains(a, b) {
    let adown = a.nodeType === 9 ? a.documentElement : a;
    let bup = b && b.parentNode;
    return a === bup || !!(bup && bup.nodeType === 1 && (
        adown.contains ?
            adown.contains( bup ) :
            a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16
    ));
}