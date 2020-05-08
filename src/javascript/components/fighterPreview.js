import { createElement } from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
  let data = [];
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';

  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`,
  });
  if (fighter) {
    const image = createFighterImage(fighter);
    const fighterInfo = createFighterInfo(fighter);
    data = [image, fighterInfo]
    fighterElement.append(...data);
  }

  return fighterElement;
}


const capitalizeWord = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}


function createFighterInfo (fighter) {
  const list = createElement({
    tagName: "ul",
    className: "info-block"
  })
  for (let [key, value] of Object.entries(fighter)) {
    const itemList = createElement({
      tagName: "li",
      className: "info-block__item"
    });

    const title = createElement({
      tagName: "span"
    });

    const val = createElement({
      tagName: "span"
    });

    if (key !== "source" && key !== "_id") {
      title.innerText = capitalizeWord(key);
      val.innerText = value;

      itemList.append(title, val);
      list.appendChild(itemList);
    }
  }
  return list;
}

export function createFighterImage(fighter) {
  const { source, name } = fighter;
  const attributes = { 
    src: source, 
    title: name,
    alt: name 
  };
  const imgElement = createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    attributes,
  });

  return imgElement;
}
