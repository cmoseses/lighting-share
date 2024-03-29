console.clear();

class Engine {
    constructor(nodeCount) {
        this.nodeCount = nodeCount;
        this.nodes = [];
    }
    init() {
        // bind search box
        document.getElementsByName("search")[0].addEventListener('keyup', event => {
            console.log(event.target.value); // todo: add debounce
            this.nodes.forEach(node => node.idFilter = event.target.value)
        });

        // generate nodes
        for (let i = 0; i < this.nodeCount; i++) {
            this.nodes.push(new Node("node" + i, document.getElementById("container"))); // todo: can be faster?
        }
    }

    moveByInterval(interval = 1000) {
        setInterval(() => this.nodes.forEach(node => node.move()), interval);
    }

    moveByRequestAnimationFrame() {
        let animate = (time) => {
            this.nodes.forEach(node => node.move());
            window.requestAnimationFrame(animate);
        }
        window.requestAnimationFrame(animate);
    }
}

class Node {
    constructor(id, container) {
        // init container
        this.containerWidth = window.innerWidth - 16 * 4;
        this.containerHeight = window.innerHeight - 16 * 5;

        this.id = id;
        this.idFilter = '';
        this.container = container;

        // init direction  1 or -1
        this.xSpeed = Math.random() < 0.5 ? -1 : 1;
        this.ySpeed = Math.random() < 0.5 ? -1 : 1;

        // init position
        this.left = Math.floor(Math.random() * (this.containerWidth));
        this.top = Math.floor(Math.random() * (this.containerHeight));

        let nodeElement = document.createElement("div");
        nodeElement.setAttribute("id", id);
        nodeElement.setAttribute("class", "node");
        nodeElement.setAttribute(
            "style",
            `left:${this.left}px;top:${this.top}px;`
        );

        // init div inner text
        nodeElement.innerHTML = id;
        container.appendChild(nodeElement);
        this.nodeElement = nodeElement;
    }

    move() {
        // calculate position
        let targetLeft = this.left + this.xSpeed;
        if (targetLeft > this.containerWidth || targetLeft < 0) {
            this.xSpeed = -this.xSpeed;
        }
        this.left = this.left + this.xSpeed;
        let targetTop = this.top + this.ySpeed;
        if (targetTop > this.containerHeight || targetTop < 0) {
            this.ySpeed = -this.ySpeed;
        }
        this.top = this.top + this.ySpeed;

        // set position
        this.nodeElement.style.left = this.left + "px";
        this.nodeElement.style.top = this.top + "px";

        // search filter
        // replace matching innerHTML with highlight css
        ///////////////////////
        this.nodeElement.innerHTML = this.id.replace(
            new RegExp(this.idFilter, 'gi'), match => `<span class="highlight">${match}</span>`
        )
    }
}

let engine = new Engine(nodeCount=200);
engine.init();
engine.moveByInterval(interval=100);

/*
讲解fps
0. 讲解静止的页面谈论帧率是无效的
1. hardcode fps count = 200 moveByInterval 100： 卡不卡？
1. 如果按照理论值60fps  Interval 应该设置成16.6： 实际上跑出来的效果fps是多少？
2. requestAnimationFrame 来释放fps  moveByRequestAnimationFrame; 看出来的效果是多少？
讲解性能
3. 让性能变得更卡 count = 400
3. 搜索框
*/
