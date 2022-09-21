import * as PIXI from "./pixi";
import middleImg from "./assets/4-hov.svg";
import highImg from "./assets/5-hov.svg";
import lowImg from "./assets/1-hov.svg";
import { randNumber, randText } from "@ngneat/falso";
import _ from "lodash";
import "./index.less";

interface ISprite extends PIXI.Sprite {
  _customData?: any;
}

function getParamByUrl(key: string) {
  const searchParams = new URL(window.location.href)?.searchParams;
  return searchParams?.get(key);
}

const MaxItem = +(getParamByUrl("max") ?? 5) * 10000;

let boxWidth = window.innerWidth;

let itemSize = 50;

const space = 20;

// 拖动
let startY = 0;
let startX = 0;
let dragAble = false;

function main() {
  const pop = document.querySelector(".pop") as HTMLDivElement;

  const app = new PIXI.Application({
    resolution: devicePixelRatio,
    antialias: true,
    resizeTo: window,
  });

  app.stage.pivot.set(window.innerWidth / 2, window.innerHeight / 2);
  app.stage.position.set(window.innerWidth / 2, window.innerHeight / 2);

  app.stage.interactive = true;

  app.stage.hitArea = app.renderer.screen;

  app.stage.addListener("mousemove", (e) => {
    if (dragAble) return;

    if (e?.target?.isSprite) {
      const { x, y } = e?.data?.global;
      const { clusterId, status } = e.target._customData;

      pop.innerHTML = `clusterId: ${clusterId} \n status: ${status}`;
      pop.className = `pop ${status}`;

      pop.style.setProperty("top", `${y}px`);
      pop.style.setProperty("left", `${x}px`);

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

  const rowNum = Math.floor(boxWidth / (itemSize + space));
  const rowSpace = (boxWidth - rowNum * itemSize) / (rowNum - 1);

  [...new Array(MaxItem)].map((_, index) => {
    const status = ["low", "middle", "high"][randNumber({ min: 0, max: 2 })] as
      | "low"
      | "middle"
      | "high";

    const dude: ISprite = new PIXI.Sprite(textures[status]);

    dude.interactive = true;
    dude.buttonMode = true;

    dude._customData = {
      clusterId: randText(),
      status,
    };

    const y = Math.floor(index / rowNum) * (itemSize + space);

    const x = (index % rowNum) * (itemSize + rowSpace);

    dude.width = itemSize;
    dude.height = itemSize;

    dude.x = x;

    dude.y = y;

    app.stage.addChild(dude);

    return dude;
  });

  function handleMouseWhell(e: WheelEvent) {
    let zoom = 1;

    if (e.deltaY < 0) {
      zoom = 1.1;
    } else if (e.deltaY > 0) {
      zoom = 0.9;
    }

    app.stage.scale.set(app.stage.scale.x * zoom);
  }

  const throttleHandleMouseWhell = _.throttle(handleMouseWhell, 1000 / 30);

  app.view.addEventListener("wheel", (e: WheelEvent) => {
    throttleHandleMouseWhell(e);
  });

  // 拖动
  app.view.addEventListener("mousedown", (e) => {
    startY = e.clientY;
    startX = e.clientX;

    dragAble = true;
  });

  app.view.addEventListener("mousemove", (e) => {
    if (!dragAble) return;

    const endY = e.clientY;
    const offsetY = endY - startY;

    const endX = e.clientX;
    const offsetX = endX - startX;

    app.stage.x += offsetX;
    app.stage.y += offsetY;

    startY = endY;
    startX = endX;
  });

  app.view.addEventListener("mouseup", () => {
    startY = 0;
    startX = 0;
    dragAble = false;
  });
}

main();

// TODO
/**
 *
 *
 */
