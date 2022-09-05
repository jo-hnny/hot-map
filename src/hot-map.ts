import { Sprite, Application, Texture } from "./pixi";
import middleImg from "./assets/4-hov.svg";
import highImg from "./assets/5-hov.svg";
import lowImg from "./assets/1-hov.svg";
import { randNumber, randText } from "@ngneat/falso";
import _ from "lodash";
import "./index.less";

// PIXI.extensions.remove(PIXI.InteractionManager);

interface ISprite extends Sprite {
  _customData?: any;
}

function getParamByUrl(key: string) {
  const searchParams = new URL(window.location.href)?.searchParams;
  return searchParams?.get(key);
}

const MaxItem = +(getParamByUrl("max") ?? 5) * 10000;

let itemSize = 50;

let minSpace = 1;

function main() {
  // console.log("is webgl", PIXI.utils.isWebGLSupported());
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight - 5;

  const rowNum = Math.floor(windowWidth / (itemSize + minSpace));

  const rowSpace = (windowWidth - rowNum * itemSize) / (rowNum - 1);

  console.log(rowNum, rowSpace);

  const pop = document.querySelector(".pop") as HTMLDivElement;

  const app = new Application({
    width: windowWidth,
    height: windowHeight,
  });

  // const pc = new PIXI.ParticleContainer(MaxItem, {
  //   scale: true,
  // });

  // app.stage.addChild(pc);

  document.body.appendChild(app.view);

  const svgSize = { resourceOptions: { scale: 2 }, width: 100, height: 100 };

  const textures = {
    low: Texture.from(lowImg, svgSize),
    middle: Texture.from(middleImg, svgSize),
    high: Texture.from(highImg, svgSize),
  };

  const dudes = [...new Array(MaxItem)].map((_, index) => {
    const y = Math.floor(index / rowNum) * (itemSize + 5);

    const x = (index % rowNum) * (itemSize + rowSpace);

    const status = ["low", "middle", "high"][randNumber({ min: 0, max: 2 })] as
      | "low"
      | "middle"
      | "high";
    const dude: ISprite = new Sprite(textures[status]);

    // dude.tint = Math.random() * 0xffffff;

    dude._customData = {
      clusterId: randText(),
      status,
    };

    dude.width = itemSize;
    dude.height = itemSize;

    dude.x = x;

    dude.y = y;

    dude.interactive = true;

    if (y > windowHeight) {
      dude.visible = false;
      dude.interactive = false;
    }

    app.stage.addChild(dude);

    return dude;
  });

  app.stage.interactive = true;

  app.stage.hitArea = app.renderer.screen;

  app.stage.addListener("click", (e) => {
    console.log("clicked", e.target);
    if (e.target.isSprite) {
      const { clusterId, status } = e.target._customData;

      pop.innerHTML = `clusterId: ${clusterId} \n status: ${status}`;

      pop.style.setProperty("top", `${e.target.y}px`);
      pop.style.setProperty("left", `${e.target.x}px`);

      pop.style.setProperty("display", "block");
    } else {
      pop.style.setProperty("display", "none");
    }
  });

  function handleMouseWhell(e: WheelEvent) {
    // console.log("whell", e.deltaY);

    if (e.deltaY < 0) {
      itemSize *= 0.95;
      minSpace *= 0.95;

      if (itemSize < 1) itemSize = 2;

      if (minSpace < 1) minSpace = 1;
    } else {
      itemSize *= 1.05;
      minSpace *= 1.05;

      if (itemSize > 100) itemSize = 100;

      if (minSpace > 5) minSpace = 5;
    }

    // console.log("item size", itemSize);

    const rowNum = Math.floor(windowWidth / (itemSize + minSpace));

    const rowSpace = (windowWidth - rowNum * itemSize) / (rowNum - 1);

    dudes.forEach((dude, index) => {
      const y = Math.floor(index / rowNum) * (itemSize + 5);

      if (y > windowHeight) {
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

  const throttleHandleMouseWhell = _.throttle(handleMouseWhell, 1000 / 30);

  app.view.addEventListener("wheel", (e: WheelEvent) => {
    throttleHandleMouseWhell(e);
  });
}

main();

// TODO
/**
 *
 *
 */
