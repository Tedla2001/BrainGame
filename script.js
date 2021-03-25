// global constants
const clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables
//Optional3
var pattern = [];
function randPattern() {
  //parseInt(5 + Math.random() * 7)
  for (let i = 0; i < 3; i++) {
    pattern[i] = parseInt(1 + Math.random() * 6);
  }
  return pattern;
}
var mistake = 2
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5; //must be between 0.0 and 1.0
var guessCounter = 0;

function startGame() {
  //initialize game variables
  progress = 0;
  mistake = 3;
  gamePlaying = true;
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  randPattern();
  playClueSequence();
}

function stopGame() {
  progress = 0;
  gamePlaying = false;
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

//optional audio
var cow = new Audio("https://cdn.glitch.com/e2fbd0f2-458c-4e4b-a403-7dd922d91a64%2FRinder_muh.mp3?v=1616635750188");
var chicken = new Audio("https://cdn.glitch.com/e2fbd0f2-458c-4e4b-a403-7dd922d91a64%2Fhuehner.mp3?v=1616635929226");
var cat = new Audio("https://cdn.glitch.com/e2fbd0f2-458c-4e4b-a403-7dd922d91a64%2FKatze_miaut.mp3?v=1616636165010");
var duck = new Audio("https://cdn.glitch.com/e2fbd0f2-458c-4e4b-a403-7dd922d91a64%2FEnte_quackt.mp3?v=1616636200274");
var horse = new Audio("https://cdn.glitch.com/e2fbd0f2-458c-4e4b-a403-7dd922d91a64%2Fpferd_whinnert.mp3?v=1616636273037");
var dog = new Audio("https://cdn.glitch.com/e2fbd0f2-458c-4e4b-a403-7dd922d91a64%2Fsalamisound-3561361-bark-and-growl-once-final.mp3?v=1616636444276");



// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  //optional
  5: 600,
  6: 800
}

// function playTone(btn, len) {
//   var temp = freqMap[btn];
//   temp.play();
//   // g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
//   tonePlaying = true;
//   setTimeout(function() {
//     stopTone();
//   }, len);
// }
// function startTone(btn) {
//   if (!tonePlaying) {
//  var temp = freqMap[btn];
//   temp.play();    // g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
//     tonePlaying = true;
//   }
// }

// function stopTone(btn) {
//  var temp = freqMap[btn];
//   temp.pause();
//   temp.currentTime = 0;
  
//   // g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
//   tonePlaying = false;
// }

function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
}
function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence() {
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for (let i = 0; i <= progress; i++) {
    // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

function loseGame() {
  stopGame();
  console.log("mistake" + mistake);
  alert("Game Over. You lost.");
}

function winGame() {
  stopGame();
  alert("Game Over. You won.");
}

function guess(btn) {
  console.log("user guessed: " + btn);

  if (!gamePlaying) {
    return;
  }

  if (pattern[guessCounter] == btn) {
    if (guessCounter == progress) {
      if (progress == pattern.length - 1) {
        winGame();
      } else {
        progress++;
        playClueSequence();
      }
    } else {
      guessCounter++;
    }
  } else {
    if (mistake > 1) {
      for (let i = 0; i < 1; i++) {
        mistake--;
        alert("lost a turn, " + mistake + " remaining");
      }
      playClueSequence();
    } else {
      loseGame();
    }
  }
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);
