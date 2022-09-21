import * as PIXI from "./pixi";
import middleImg from "./assets/4-hov.svg";
import highImg from "./assets/5-hov.svg";
import lowImg from "./assets/1-hov.svg";
import { randNumber, randText } from "@ngneat/falso";
import _, { size } from "lodash";
import "./index.less";

interface ISprite extends PIXI.Sprite {
  _customData?: any;
}

function getParamByUrl(key: string) {
  const searchParams = new URL(window.location.href)?.searchParams;
  return searchParams?.get(key);
}

const MaxItem = +(getParamByUrl("max") ?? 5) * 10000;

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

let itemSize = 50;

const space = 20;

// 竖向拖动
let startY = 0;
let offsetY = 0;
let dragAble = false;

function main() {
  const pop = document.querySelector(".pop") as HTMLDivElement;

  const app = new PIXI.Application({
    resolution: devicePixelRatio,
    antialias: true,
    resizeTo: window,
  });

  app.stage.interactive = true;

  app.stage.hitArea = app.renderer.screen;

  app.stage.addListener("mousemove", (e) => {
    if (dragAble) return;

    if (e?.target?.isSprite) {
      const { clusterId, status } = e.target._customData;

      pop.innerHTML = `clusterId: ${clusterId} \n status: ${status}`;
      pop.className = `pop ${status}`;

      pop.style.setProperty("top", `${e.target.y}px`);
      pop.style.setProperty("left", `${e.target.x}px`);

      pop.style.setProperty("display", "block");
    } else {
      pop.style.setProperty("display", "none");
      pop.className = "pop";
    }
  });

  document.body.appendChild(app.view);

  const svgSize = { resourceOptions: { scale: 2 } };

  const textures = {
    low: PIXI.Texture.from(lowImg, svgSize),
    middle: PIXI.Texture.from(middleImg, svgSize),
    high: PIXI.Texture.from(highImg, svgSize),
  };

  const dudes = [...new Array(MaxItem)].map((_, index) => {
    const status = ["low", "middle", "high"][randNumber({ min: 0, max: 2 })] as
      | "low"
      | "middle"
      | "high";

    const dude: ISprite = new PIXI.Sprite(textures[status]);

    dude.visible = false;

    dude.interactive = false;

    dude._customData = {
      clusterId: randText(),
      status,
    };

    app.stage.addChild(dude);

    return dude;
  });

  function render() {
    const rowNum = Math.floor(windowWidth / (itemSize + space));
    const rowSpace = (windowWidth - rowNum * itemSize) / (rowNum - 1);

    dudes.forEach((dude, index) => {
      const y = Math.floor(index / rowNum) * (itemSize + space) + offsetY;

      if (y > windowHeight || y < 0 - itemSize) {
        dude.visible = false;

        dude.interactive = false;

        return;
      }

      const x = (index % rowNum) * (itemSize + rowSpace);

      dude.width = itemSize;
      dude.height = itemSize;

      dude.x = x;

      dude.y = y;

      dude.interactive = true;

      dude.visible = true;
    });
  }

  function handleMouseWhell(e: WheelEvent) {
    if (e.deltaY < 0) {
      itemSize *= 0.95;
    } else if (e.deltaY > 0) {
      itemSize *= 1.05;
    }

    if (itemSize < 1) {
      itemSize = 1;
    } else if (itemSize > 100) {
      itemSize = 100;
    }

    render();
  }

  const throttleHandleMouseWhell = _.throttle(handleMouseWhell, 1000 / 30);

  app.view.addEventListener("wheel", (e: WheelEvent) => {
    throttleHandleMouseWhell(e);
  });

  window.addEventListener("resize", () => {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    render();
  });

  // 拖动
  app.view.addEventListener("mousedown", (e) => {
    startY = e.clientY;
    dragAble = true;
  });

  app.view.addEventListener("mousemove", (e) => {
    if (!dragAble) return;

    const endY = e.clientY;
    offsetY += endY - startY;

    render();

    startY = endY;
  });

  app.view.addEventListener("mouseup", () => {
    startY = 0;
    dragAble = false;
  });

  render();

  function animate() {
    render();

    offsetY -= 10;

    requestAnimationFrame(animate);
  }

  // animate();
}

main();

// TODO
/**
 *
 *
 */
