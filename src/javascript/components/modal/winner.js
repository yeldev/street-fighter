import { showModal } from "./modal";
import { createElement } from "../../helpers/domHelper";
import { createFighterImage, createFighterInfo } from "../fighterPreview";

function onClose() {
  window.location.reload();
};

export function showWinnerModal(fighter) {
  let data = [];

  const bodyElement = createElement({
    tagName: "div",
    className: "modal-body"
  });

  const winnerImg = createFighterImage(fighter);
  const infoContainer = createFighterInfo({health: Math.floor(fighter.health)});

  data = [winnerImg, infoContainer];
  bodyElement.append(...data);

  showModal({
    title: `Winner: ${fighter.name}`,
    bodyElement,
    onClose
  });

}
