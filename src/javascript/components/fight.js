import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  const { health: firstFighterHealth, attack: firstFighterAttack } = firstFighter;
  const { health: secondFighterHealth, attack: secondFighterAttack } = secondFighter;

  let playerOneBlocked = false;
  let playerTwoBlocked = false;

  let firstPlayerCombinationActive = true;
  let secondPlayerCombinationActive = true;

  let combinationSequence = [];

  const firstFighterHealthBar = document.getElementById('left-fighter-indicator');
  const secondFighterHealthBar = document.getElementById('right-fighter-indicator');

  return new Promise((resolve) => {
    document.addEventListener('keydown', function(e) {
      if (controls.PlayerOneCriticalHitCombination.includes(e.code) || controls.PlayerTwoCriticalHitCombination.includes(e.code)) {
        combinationSequence.push(e.code);
      } else {
        switch (e.code) {
          case controls.PlayerOneBlock:
            playerOneBlocked = true;
            break;
          case controls.PlayerTwoBlock:
            playerTwoBlocked = true;
            break;
          default:
            console.log("another keydown");
        }
      }
    });

    document.addEventListener('keyup', function(e) {
      let combination = e.code;
      combinationSequence.length === 3 
        && controls.PlayerOneCriticalHitCombination.sort().every(function(value, index) { return value === combinationSequence.sort()[index]}) ?
        combination = controls.PlayerOneCriticalHitCombination
        : controls.PlayerTwoCriticalHitCombination.sort().every(function(value, index) { return value === combinationSequence.sort()[index]}) 
        ? combination = controls.PlayerTwoCriticalHitCombination : null;

      switch(combination) {
        case controls.PlayerOneCriticalHitCombination:
          if (firstPlayerCombinationActive) {
            secondFighter.health -= firstFighterAttack * 2;
            showCurrentHealth(secondFighter, firstFighterHealth, secondFighterHealthBar, resolve, firstFighter);
          }
          firstPlayerCombinationActive = false;
          setTimeout(() => firstPlayerCombinationActive = true, 10000)
          break;
        case controls.PlayerTwoCriticalHitCombination:
          if (secondPlayerCombinationActive) {
            firstFighter.health -= secondFighterAttack * 2
            showCurrentHealth(firstFighter, firstFighterHealth, firstFighterHealthBar, resolve, secondFighter);
          }
          secondPlayerCombinationActive = false;
          setTimeout(() => secondPlayerCombinationActive = true, 10000)
          break;
        case controls.PlayerOneBlock:
          playerOneBlocked = false;
          break;
        case controls.PlayerTwoBlock:
          playerTwoBlocked = false;
          break;
        default:
          console.log("another keyup");
      }
      combinationSequence.pop(e.code);
    });

    document.addEventListener("keypress", function(e){
      switch(e.code) {
        case controls.PlayerOneAttack:
          if (!playerOneBlocked) {
            setTimeout(()=> {
              playerTwoBlocked ?
                secondFighter.health -= getDamage(firstFighter, secondFighter) :
                secondFighter.health -= getDamage(firstFighter);
              showCurrentHealth(secondFighter, secondFighterHealth, secondFighterHealthBar, resolve, firstFighter);
            }, 0);
          }
          break;
        case controls.PlayerTwoAttack:
          if (!playerTwoBlocked) {
            setTimeout(()=> {
              playerOneBlocked ?
                firstFighter.health -= getDamage(secondFighter, firstFighter) :
                firstFighter.health -= getDamage(secondFighter);
              showCurrentHealth(firstFighter, firstFighterHealth, firstFighterHealthBar, resolve, secondFighter);
            }, 0);
          }
          break;
        default:
          console.log("another keypress");
      }
    });

  });
}

export function getDamage(attacker, defender) {
  let damage = getHitPower(attacker);
  if (defender) {
    damage -= getBlockPower(defender);
  }
  return damage < 0 ? 0 : damage;
}

export function getHitPower(fighter) {
  let power = null;
  power = fighter.attack * Math.random()* 2;
  return power;
}

export function getBlockPower(fighter) {
  let block = null;
  block =  fighter.defense * (Math.random() * 2);
  return block;
}

function showCurrentHealth(current, basic, el, resolve, winner) {
  const result  = current.health / basic * 100;
  if (result > 0) {
    el.style.width = `${result}%`;
  } else {
    el.style.width = `0%`;
    resolve(winner);
  }
  return result;
}